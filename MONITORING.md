# 📊 Monitoring — Food Delivery System

## ✅ Status: Fully Implemented

Hệ thống monitoring đã được triển khai đầy đủ với:
- ✅ Prometheus metrics endpoint (`/metrics`)
- ✅ Structured logging với Pino
- ✅ Sentry error tracking
- ✅ Docker Compose stack (Prometheus + Grafana + Loki + Promtail)
- ✅ Alert rules và dashboards

---

## 🚀 Quick Start

### 1. Cài dependencies

```powershell
cd backend
npm install
```

### 2. Cấu hình environment variables

Thêm vào `backend/.env`:

```env
# Monitoring
SENTRY_DSN=your_sentry_dsn_here  # optional
LOG_LEVEL=info                    # debug | info | warn | error

# Existing vars
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start backend

```powershell
cd backend
npm start
```

Kiểm tra metrics endpoint:
```powershell
curl http://localhost:4000/metrics
```

### 4. Start monitoring stack

```powershell
cd monitoring
docker compose up -d
```

### 5. Truy cập dashboards

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100

---

## 📈 Metrics Available

### HTTP Metrics
- `http_requests_total` — Total HTTP requests by method, route, status
- `http_request_duration_seconds` — Request latency histogram (P50, P95, P99)

### System Metrics (default)
- `process_cpu_seconds_total` — CPU usage
- `process_resident_memory_bytes` — Memory usage
- `process_heap_bytes` — Heap size
- `nodejs_eventloop_lag_seconds` — Event loop lag
- `nodejs_active_handles_total` — Active handles
- `nodejs_active_requests_total` — Active requests

### Custom Metrics (extensible)
Bạn có thể thêm custom metrics trong controllers:

```javascript
import client from 'prom-client';

const orderCounter = new client.Counter({
  name: 'orders_total',
  help: 'Total orders placed',
  labelNames: ['status']
});

// In controller
orderCounter.inc({ status: 'success' });
```

---

## 🔔 Alerts Configured

### Critical Alerts
- **HighErrorRate**: 5xx rate > 1% for 5m
- **APIDown**: Backend unreachable for 2m
- **DiskSpaceLow**: Available disk < 15%

### Warning Alerts
- **HighLatency**: P95 > 800ms for 5m
- **HighRequestRate**: > 1000 req/s for 5m
- **HighCPUUsage**: > 80% for 10m
- **HighMemoryUsage**: > 85% for 10m

Alert cấu hình trong `monitoring/alerts.yml`.

---

## 📊 Dashboards

### API Overview Dashboard
- Request rate (per route, method)
- Error rate (4xx, 5xx)
- P95 latency per route
- Status code distribution
- Memory và CPU usage

Dashboard JSON: `monitoring/grafana/dashboards/api-dashboard.json`

### Tạo dashboard tùy chỉnh
1. Login Grafana (http://localhost:3000)
2. Create → Dashboard → Add panel
3. Query Prometheus metrics
4. Save dashboard

---

## 📝 Logs

### Structured Logging với Pino

Backend tự động ghi logs dưới dạng JSON:

```json
{
  "level": 30,
  "time": 1700000000000,
  "pid": 12345,
  "hostname": "localhost",
  "req": {
    "method": "GET",
    "url": "/api/food/list"
  },
  "msg": "incoming request"
}
```

### Xem logs trong Grafana
1. Grafana → Explore
2. Chọn datasource: **Loki**
3. Query: `{job="backend"} |= "error"`

### Log levels
- `debug` — Development debugging
- `info` — Normal operations (default)
- `warn` — Warnings
- `error` — Errors và exceptions

Set level qua env: `LOG_LEVEL=debug`

---

## 🐛 Error Tracking với Sentry

### Setup Sentry (optional)

1. Tạo tài khoản: https://sentry.io
2. Tạo project → Get DSN
3. Thêm vào `.env`:
   ```env
   SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
   ```
4. Restart backend

Sentry tự động capture:
- Unhandled exceptions
- HTTP errors (5xx)
- Request context (URL, headers, body)

### Xem errors
Dashboard Sentry: https://sentry.io/

---

## 🔍 Tracing (Future)

OpenTelemetry chưa được tích hợp. Để thêm:

```powershell
npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
```

Và init trong `server.js` trước các imports khác.

---

## 🗄️ MongoDB Atlas Monitoring

### Bật alerts trên Atlas
1. Login MongoDB Atlas
2. Project → Alerts → Create Alert
3. Thiết lập ngưỡng:
   - Connections > 80%
   - Replication lag > 5s
   - Disk usage > 80%
4. Notification: Email/Slack webhook

### Metrics quan trọng
- Operations per second
- Connections used
- Replication lag
- Disk IOPS

---

## 💳 Stripe & Cloudinary Monitoring

### Stripe
- Dashboard: https://dashboard.stripe.com
- Metrics: Payment success rate, disputes, refunds
- Alerts: Thiết lập qua Stripe Radar

### Cloudinary
- Console: https://cloudinary.com/console
- Metrics: Bandwidth, storage, transformations
- Alerts: Thiết lập billing alerts

---

## 🧪 Synthetic Tests & Uptime

### UptimeRobot / Pingdom
- Kiểm tra `/health` endpoint mỗi 5 phút
- Alert khi downtime > 2 phút

### Synthetic checkout test (example)
```javascript
// tests/synthetic/checkout.test.js
import request from 'supertest';
const API_URL = 'https://your-api.railway.app';

