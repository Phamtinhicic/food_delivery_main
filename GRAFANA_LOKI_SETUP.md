# Hướng dẫn Setup Dashboard CI/CD Monitoring với Loki

## 🎯 Dashboard Features

Dashboard mới `grafana-cicd-monitoring.json` bao gồm:

### 1. **Deployment Status** ✅❌
- Hiển thị trạng thái deploy hiện tại (Success/Failed/In Progress)
- Dữ liệu từ GitHub Actions workflows

### 2. **Latest Workflow Status** 📋
- Bảng hiển thị lịch sử các lần deploy
- Thông tin: Run number, Branch, Status, Trigger event

### 3. **Test Failures (Loki Logs)** 🔍
- **Logs panel** hiển thị chi tiết các test bị lỗi
- Filter theo keyword: FAIL, Error, failed
- Dữ liệu từ Loki logs

### 4. **Test Error Summary** 📊
- Đếm số lượng tests failed
- Background đỏ khi có lỗi

### 5. **Error Rate Trend** 📈
- Biểu đồ error rate theo thời gian
- Giúp phát hiện xu hướng tăng error

### 6. **Build Duration** ⏱️
- Thời gian build theo từng workflow run
- Thresholds: Green < 5min, Yellow < 10min, Red > 10min

### 7. **Deployment Frequency** 🚀
- Số lần deploy trong khoảng thời gian

### 8. **Success Rate** 🎯
- Gauge hiển thị % deploy thành công
- Green > 90%, Yellow 70-90%, Red < 70%

### 9. **Recent Commits** 💬
- Bảng hiển thị commits gần đây

### 10. **Failed Tests Details** 📝
- Bảng chi tiết các tests bị fail từ Loki
- Format: Time | Test Name | Error Message

### 11. **Application Logs Stream** 📜
- Live stream toàn bộ logs từ GitHub Actions
- Có thể search, filter theo labels

### 12. **Pull Requests Status** 🔀
- Tracking PRs (Open/Closed/Merged)

### 13. **Issues Tracking** 🐛
- Danh sách issues đang open

### 14. **System Health - Error Types** 🥧
- Pie chart phân loại errors theo level

### 15. **Deployment Timeline** ⏳
- Timeline visualization của các lần deploy

---

## 🔧 Setup Instructions

### Bước 1: Cấu hình Loki Data Source

1. Vào Grafana Cloud → **Connections** → **Data sources**
2. Tìm **"Loki"** data source (có sẵn trong Grafana Cloud)
3. Copy **URL** (dạng: `https://logs-prod-XXX.grafana.net/loki/api/v1/push`)
4. Copy **User ID** (instance ID)

### Bước 2: Add GitHub Secrets

Vào GitHub repo → **Settings** → **Secrets and variables** → **Actions**

Add 3 secrets mới cho Loki:

**Secret 1: GRAFANA_CLOUD_LOKI_URL**
```
https://logs-prod-XXX.grafana.net/loki/api/v1/push
```

**Secret 2: GRAFANA_CLOUD_LOKI_USER**
```
<instance-id>
```

**Secret 3: GRAFANA_CLOUD_API_KEY** (dùng chung với Prometheus)
```
<api-key-đã-tạo>
```

### Bước 3: Import Dashboard

1. Upload file `grafana-cicd-monitoring.json` vào Grafana
2. Chọn data sources:
   - **GitHub**: `grafana-github-datasource`
   - **Loki**: `grafanacloud-logs` (hoặc tên Loki datasource của bạn)
3. Click **Import**

### Bước 4: Test

1. Push code hoặc chạy workflow manually
2. Workflow sẽ:
   - Chạy tests
   - Capture logs → file `test-output.log`
   - Parse logs và push lên Loki
   - Push metrics lên Prometheus
3. Check dashboard sau 1-2 phút

---

## 📊 Loki Query Examples

Các query Loki hữu ích:

### Tìm tests failed:
```logql
{job="github-actions"} |= "FAIL" or "Error" or "failed"
```

### Filter theo branch:
```logql
{job="github-actions", branch="main"} |= "Error"
```

