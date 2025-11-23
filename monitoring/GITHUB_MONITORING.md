# 📊 Giám Sát GitHub với Grafana

Có **3 cách** để Grafana giám sát GitHub repository:

---

## 🎯 Cách 1: GitHub Actions + Prometheus Pushgateway (Khuyến nghị)

Tự động push metrics mỗi khi có commit/push lên GitHub.

### Bước 1: Cài Pushgateway

```powershell
# Download Pushgateway
$version = "1.6.2"
$url = "https://github.com/prometheus/pushgateway/releases/download/v$version/pushgateway-$version.windows-amd64.zip"
Invoke-WebRequest -Uri $url -OutFile "$env:TEMP\pushgateway.zip" -UseBasicParsing
Expand-Archive "$env:TEMP\pushgateway.zip" -DestinationPath "C:\pushgateway" -Force

# Start Pushgateway
cd C:\pushgateway\pushgateway-*
Start-Process -FilePath ".\pushgateway.exe" -WindowStyle Hidden

# Pushgateway chạy trên: http://localhost:9091
```

### Bước 2: Thêm vào Prometheus config

File: `C:\prometheus\prometheus-*\prometheus.yml`

```yaml
scrape_configs:
  # Thêm vào cuối file
  - job_name: 'pushgateway'
    honor_labels: true
    static_configs:
      - targets: ['localhost:9091']
```

Restart Prometheus:
```powershell
Stop-Process -Name "prometheus" -Force
cd C:\prometheus\prometheus-*
Start-Process -FilePath ".\prometheus.exe" -ArgumentList "--config.file=prometheus.yml" -WindowStyle Hidden
```

### Bước 3: Tạo GitHub Action

Tạo file `.github/workflows/metrics.yml` trong repository:

```yaml
name: Push Metrics to Grafana

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Get full git history

      - name: Calculate metrics
        id: metrics
        run: |
          # Total commits
          COMMITS=$(git rev-list --count HEAD)
          
          # Files changed in last commit
          FILES_CHANGED=$(git diff-tree --no-commit-id --name-only -r HEAD | wc -l)
          
          # Lines added/removed
          LINES_ADDED=$(git diff HEAD~1 HEAD --numstat | awk '{sum+=$1} END {print sum}')
          LINES_REMOVED=$(git diff HEAD~1 HEAD --numstat | awk '{sum+=$2} END {print sum}')
          
          # Repository size
          REPO_SIZE=$(du -sk . | cut -f1)
          
          echo "commits=$COMMITS" >> $GITHUB_OUTPUT
          echo "files_changed=$FILES_CHANGED" >> $GITHUB_OUTPUT
          echo "lines_added=$LINES_ADDED" >> $GITHUB_OUTPUT
          echo "lines_removed=$LINES_REMOVED" >> $GITHUB_OUTPUT
          echo "repo_size=$REPO_SIZE" >> $GITHUB_OUTPUT

      - name: Push metrics to Pushgateway
        env:
          PUSHGATEWAY_URL: ${{ secrets.PUSHGATEWAY_URL }}
        run: |
          cat <<EOF | curl --data-binary @- ${PUSHGATEWAY_URL}/metrics/job/github_repo/instance/${GITHUB_REPOSITORY}
          # TYPE github_total_commits gauge
          github_total_commits{repository="${GITHUB_REPOSITORY}",branch="${GITHUB_REF_NAME}"} ${{ steps.metrics.outputs.commits }}
          
          # TYPE github_files_changed gauge
          github_files_changed{repository="${GITHUB_REPOSITORY}",branch="${GITHUB_REF_NAME}"} ${{ steps.metrics.outputs.files_changed }}
          
          # TYPE github_lines_added gauge
          github_lines_added{repository="${GITHUB_REPOSITORY}",branch="${GITHUB_REF_NAME}"} ${{ steps.metrics.outputs.lines_added }}
          
          # TYPE github_lines_removed gauge
          github_lines_removed{repository="${GITHUB_REPOSITORY}",branch="${GITHUB_REF_NAME}"} ${{ steps.metrics.outputs.lines_removed }}
          
          # TYPE github_repo_size_kb gauge
          github_repo_size_kb{repository="${GITHUB_REPOSITORY}"} ${{ steps.metrics.outputs.repo_size }}
          EOF
```

### Bước 4: Thêm Secret vào GitHub

1. Vào repository → Settings → Secrets → Actions
2. Thêm secret: `PUSHGATEWAY_URL` = `http://your-server-ip:9091`

### Bước 5: Tạo Dashboard trong Grafana

Query ví dụ:
```promql
# Total commits
github_total_commits

# Lines added over time
rate(github_lines_added[5m])

# Files changed per commit
github_files_changed

# Repository size growth
github_repo_size_kb
```

---

## 🔌 Cách 2: GitHub Data Source Plugin (Dễ nhất)

Grafana có plugin trực tiếp cho GitHub.

### Cài đặt:

```powershell
# Vào thư mục Grafana plugins
cd C:\grafana\grafana-v11.3.0\data\plugins

# Download GitHub datasource plugin
$url = "https://github.com/grafana/github-datasource/releases/latest/download/grafana-github-datasource.zip"
Invoke-WebRequest -Uri $url -OutFile "github-datasource.zip" -UseBasicParsing
Expand-Archive "github-datasource.zip" -DestinationPath "." -Force

# Restart Grafana
Stop-Process -Name "grafana-server" -Force
cd C:\grafana\grafana-v11.3.0\bin
Start-Process -FilePath ".\grafana-server.exe" -WindowStyle Hidden
```

