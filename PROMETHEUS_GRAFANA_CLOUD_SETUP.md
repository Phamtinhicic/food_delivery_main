# 📊 Hướng dẫn Setup Prometheus & Grafana Cloud để Monitoring trên Railway

## 🎯 Tổng quan

Hệ thống monitoring gồm:
- **Prometheus**: Thu thập metrics từ backend (chạy trên Railway)
- **Grafana Cloud**: Hiển thị dashboard và visualization (FREE tier)
- **Backend**: Đã tích hợp prom-client để expose metrics

---

## 📋 Phần 1: Chuẩn bị Backend (ĐÃ SẴN SÀNG)

Backend của bạn đã có:
- ✅ `prom-client` package đã cài đặt
- ✅ Metrics endpoint `/metrics` 
- ✅ Tracking: HTTP requests, response time, status codes
- ✅ System metrics: CPU, memory

Kiểm tra metrics đang hoạt động:
```bash
# Local
curl http://localhost:4000/metrics

# Production
curl https://your-backend.up.railway.app/metrics
```

---

## 🚀 Phần 2: Deploy Prometheus lên Railway

### Bước 1: Tạo Service Prometheus trên Railway

1. Đăng nhập [Railway](https://railway.app)
2. Mở project `food_delivery_main`
3. Click **"New"** → **"Empty Service"**
4. Đặt tên service: **`prometheus`**

### Bước 2: Connect Repository

1. Trong service `prometheus`, vào tab **"Settings"**
2. Scroll xuống **"Source"**
3. Click **"Connect Repo"**
4. Chọn repository: **`food_delivery_main`**
5. Trong **"Root Directory"**, nhập: **`prometheus`**
6. Railway sẽ tự động detect Dockerfile

### Bước 3: Cấu hình Environment Variables

Vào tab **"Variables"**, thêm:

```bash
PORT=9090
```

### Bước 4: Cập nhật prometheus.yml cho Railway

Sau khi deploy backend lên Railway, bạn cần cập nhật `prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'backend'
    scrape_interval: 10s
    scrape_timeout: 5s
    metrics_path: '/metrics'
    scheme: 'https'  # Railway dùng HTTPS
    static_configs:
      - targets: ['your-backend-url.up.railway.app']  # Thay bằng URL backend thực tế
        labels:
          service: 'backend'
          environment: 'production'
```

**Lấy URL backend từ Railway:**
1. Vào service `backend` trên Railway
2. Tab **"Settings"** → **"Networking"**
3. Copy domain (ví dụ: `backend-production-xxxx.up.railway.app`)

### Bước 5: Generate Public Domain cho Prometheus

1. Vào service `prometheus`
2. Tab **"Settings"** → **"Networking"**
3. Click **"Generate Domain"**
4. Copy URL (ví dụ: `prometheus-production-yyyy.up.railway.app`)
5. **LƯU LẠI URL NÀY** - dùng cho Grafana Cloud

### Bước 6: Deploy

1. Push code lên GitHub (nếu chưa):
```bash
git add .
git commit -m "Add Prometheus monitoring"
git push
```

2. Railway sẽ tự động deploy

3. Kiểm tra Prometheus UI:
   - Truy cập: `https://prometheus-production-yyyy.up.railway.app`
   - Vào **Status** → **Targets**
   - Kiểm tra target `backend` có status **UP** (màu xanh)

---

## 🎨 Phần 3: Setup Grafana Cloud (MIỄN PHÍ)

### Bước 1: Tạo tài khoản Grafana Cloud

1. Truy cập: https://grafana.com/auth/sign-up/create-user
2. Điền thông tin và đăng ký
3. Chọn plan: **"Free Forever"** (14 days of Grafana Pro trial, then Free)
   - Free tier bao gồm:
     - 10,000 series metrics
     - 50 GB logs
     - 50 GB traces
     - 14 days retention
4. Chọn region gần nhất (ví dụ: **Singapore** hoặc **US East**)
5. Đặt tên stack (ví dụ: `food-delivery-monitoring`)

### Bước 2: Kết nối Prometheus Data Source

1. Sau khi tạo stack, bạn sẽ vào Grafana dashboard
2. Click **"Connections"** ở menu bên trái
3. Click **"Data sources"**
4. Click **"Add new data source"**
5. Tìm và chọn **"Prometheus"**

### Bước 3: Cấu hình Prometheus Data Source

Điền thông tin:

**Connection:**
```
Name: Prometheus-Railway-Backend
URL: https://prometheus-production-yyyy.up.railway.app
```
(Thay bằng URL Prometheus thực tế của bạn)

**HTTP settings:**
```
Timeout: 60
```

**Authentication:**
- Để mặc định (No authentication) nếu Prometheus của bạn không có auth
- Nếu muốn bảo mật, xem phần "Bảo mật Prometheus" bên dưới

**Advanced settings:**
```
Scrape interval: 15s
Query timeout: 60s
```

Click **"Save & test"** ở cuối trang

✅ Bạn sẽ thấy: **"Successfully queried the Prometheus API."**

---

## 📊 Phần 4: Tạo Dashboard Thủ Công trên Grafana Cloud

### Bước 1: Tạo Dashboard mới

1. Click **"Dashboards"** ở menu bên trái
2. Click **"New"** → **"New Dashboard"**
3. Click **"Add visualization"**
4. Chọn data source: **"Prometheus-Railway-Backend"**

---

### 📈 Panel 1: HTTP Request Rate (Lượng truy cập/giây)

**Loại panel**: Time series

**Query (PromQL)**:
```promql
rate(http_requests_total{job="backend"}[1m])
```

**Cấu hình**:
1. **Panel title**: `HTTP Request Rate (requests/sec)`
2. **Legend**: 
   - Format: `{{method}} {{route}} {{status_code}}`
   - Mode: `Table`
   - Values: `Mean`, `Last (not null)`
3. **Axis**:
   - Left Y: Unit = `reqps` (requests per second)
4. **Graph styles**:
   - Style: `Line`
   - Fill opacity: `10`
   - Point size: `5`

Click **"Apply"** để lưu panel

---

### 📊 Panel 2: Total Request Rate (Gauge)

**Loại panel**: Gauge

**Query**:
```promql
sum(rate(http_requests_total{job="backend"}[5m]))
```

**Cấu hình**:
1. **Panel title**: `Total Requests/sec (5m avg)`
2. **Thresholds**:
   - Green (Base): `0`
   - Yellow: `50`
   - Red: `100`
3. **Display**:
   - Show threshold labels: `Yes`
   - Show threshold markers: `Yes`

---

### 🔢 Panel 3: Total Requests Counter

**Loại panel**: Stat

**Query**:
```promql
sum(http_requests_total{job="backend"})
```

**Cấu hình**:
1. **Panel title**: `Total Requests`
2. **Value options**:
   - Show: `Calculate` → `Last (not null)`
3. **Graph mode**: `Area`
4. **Color mode**: `Value`
5. **Text size**: 
   - Title: `24`
   - Value: `50`

---

### ⏱️ Panel 4: Response Time (Latency)

**Loại panel**: Time series

**Queries** (Add 2 queries):

**Query A** - 95th percentile:
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="backend"}[5m]))
```
Legend: `95th percentile`

**Query B** - Median:
```promql
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket{job="backend"}[5m]))
```
Legend: `50th percentile (median)`

**Cấu hình**:
1. **Panel title**: `HTTP Request Duration (Latency)`
2. **Axis**:
   - Left Y: Unit = `s` (seconds)
3. **Thresholds**:
   - Green: `< 0.5`
   - Yellow: `0.5 - 1`
   - Red: `> 1`
4. **Legend**: 
   - Mode: `Table`
   - Values: `Mean`, `Max`, `Last`

---

### 🚦 Panel 5: HTTP Status Codes Distribution

**Loại panel**: Time series

**Queries** (Add 3 queries):

**Query A** - Success (2xx):
```promql
rate(http_requests_total{job="backend",status_code=~"2.."}[1m])
```
Legend: `2xx Success`

**Query B** - Client Errors (4xx):
```promql
rate(http_requests_total{job="backend",status_code=~"4.."}[1m])
```
Legend: `4xx Client Error`

**Query C** - Server Errors (5xx):
```promql
rate(http_requests_total{job="backend",status_code=~"5.."}[1m])
```
Legend: `5xx Server Error`

**Cấu hình**:
1. **Panel title**: `HTTP Status Codes`
2. **Axis**: Unit = `reqps`
3. **Series overrides**:
   - Query A: Color = `Green`
   - Query B: Color = `Yellow`
   - Query C: Color = `Red`

---

### 💾 Panel 6: Memory Usage

**Loại panel**: Time series

**Query**:
```promql
process_resident_memory_bytes{job="backend"}
```

**Cấu hình**:
1. **Panel title**: `Memory Usage`
2. **Axis**:
   - Left Y: Unit = `bytes` (IEC)
3. **Thresholds**:
   - Green: `< 500MB`
   - Yellow: `500MB - 1GB`
   - Red: `> 1GB`

---

### 🖥️ Panel 7: CPU Usage

**Loại panel**: Time series

**Query**:
```promql
rate(process_cpu_seconds_total{job="backend"}[1m]) * 100
```

**Cấu hình**:
1. **Panel title**: `CPU Usage (%)`
2. **Axis**:
   - Left Y: Unit = `percent (0-100)`
   - Min: `0`
   - Max: `100`
3. **Thresholds**:
   - Green: `< 50%`
   - Yellow: `50% - 80%`
   - Red: `> 80%`

---

### 📍 Panel 8: Top Endpoints (Bar Chart)

**Loại panel**: Bar chart

**Query**:
```promql
topk(10, sum by(route) (increase(http_requests_total{job="backend"}[5m])))
```

**Cấu hình**:
1. **Panel title**: `Top 10 Endpoints (Last 5 minutes)`
2. **Bar chart options**:
   - Orientation: `Horizontal`
   - Show values: `Always`
3. **Legend**: `{{route}}`

---

### 🔄 Panel 9: Requests by HTTP Method

**Loại panel**: Time series

**Queries** (Add 4 queries):

**Query A**:
```promql
rate(http_requests_total{job="backend",method="GET"}[1m])
```
Legend: `GET`

**Query B**:
```promql
rate(http_requests_total{job="backend",method="POST"}[1m])
```
Legend: `POST`

**Query C**:
```promql
rate(http_requests_total{job="backend",method="PUT"}[1m])
```
Legend: `PUT`

**Query D**:
```promql
rate(http_requests_total{job="backend",method="DELETE"}[1m])
```
Legend: `DELETE`

**Cấu hình**:
1. **Panel title**: `Requests by HTTP Method`
2. **Axis**: Unit = `reqps`

---

### 💥 Panel 10: Error Rate

**Loại panel**: Stat

**Query**:
```promql
sum(rate(http_requests_total{job="backend",status_code=~"5.."}[5m]))
```

**Cấu hình**:
1. **Panel title**: `Server Errors/sec (5xx)`
2. **Thresholds**:
   - Green: `0`
   - Red: `> 0`
3. **Color mode**: `Background`
4. **Text size**: Large

---

## 🎨 Bước 5: Tùy chỉnh Dashboard Layout

### Sắp xếp Panels

1. Click **"Save dashboard"** icon (💾) ở góc trên
2. Đặt tên: `Food Delivery - Traffic Monitoring`
3. Folder: `General` (hoặc tạo folder mới)

### Kéo thả panels để sắp xếp:

**Row 1** (Full width):
- Panel 1: HTTP Request Rate

**Row 2** (3 columns):
- Panel 2: Total Request Rate (Gauge)
- Panel 3: Total Requests Counter
- Panel 10: Error Rate

**Row 3** (2 columns):
- Panel 4: Response Time
- Panel 5: HTTP Status Codes

**Row 4** (2 columns):
- Panel 6: Memory Usage
- Panel 7: CPU Usage

**Row 5** (2 columns):
- Panel 8: Top Endpoints
- Panel 9: Requests by Method

### Cấu hình Dashboard Settings

1. Click ⚙️ **"Dashboard settings"** ở góc trên
2. **General**:
   - Name: `Food Delivery - Traffic Monitoring`
   - Tags: `food-delivery`, `backend`, `monitoring`, `production`
   - Timezone: `Browser Time`
   
3. **Time options**:
   - Auto refresh: `10s`
   - Refresh intervals: `5s,10s,30s,1m,5m,15m,30m,1h`
   - Time range: `Last 1 hour`

4. **Variables** (Optional - tạo filter động):
   - Click **"Variables"** → **"Add variable"**
   - Name: `environment`
   - Type: `Query`
   - Query: `label_values(http_requests_total, environment)`
   - Multi-value: `No`

5. Click **"Save dashboard"**

---

## 🔐 Phần 5: Bảo mật Prometheus (TÙY CHỌN)

### Thêm Basic Authentication cho Prometheus

Nếu muốn bảo vệ Prometheus khỏi truy cập trái phép:

**Cách 1: Sử dụng Railway Private Networking**
1. Trong Railway, vào service `prometheus`
2. Tab **"Settings"** → **"Networking"**
3. Disable **"Public Networking"**
4. Prometheus chỉ accessible trong internal network

**Lưu ý**: Grafana Cloud cần public URL để scrape metrics

**Cách 2: Thêm Basic Auth với Nginx**

Tạo `prometheus/nginx.conf`:
```nginx
server {
    listen 9090;
    
    location / {
        auth_basic "Prometheus";
        auth_basic_user_file /etc/nginx/.htpasswd;
        proxy_pass http://localhost:9090;
    }
}
```

Sau đó update Grafana data source với credentials.

---

## 🧪 Phần 6: Test & Verify

### Test 1: Kiểm tra Backend đang expose metrics

```bash
curl https://your-backend.up.railway.app/metrics
```

Kết quả mong đợi:
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status_code="200"} 123
http_requests_total{method="GET",route="/api/food",status_code="200"} 45
...
```