### Count errors:
```logql
sum(count_over_time({job="github-actions"} |= "FAIL" [1h]))
```

### Failed tests với context:
```logql
{job="github-actions"} |= "FAIL" | json | line_format "{{.test}} - {{.error}}"
```

---

## 🎨 Tùy chỉnh Dashboard

### Thêm Alert cho test failures:
1. Edit panel "Test Error Summary"
2. Tab **Alert** → **Create alert rule**
3. Condition: `sum(count_over_time({job="github-actions"} |= "FAIL" [5m])) > 0`
4. Set notification channel (Email, Slack, etc.)

### Filter theo môi trường:
Thêm variable `environment`:
1. Dashboard settings → **Variables** → **Add variable**
2. Name: `environment`
3. Query: `label_values(branch)`
4. Dùng trong queries: `{branch="$environment"}`

### Custom panels:
- **Test Coverage**: Thêm panel tracking code coverage
- **API Response Time**: Monitor API performance
- **Database Queries**: Track slow queries

---

## 🔍 Troubleshooting

### Dashboard không hiển thị dữ liệu?

**Check GitHub datasource:**
```bash
# Vào Grafana → Connections → Data sources → GitHub
# Test connection
```

**Check Loki datasource:**
```bash
# Grafana → Explore → Chọn Loki
# Query: {job="github-actions"}
```

**Verify secrets trong GitHub:**
- Settings → Secrets → Actions
- Phải có đủ 6 secrets:
  - `GRAFANA_CLOUD_PROM_URL`
  - `GRAFANA_CLOUD_USER`
  - `GRAFANA_CLOUD_API_KEY`
  - `GRAFANA_CLOUD_LOKI_URL`
  - `GRAFANA_CLOUD_LOKI_USER`
  - `DOCKERHUB_USERNAME`
  - `DOCKERHUB_TOKEN`

**Check workflow logs:**
```
GitHub → Actions → Chọn workflow run
→ Xem logs của step "Push test logs to Loki"
```

### Logs không push lên Loki?

1. Verify Loki URL đúng format:
   ```
   https://logs-prod-XXX.grafana.net/loki/api/v1/push
   ```

2. Check API key có quyền `LogsWriter`

3. Test push log manually:
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -u "<user>:<api-key>" \
     -d '{"streams":[{"stream":{"job":"test"},"values":[["'$(date +%s)000000000'","test message"]]}]}' \
     "https://logs-prod-XXX.grafana.net/loki/api/v1/push"
   ```

---

## 📚 Best Practices

1. **Log Retention**: Cấu hình retention policy cho Loki (default 30 days)

2. **Log Sampling**: Nếu logs quá nhiều, có thể sample:
   ```bash
   # Chỉ push error logs
   if [ "$LEVEL" == "error" ]; then
     # push to Loki
   fi
   ```

3. **Labels**: Thêm labels hữu ích:
   - `environment` (dev/staging/prod)
   - `service` (backend/frontend/admin)
   - `version` (commit SHA)

4. **Dashboard Variables**: Dùng variables để switch giữa repos, branches

5. **Alerts**: Setup alerts cho:
   - Test failures
   - Build duration > threshold
   - Deploy failures
   - Error rate spike

---

## 🚀 Next Steps

1. **Thêm metrics từ services**:
   - Application metrics (requests/sec, latency)
   - Database metrics
   - Cache hit rate

2. **Distributed Tracing**:
   - Tích hợp Tempo cho tracing
   - Track request flows

3. **Advanced Dashboards**:
   - SLO/SLI dashboard
   - Incident response dashboard
   - Cost analysis dashboard

4. **Auto-remediation**:
   - Webhook alerts → auto-rollback
   - Auto-restart failed services

---

Dashboard này giúp bạn:
- ✅ Monitor deployment status real-time
- ✅ Track test failures với logs chi tiết
- ✅ Phân tích performance trends
- ✅ Phát hiện issues nhanh hơn
- ✅ Improve developer productivity

Chúc monitoring vui vẻ! 🎉
