# 🚀 CI/CD Monitoring với Grafana + Pushgateway

## ✅ Đã Setup:

- ✅ Pushgateway đang chạy: http://localhost:9091
- ✅ Prometheus đã config Pushgateway
- ✅ GitHub Actions workflow đã tạo: `.github/workflows/monitoring.yml`

---

## 📊 Metrics được track:

### Build Metrics:
- `cicd_build_status` - Trạng thái build (1=success, 0=fail)
- `cicd_build_duration_seconds` - Thời gian build
- `cicd_test_status` - Kết quả test (1=pass, 0=fail)
- `cicd_test_duration_seconds` - Thời gian chạy test

### Code Metrics:
- `cicd_total_commits` - Tổng số commits
- `cicd_files_changed` - Files thay đổi mỗi commit
- `cicd_lines_added` - Lines thêm vào
- `cicd_lines_removed` - Lines xóa đi

### Pipeline Metrics:
- `cicd_pipeline_timestamp` - Thời gian chạy pipeline

---

## 🔧 Setup GitHub Repository

### Bước 1: Thêm Secret vào GitHub

1. Vào repository: https://github.com/Phamtinhicic/food_delivery_main
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**
4. Thêm:
   - Name: `PUSHGATEWAY_URL`
   - Value: `http://your-server-ip:9091` (hoặc nếu test local: `http://localhost:9091`)

**Lưu ý:** Nếu Pushgateway chạy trên máy local, cần expose port ra internet hoặc dùng ngrok:

```powershell
# Dùng ngrok để expose Pushgateway
ngrok http 9091
# Copy HTTPS URL và paste vào GitHub Secret
```

### Bước 2: Commit và Push workflow

```powershell
cd C:\Users\Beetinh\food_delivery_main
git add .github/workflows/monitoring.yml
git commit -m "Add CI/CD monitoring workflow"
git push origin main
```

### Bước 3: Trigger workflow

Mỗi khi push code, workflow sẽ tự động:
1. Build backend
2. Run tests
3. Collect metrics
4. Push metrics vào Pushgateway
5. Prometheus scrape metrics
6. Hiển thị trong Grafana

---

## 📈 Tạo Dashboard trong Grafana

### Query Examples:

#### 1. Build Success Rate
```promql
# Build success rate (%)
avg_over_time(cicd_build_status[1h]) * 100
```

#### 2. Average Build Time
```promql
# Average build duration
avg_over_time(cicd_build_duration_seconds[1d])
```

#### 3. Test Pass Rate
```promql
# Test success rate
avg_over_time(cicd_test_status[1h]) * 100
```

#### 4. Build Trend (Last 24h)
```promql
# Build status over time
cicd_build_status{branch="main"}
```

#### 5. Code Changes
```promql
# Lines added per commit
rate(cicd_lines_added[1h])
```

#### 6. Pipeline Frequency
```promql
# Number of builds per hour
rate(cicd_pipeline_timestamp[1h])
```

### Tạo Dashboard:

1. **Mở Grafana:** http://localhost:3000
2. **New Dashboard** → Add Panel
3. **Select datasource:** Prometheus
4. **Add queries** (ví dụ trên)
5. **Panel types:**
   - Build Status → Stat panel (show current status)
   - Build Duration → Time series graph
   - Success Rate → Gauge panel
   - Code Changes → Bar chart

---

## 🎨 Dashboard Template

### Row 1: Build Overview
- **Panel 1:** Current Build Status (Stat)
  ```promql
  cicd_build_status
  ```
- **Panel 2:** Build Success Rate (Gauge)
  ```promql
  avg_over_time(cicd_build_status[24h]) * 100
  ```
- **Panel 3:** Total Builds Today (Stat)
  ```promql
  count_over_time(cicd_pipeline_timestamp[24h])
  ```

### Row 2: Performance
- **Panel 4:** Build Duration Trend (Graph)
  ```promql
  cicd_build_duration_seconds
  ```
- **Panel 5:** Test Duration (Graph)
  ```promql
  cicd_test_duration_seconds
  ```

### Row 3: Code Quality
- **Panel 6:** Lines Changed (Bar chart)
  ```promql
  cicd_lines_added - cicd_lines_removed
  ```
- **Panel 7:** Files Changed per Commit (Table)
  ```promql
  cicd_files_changed
  ```

### Row 4: Timeline
- **Panel 8:** Build History (Timeline)
  ```promql
  cicd_build_status{branch="main"}
  ```

---

## 🔔 Setup Alerts

### Alert 1: Build Failed
```yaml
Alert Rule:
  Name: Build Failed
  Condition: cicd_build_status < 1
  For: 1m
  Message: "Build failed on branch {{ $labels.branch }}"
```

### Alert 2: Tests Failed
```yaml
Alert Rule:
  Name: Tests Failed
  Condition: cicd_test_status < 1
  For: 1m
  Message: "Tests failed on branch {{ $labels.branch }}"
```

### Alert 3: Slow Build
```yaml
Alert Rule:
  Name: Build Too Slow
  Condition: cicd_build_duration_seconds > 300
  For: 5m
  Message: "Build taking longer than 5 minutes"
```

---

## 🧪 Test Locally (Không cần GitHub)

### Push metrics thủ công:

```powershell
# Test build success
$metrics = "cicd_build_status{repository=`"food_delivery_main`",branch=`"main`"} 1"
Invoke-WebRequest -Uri "http://localhost:9091/metrics/job/cicd_test" -Method Post -Body $metrics

# Test build duration
$metrics = "cicd_build_duration_seconds 45"
Invoke-WebRequest -Uri "http://localhost:9091/metrics/job/cicd_test" -Method Post -Body $metrics