### Test 2: Kiểm tra Prometheus đang scrape

1. Truy cập Prometheus UI: `https://your-prometheus.up.railway.app`
2. Vào **Status** → **Targets**
3. Kiểm tra:
   - ✅ Target `backend` có State = **UP** (màu xanh)
   - ✅ Last Scrape < 15s ago
   - ✅ No errors

### Test 3: Query trực tiếp trong Prometheus

Trong Prometheus UI → **Graph**:

```promql
# Xem tất cả metrics
{job="backend"}

# Xem request rate
rate(http_requests_total[1m])

# Xem memory
process_resident_memory_bytes
```

### Test 4: Kiểm tra Grafana Dashboard

1. Mở dashboard trong Grafana Cloud
2. Gửi test requests đến backend:
```bash
# Test nhiều requests
for i in {1..50}; do
  curl https://your-backend.up.railway.app/health
  curl https://your-backend.up.railway.app/api/food
done
```

3. Sau 15-30 giây, dashboard sẽ cập nhật với data mới
4. Kiểm tra:
   - ✅ Request Rate tăng lên
   - ✅ Total Requests counter tăng
   - ✅ Response Time hiển thị đúng
   - ✅ Status Codes hiển thị 200 (green)

---

## 🎯 Các Metrics Quan Trọng Cần Monitor

