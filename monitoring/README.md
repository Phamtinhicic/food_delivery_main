# Monitoring Stack

This folder contains the complete monitoring infrastructure for the Food Delivery system.

## 🏗️ Architecture

```
monitoring/
├── docker-compose.yml          # Full stack (Prometheus + Grafana + Loki + Promtail)
├── prometheus.yml              # Prometheus scrape config
├── alerts.yml                  # Alert rules
├── loki-config.yml            # Loki configuration
├── promtail-config.yml        # Log shipping config
└── grafana/
    ├── datasources/
    │   └── datasources.yml    # Prometheus & Loki datasources
    └── dashboards/
        ├── dashboard-provider.yml
        └── api-dashboard.json # API metrics dashboard
```

## 🚀 Quick Start

### Start Stack

```powershell
docker compose up -d
```

### Stop Stack

```powershell
docker compose down
```

### View Logs

```powershell
docker compose logs -f
```

## 📊 Access URLs

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100

## 🔧 Configuration

### Add Backend Target

Edit `prometheus.yml` if backend runs on different host:

```yaml
scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['your-backend-host:4000']
```

### Change Grafana Password

```powershell
docker exec -it food-delivery-grafana grafana-cli admin reset-admin-password newpassword
```

## 📈 Metrics Collected

- HTTP request rate, latency, errors
- System CPU, memory, disk
- Node.js process metrics
- Custom application metrics

## 🔔 Alerts

Alerts defined in `alerts.yml`:
- High error rate (> 1%)
- High latency (P95 > 800ms)
- API down
- System resource alerts

View active alerts: http://localhost:9090/alerts

## 📝 Logs

Logs collected by Promtail and shipped to Loki.

Query logs in Grafana:
- Explore → Loki datasource
- Example query: `{job="backend"} |= "error"`

## 🐛 Troubleshooting

### Backend metrics not showing

1. Check Prometheus targets: http://localhost:9090/targets
2. Verify backend `/metrics` endpoint works:
   ```powershell
   curl http://localhost:4000/metrics
   ```
3. Check docker network:
   ```powershell
   docker network inspect monitoring_default
   ```

### Logs not appearing in Loki

1. Check Promtail status:
   ```powershell
   docker logs food-delivery-promtail
   ```
2. Verify log file path in `promtail-config.yml`
3. Ensure backend writes logs to `backend/logs/*.log`

### Grafana can't connect to datasources

1. Check services are running:
   ```powershell
   docker compose ps
   ```
2. Restart Grafana:
   ```powershell
   docker compose restart grafana
   ```

## 📚 Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Loki Documentation](https://grafana.com/docs/loki/)

## 🔒 Security

⚠️ **Production Considerations:**
- Change default Grafana password
- Use reverse proxy with TLS
- Restrict access (VPN or IP whitelist)
- Don't expose Prometheus/Loki publicly
- Use authentication for Grafana

## 📦 Volumes

Persistent data stored in Docker volumes:
- `prometheus-data` — Metrics data
- `grafana-data` — Dashboards and settings
- `loki-data` — Log data

To remove all data:
```powershell
docker compose down -v
```