describe('Checkout Flow', () => {
  it('should complete checkout', async () => {
    // 1. Login
    const { token } = await login();
    // 2. Add to cart
    await addToCart(token);
    // 3. Place order
    const { success } = await placeOrder(token);
    expect(success).toBe(true);
  });
});
```

Chạy định kỳ (GitHub Actions cron).

---

## 📘 Runbooks

### 🔴 High Error Rate Alert

**Symptoms:** 5xx rate > 1%

**Investigation:**
1. Check Grafana dashboard → identify failing route
2. Check Loki logs: `{job="backend"} |= "error" | json`
3. Check Sentry for stack traces

**Mitigation:**
- Nếu DB: check MongoDB Atlas
- Nếu Stripe: check Stripe status page
- Nếu code: hotfix + deploy
- Rollback nếu cần: Railway → previous deploy

---

### 🔴 API Down Alert

**Symptoms:** Backend unreachable

**Investigation:**
1. Check Railway logs
2. Check container health: `docker ps` hoặc Railway dashboard
3. Check recent deploys

**Mitigation:**
- Restart service: Railway dashboard → Restart
- Check environment variables
- Rollback if needed

---

### 🟡 High Latency Alert

**Symptoms:** P95 > 800ms

**Investigation:**
1. Identify slow routes: Grafana histogram
2. Check DB slow queries: MongoDB Atlas
3. Check external API latency (Stripe, Cloudinary)

**Mitigation:**
- Add caching
- Optimize queries (indexes)
- Scale horizontally

---

### 🔴 Database Issues

**Symptoms:** Connection errors, replication lag

**Investigation:**
1. MongoDB Atlas metrics
2. Check connections usage
3. Check replica set health

**Mitigation:**
- Scale cluster (Atlas)
- Add read replicas
- Optimize queries
- Restart application to reset connection pool

---

## 🛠️ Troubleshooting

### Metrics không hiển thị trong Grafana
- Check Prometheus targets: http://localhost:9090/targets
- Backend phải expose `/metrics` (curl http://localhost:4000/metrics)
- Check docker network: `docker network inspect monitoring_default`

### Logs không vào Loki
- Check Promtail status: `docker logs food-delivery-promtail`
- Kiểm tra đường dẫn logs trong `promtail-config.yml`
- Backend phải ghi logs vào `backend/logs/*.log`

### Sentry không capture errors
- Check SENTRY_DSN trong `.env`
- Restart backend
- Test: throw error trong một route và kiểm tra Sentry

---

## 📊 Coverage & Testing

Chạy coverage để xem gaps:
```powershell
cd backend
npm run test:coverage
```

Target: ≥ 80% coverage cho controllers, models, routes.

---

## 🔐 Security Notes

- Grafana default password: **đổi ngay** (admin/admin)
- Prometheus và Loki: không expose public (chỉ localhost hoặc VPN)
- Sentry DSN: không commit vào git
- Production: dùng reverse proxy + TLS

---

## 📚 Resources

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)
- [Loki Docs](https://grafana.com/docs/loki/)
- [Sentry Node SDK](https://docs.sentry.io/platforms/node/)
- [Pino Logging](https://getpino.io/)

---

**Monitoring Stack Version:**
- Prometheus: latest
- Grafana: latest
- Loki: 2.9.3
- Promtail: 2.9.3
- Sentry Node SDK: ^7.109.0
- Prom-client: ^15.1.0
- Pino: ^8.16.0

**Last Updated:** November 2025