# View in Prometheus
Start-Process "http://localhost:9090/graph?g0.expr=cicd_build_status"
```

---

## 📊 View Metrics

### Pushgateway UI:
http://localhost:9091

Shows all metrics currently stored.

### Prometheus:
http://localhost:9090/graph

Query và visualize metrics:
```promql
cicd_build_status
cicd_build_duration_seconds
cicd_test_status
```

### Grafana:
http://localhost:3000

Create dashboards với queries trên.

---

## 🔄 Workflow

```
┌─────────────┐
│   Git Push  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ GitHub Actions  │
│  - Build        │
│  - Test         │
│  - Collect      │
└──────┬──────────┘
       │
       ▼ (Push metrics)
┌─────────────────┐
│  Pushgateway    │
│  :9091          │
└──────┬──────────┘
       │
       ▼ (Scrape)
┌─────────────────┐
│  Prometheus     │
│  :9090          │
└──────┬──────────┘
       │
       ▼ (Query)
┌─────────────────┐
│    Grafana      │
│    :3000        │
│  📊 Dashboard   │
└─────────────────┘
```

---

## 🛠️ Troubleshooting

### Pushgateway không nhận metrics:

```powershell
# Check Pushgateway status
Invoke-WebRequest -Uri "http://localhost:9091" -UseBasicParsing

# Check process
Get-Process pushgateway

# Restart Pushgateway
Stop-Process -Name "pushgateway" -Force
cd C:\pushgateway\pushgateway-*
Start-Process -FilePath ".\pushgateway.exe" -WindowStyle Hidden
```

### Prometheus không scrape Pushgateway:

```powershell
# Check Prometheus targets
Start-Process "http://localhost:9090/targets"

# Check config
Get-Content C:\prometheus\prometheus-2.54.1.windows-amd64\prometheus.yml

# Restart Prometheus
Stop-Process -Name "prometheus" -Force
cd C:\prometheus\prometheus-2.54.1.windows-amd64
Start-Process -FilePath ".\prometheus.exe" -ArgumentList "--config.file=prometheus.yml" -WindowStyle Hidden
```

### GitHub Actions không push metrics:

1. Check Secret `PUSHGATEWAY_URL` đã đúng
2. Nếu local, cần expose port với ngrok
3. Check workflow logs trong GitHub Actions tab

---

## 💡 Advanced: Deploy Metrics

### Option 1: Ngrok (Nhanh - Test)
```powershell
# Expose Pushgateway
ngrok http 9091

# Copy HTTPS URL vào GitHub Secret
```

### Option 2: VPS Server (Production)
```bash
# Trên server Ubuntu
sudo apt install docker.io
docker run -d -p 9091:9091 prom/pushgateway

# Update GitHub Secret với server IP
```

### Option 3: Cloud Run (Serverless)
Deploy Pushgateway lên Google Cloud Run hoặc AWS ECS

---

## 📚 Extended Metrics

### Thêm deployment metrics:

```yaml
# Trong workflow, thêm step:
- name: Track deployment
  run: |
    cat <<EOF | curl --data-binary @- ${PUSHGATEWAY_URL}/metrics/job/deployment
    deployment_status{environment="production"} 1
    deployment_timestamp $(date +%s)
    EOF
```

### Track Docker build:

```yaml
- name: Build Docker image
  run: |
    docker build -t app:latest .
    IMAGE_SIZE=$(docker images app:latest --format "{{.Size}}")
    
    cat <<EOF | curl --data-binary @- ${PUSHGATEWAY_URL}/metrics/job/docker
    docker_image_size_mb{image="app"} ${IMAGE_SIZE}
    EOF
```

---

## 🎯 Best Practices

1. **Namespace metrics properly:** `cicd_`, `deployment_`, `docker_`
2. **Add labels:** `branch`, `commit`, `environment`
3. **Set retention:** Pushgateway không tự xóa metrics
4. **Use meaningful names:** `build_duration_seconds` thay vì `bd`
5. **Document metrics:** Comment trong workflow

---

## 🚦 Status Check

```powershell
# Check all services
Get-Process grafana-server, prometheus, windows_exporter, pushgateway | Select-Object Name, Id, CPU

# Stop all
Stop-Process -Name "grafana-server","prometheus","windows_exporter","pushgateway" -Force

# Start all
cd C:\grafana\grafana-v11.3.0\bin; Start-Process .\grafana-server.exe -WindowStyle Hidden
cd C:\prometheus\prometheus-2.54.1.windows-amd64; Start-Process .\prometheus.exe -ArgumentList "--config.file=prometheus.yml" -WindowStyle Hidden
cd C:\node_exporter; Start-Process .\windows_exporter.exe -WindowStyle Hidden
cd C:\pushgateway\pushgateway-*; Start-Process .\pushgateway.exe -WindowStyle Hidden
```

---

## ✅ Next Steps

1. ✅ Commit workflow file lên GitHub
2. ✅ Thêm Secret `PUSHGATEWAY_URL`
3. ✅ Push code để trigger workflow
4. ✅ Xem metrics trong Prometheus
5. ✅ Tạo dashboard trong Grafana
6. ✅ Setup alerts cho build failures

---

## 📞 Quick Commands

```powershell
# View Pushgateway metrics
Start-Process "http://localhost:9091"

# View Prometheus targets
Start-Process "http://localhost:9090/targets"

# View Grafana
Start-Process "http://localhost:3000"

# Query in Prometheus
Start-Process "http://localhost:9090/graph?g0.expr=cicd_build_status"
```

Done! 🎉