### 1. **Traffic Metrics** (Lượng truy cập)

| Metric | Query | Ý nghĩa | Threshold |
|--------|-------|---------|-----------|
| Request Rate | `rate(http_requests_total[1m])` | Requests/giây | Alert > 1000 |
| Total Requests | `sum(http_requests_total)` | Tổng số requests | Tracking |
| Requests by Method | `rate(http_requests_total[1m]) by (method)` | Phân bổ theo method | - |

### 2. **Performance Metrics** (Hiệu năng)

| Metric | Query | Ý nghĩa | Threshold |
|--------|-------|---------|-----------|
| Latency p95 | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` | 95% requests < X giây | Alert > 1s |
| Latency p50 | `histogram_quantile(0.50, ...)` | Median response time | Alert > 0.5s |

### 3. **Error Metrics** (Lỗi)

| Metric | Query | Ý nghĩa | Threshold |
|--------|-------|---------|-----------|
| Error Rate | `rate(http_requests_total{status_code=~"5.."}[1m])` | Lỗi server/giây | Alert > 0 |
| 4xx Rate | `rate(http_requests_total{status_code=~"4.."}[1m])` | Client errors | Monitor |
| Error % | `sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100` | % requests lỗi | Alert > 1% |

### 4. **Resource Metrics** (Tài nguyên)

| Metric | Query | Ý nghĩa | Threshold |
|--------|-------|---------|-----------|
| Memory | `process_resident_memory_bytes` | RAM đang dùng | Alert > 1GB |
| CPU | `rate(process_cpu_seconds_total[1m]) * 100` | CPU usage % | Alert > 80% |

---

## 🔔 Phần 7: Setup Alerts (Tùy chọn)

### Tạo Alert Rules trong Grafana Cloud

1. Trong dashboard, hover vào panel muốn alert
2. Click **"..."** → **"New alert rule"**
3. Cấu hình alert:

**Alert Rule: High Error Rate**
```
Query: sum(rate(http_requests_total{job="backend",status_code=~"5.."}[5m]))
Condition: WHEN last() OF query(A) IS ABOVE 1
```

**Alert Rule: High Response Time**
```
Query: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="backend"}[5m]))
Condition: WHEN last() OF query(A) IS ABOVE 1
```

**Alert Rule: High Memory**
```
Query: process_resident_memory_bytes{job="backend"}
Condition: WHEN last() OF query(A) IS ABOVE 1073741824  # 1GB
```

4. Cấu hình notification channels:
   - Email
   - Slack
   - Discord
   - Telegram

---

## 📱 Phần 8: Mobile App (Grafana Mobile)

Download Grafana Mobile app để xem dashboard trên điện thoại:

- **iOS**: https://apps.apple.com/app/grafana/id1481657409
- **Android**: https://play.google.com/store/apps/details?id=com.grafana.mobile

Login với tài khoản Grafana Cloud để xem realtime monitoring mọi lúc mọi nơi!

---

## 🐛 Troubleshooting

### Prometheus không scrape được metrics từ backend

**Triệu chứng**: Target `backend` hiển thị **DOWN** (đỏ)

**Nguyên nhân & Giải pháp**:

1. **URL sai**:
   - Kiểm tra URL trong `prometheus.yml`
   - Đảm bảo có scheme `https://`
   - Không có trailing slash `/`