### Cấu hình trong Grafana:

1. **Tạo GitHub Personal Access Token:**
   - Vào GitHub → Settings → Developer settings → Personal access tokens
   - Generate token với permissions: `repo`, `read:org`, `read:user`

2. **Add Data Source trong Grafana:**
   - Configuration → Data Sources → Add data source
   - Chọn "GitHub"
   - Nhập token
   - Save & Test

3. **Tạo Dashboard:**
   - Xem commits, PRs, issues, contributors
   - Query trực tiếp từ GitHub API

---

## 📡 Cách 3: GitHub Exporter (Chi tiết nhất)

Chạy exporter riêng để thu thập metrics từ GitHub API.

### Installation:

```powershell
# Download GitHub Exporter
$url = "https://github.com/infinityworks/github-exporter/releases/download/0.1.0/github-exporter_windows_amd64.exe"
New-Item -ItemType Directory -Path "C:\github_exporter" -Force | Out-Null
Invoke-WebRequest -Uri $url -OutFile "C:\github_exporter\github-exporter.exe" -UseBasicParsing

# Tạo config file
$config = @"
github:
  token: YOUR_GITHUB_TOKEN
  repos:
    - Phamtinhicic/food_delivery_main
  orgs: []
  users:
    - Phamtinhicic

metrics:
  port: 9171
"@
Set-Content -Path "C:\github_exporter\config.yml" -Value $config

# Start exporter
cd C:\github_exporter
Start-Process -FilePath ".\github-exporter.exe" -ArgumentList "-config", "config.yml" -WindowStyle Hidden
```

### Thêm vào Prometheus:

```yaml
scrape_configs:
  - job_name: 'github'
    static_configs:
      - targets: ['localhost:9171']
```

### Metrics có sẵn:

- `github_repo_stars` - Số stars
- `github_repo_forks` - Số forks
- `github_repo_open_issues` - Issues mở
- `github_repo_watchers` - Watchers
- `github_repo_size` - Kích thước repo
- `github_repo_open_pull_requests` - PRs mở

---

## 🎨 Dashboard Samples

### Panel 1: Commit Activity
```promql
sum(rate(github_commits_total[1h])) by (repository)
```

### Panel 2: Pull Requests Status
```promql
github_repo_open_pull_requests{repository="food_delivery_main"}
```

### Panel 3: Repository Growth
```promql
github_repo_size_kb
```

### Panel 4: Contributors Activity
```promql
count(github_commits_total) by (author)
```

---

## 📊 Dashboard Templates

Import sẵn từ Grafana.com:

- **GitHub Stats**: Dashboard ID `14000`
- **GitHub Overview**: Dashboard ID `13888`
- **GitHub Repos**: Dashboard ID `12831`

---

## 🚀 Quick Start (Khuyến nghị cho bạn)

**Cách nhanh nhất - Dùng GitHub Plugin:**

1. **Tạo GitHub Token:**
   ```
   GitHub → Settings → Developer settings → Personal access tokens
   → Generate new token (classic)
   → Chọn: repo, read:org, read:user
   ```

2. **Cài plugin trong Grafana:**
   ```powershell
   cd C:\grafana\grafana-v11.3.0\bin
   .\grafana-cli.exe plugins install grafana-github-datasource
   Stop-Process -Name "grafana-server" -Force
   .\grafana-server.exe
   ```

3. **Add datasource:**
   - Grafana UI → Configuration → Data Sources
   - Add GitHub datasource
   - Paste token
   - Test & Save

4. **Create Dashboard:**
   - New Dashboard → Add Panel
   - Select GitHub datasource
   - Query: Repository, Issues, PRs, Commits

---

## 📈 Metrics bạn có thể theo dõi:

### Repository Metrics:
- Total commits
- Stars, forks, watchers
- Repository size
- Open issues/PRs
- Contributors count

### Development Activity:
- Commits per day/week
- Lines added/removed
- Files changed
- Pull requests merged
- Issue resolution time

### Team Metrics:
- Top contributors
- Commit frequency by author
- Review response time
- Deployment frequency

---

## 🔒 Security Notes

- **Không commit GitHub token vào code**
- Dùng GitHub Secrets cho CI/CD
- Token chỉ cần read permissions
- Có thể revoke token bất cứ lúc nào

---

## 🎯 Recommended Setup

**Cho project của bạn (food_delivery_main):**

1. ✅ **GitHub Plugin** - Xem overview nhanh
2. ✅ **GitHub Actions + Pushgateway** - Track mỗi commit
3. ✅ **Custom metrics** - Track tests pass/fail, build time

---

## 📚 Resources

- [GitHub Datasource Plugin](https://grafana.com/grafana/plugins/grafana-github-datasource/)
- [Prometheus Pushgateway](https://github.com/prometheus/pushgateway)
- [GitHub API](https://docs.github.com/en/rest)

---

## 💡 Next Steps

Bạn muốn setup cách nào?

1️⃣ **GitHub Plugin** (dễ nhất, 5 phút) - Chỉ cần token
2️⃣ **GitHub Actions** (tự động) - Mỗi push sẽ gửi metrics
3️⃣ **GitHub Exporter** (chi tiết nhất) - Chạy exporter riêng

Tôi có thể giúp bạn setup ngay! 🚀