2. **Backend không expose /metrics**:
   ```bash
   curl https://your-backend.up.railway.app/metrics
   ```
   Nếu 404 → Backend chưa có endpoint

3. **CORS hoặc network issues**:
   - Kiểm tra logs trong Railway backend
   - Xem Prometheus logs trong Railway

### Grafana không connect được với Prometheus

**Triệu chứng**: "Error reading Prometheus"

**Giải pháp**:
1. Test URL trong browser: `https://your-prometheus.up.railway.app`
2. Check network trong Grafana data source settings
3. Thử query đơn giản: `up`

### Dashboard không hiển thị data

**Triệu chứng**: "No data"

**Giải pháp**:
1. Check time range (thử "Last 5 minutes")
2. Verify query trong Explore:
   - Menu → **Explore**
   - Chọn Prometheus data source
   - Test query: `http_requests_total`
3. Kiểm tra labels có đúng không (`job="backend"`)

### Metrics không update realtime

**Giải pháp**:
1. Check auto-refresh interval (góc trên dashboard)
2. Set refresh = 10s hoặc 30s
3. Kiểm tra scrape interval trong Prometheus

---

## 📚 Tài Liệu Tham Khảo

### PromQL (Prometheus Query Language)
- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Query Examples](https://prometheus.io/docs/prometheus/latest/querying/examples/)
- [Functions](https://prometheus.io/docs/prometheus/latest/querying/functions/)

### Grafana
- [Grafana Dashboards](https://grafana.com/docs/grafana/latest/dashboards/)
- [Panel Types](https://grafana.com/docs/grafana/latest/panels-visualizations/)
- [Alerting](https://grafana.com/docs/grafana/latest/alerting/)

### Node.js prom-client
- [prom-client GitHub](https://github.com/simmonds/prom-client)
- [Metric Types](https://prometheus.io/docs/concepts/metric_types/)

---

## ✅ Checklist Hoàn Thành

- [ ] Backend đã có prom-client và expose `/metrics` ✅ (Đã có sẵn)
- [ ] Tạo thư mục `prometheus/` với Dockerfile và prometheus.yml
- [ ] Cập nhật docker-compose.yml thêm Prometheus service
- [ ] Deploy Prometheus lên Railway
- [ ] Generate domain public cho Prometheus
- [ ] Update prometheus.yml với URL backend thực tế
- [ ] Verify Prometheus đang scrape metrics từ backend
- [ ] Tạo tài khoản Grafana Cloud (Free)
- [ ] Kết nối Prometheus data source với Grafana Cloud
- [ ] Tạo dashboard mới với 10 panels monitoring
- [ ] Cấu hình auto-refresh và time range
- [ ] Test dashboard với real traffic
- [ ] (Optional) Setup alerts cho critical metrics
- [ ] (Optional) Download Grafana Mobile app

---

## 🎉 Kết luận

Sau khi hoàn thành các bước trên, bạn sẽ có:

✅ **Prometheus** chạy trên Railway, thu thập metrics từ backend 24/7
✅ **Grafana Cloud** dashboard đẹp mắt, realtime monitoring
✅ **10+ panels** theo dõi: traffic, performance, errors, resources
✅ **Mobile app** xem dashboard mọi lúc mọi nơi
✅ **Free tier** của Grafana Cloud (đủ dùng cho production)

### 📊 Dashboard của bạn sẽ hiển thị:

- **Lượng truy cập realtime**: Requests/giây, tổng requests
- **Performance**: Response time, latency percentiles
- **Errors**: Error rate, status codes distribution
- **Resources**: CPU, Memory usage
- **Top endpoints**: Endpoint nào được call nhiều nhất
- **HTTP methods**: GET, POST, PUT, DELETE distribution

**Chúc bạn monitoring hiệu quả! 🚀**

Nếu gặp vấn đề, tham khảo phần Troubleshooting hoặc liên hệ support.
