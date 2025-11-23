# 📊 Hướng Dẫn Tạo Dashboard Grafana

## 🎯 3 Cách Tạo Dashboard

---

## ✨ Cách 1: Import Dashboard JSON (Nhanh nhất - 2 phút)

### Bước 1: Mở Grafana
http://localhost:3000

### Bước 2: Import Dashboard
1. Click **+ icon** → **Import dashboard**
2. Chọn **Upload JSON file**
3. Browse và chọn file: `monitoring/grafana-dashboards/cicd-dashboard.json`
4. Click **Load**
5. Chọn **Prometheus** data source
6. Click **Import**

✅ **Done!** Dashboard sẽ hiển thị ngay với 10 panels!

---

## 🎨 Cách 2: Tạo Dashboard Thủ Công (Học được nhiều)

### Bước 1: Add Prometheus Data Source

1. Login Grafana: http://localhost:3000 (admin/admin)
2. **Configuration** ⚙️ → **Data Sources**
3. **Add data source** → Chọn **Prometheus**
4. **URL:** `http://localhost:9090`
5. **Save & Test**

### Bước 2: Create New Dashboard

1. **+ icon** → **Dashboard** → **New Dashboard**
2. Click **Add visualization**
3. Select **Prometheus** data source

### Bước 3: Add Panels

#### Panel 1: Build Status (Stat)
```
Query: cicd_build_status
Title: Last Build Status
Type: Stat
Value Mappings:
  1 = ✅ Success (Green)
  0 = ❌ Failed (Red)
```

#### Panel 2: Test Status (Stat)
```
Query: cicd_test_status
Title: Last Test Status
Type: Stat
Value Mappings:
  1 = ✅ Passed (Green)
  0 = ❌ Failed (Red)
```

#### Panel 3: Build Duration (Time Series)
```
Query A: cicd_build_duration_seconds
Query B: cicd_test_duration_seconds
Title: Build & Test Duration
Type: Time series
Unit: seconds (s)
```

#### Panel 4: Build Success Rate (Gauge)
```
Query: avg_over_time(cicd_build_status[24h]) * 100
Title: Build Success Rate (24h)
Type: Gauge
Unit: Percent (0-100)
Min: 0, Max: 100
Thresholds:
  Red: 0-50%
  Yellow: 50-80%
  Green: 80-100%
```

#### Panel 5: Test Success Rate (Gauge)
```
Query: avg_over_time(cicd_test_status[24h]) * 100
Title: Test Success Rate (24h)
Type: Gauge
Unit: Percent (0-100)
```

#### Panel 6: Code Changes (Bar Chart)
```
Query A: cicd_lines_added (Legend: Lines Added)
Query B: cicd_lines_removed (Legend: Lines Removed)
Title: Code Changes
Type: Time series
Style: Bars
Transform: Negative-Y for Lines Removed
```

#### Panel 7: Total Commits (Stat)
```
Query: cicd_total_commits
Title: Total Commits
Type: Stat
```

#### Panel 8: Files Changed (Stat)
```
Query: cicd_files_changed
Title: Files Changed (Last Commit)
Type: Stat
```

#### Panel 9: Builds Today (Stat)
```
Query: count_over_time(cicd_pipeline_timestamp[24h])
Title: Builds Today
Type: Stat
```

#### Panel 10: Build Status Timeline (Time Series)
```
Query: cicd_build_status
Title: Build Status Timeline
Type: Time series
Mapping:
  0 = Failed (Red)
  1 = Success (Green)
Min: 0, Max: 1
```

### Bước 4: Save Dashboard

1. Click **Save** icon (💾)
2. **Name:** "CI/CD Monitoring Dashboard"
3. **Folder:** General
4. **Save**

---

## 📦 Cách 3: Import Dashboard Có Sẵn Từ Grafana.com

### Windows System Monitoring:

1. **+ icon** → **Import dashboard**
2. Nhập Dashboard ID: **14694** (Windows Node)
3. Click **Load**
4. Select **Prometheus** data source
5. **Import**

### Prometheus Stats:

1. Import Dashboard ID: **3662** (Prometheus 2.0 Overview)
2. Select **Prometheus** data source
3. **Import**

### GitHub Stats (nếu có GitHub datasource):

1. Import Dashboard ID: **14000** (GitHub Stats)
2. Select **GitHub** data source
3. **Import**

---

## 🔧 Customize Dashboard

### Edit Panel:

1. Click **Panel Title** → **Edit**
2. Thay đổi Query, Title, Visualization
3. **Apply**

### Add New Panel:

1. Click **Add panel** icon
2. **Add visualization**
3. Configure Query và Options
4. **Apply**

### Organize Layout:

1. Click **Settings** icon (⚙️)
2. Drag panels để sắp xếp
3. Resize panels bằng cách kéo góc
4. **Save dashboard**

### Add Variables:

1. **Dashboard settings** → **Variables**
2. **Add variable**
3. Example: Branch filter
   ```
   Name: branch
   Type: Query
   Data source: Prometheus
   Query: label_values(cicd_build_status, branch)
   ```
4. Use in panel: `cicd_build_status{branch="$branch"}`

---

## 🎯 Dashboard Best Practices

### Layout Structure:

```
┌─────────────────────────────────────────┐
│  Row 1: Key Metrics (Stat panels)      │
│  - Build Status, Test Status            │
├─────────────────────────────────────────┤
│  Row 2: Time Series (Graphs)           │
│  - Build Duration, Test Duration        │
├─────────────────────────────────────────┤
│  Row 3: Success Rates (Gauges)         │
│  - Build Success %, Test Success %      │
├─────────────────────────────────────────┤
│  Row 4: Code Metrics (Stats + Graph)   │
│  - Commits, Files, Lines Changed        │
└─────────────────────────────────────────┘
```

### Panel Guidelines:

- **Top panels:** Most important metrics (status, alerts)
- **Middle:** Trends and historical data
- **Bottom:** Detailed metrics
- **Use colors:** Green = Good, Red = Bad, Yellow = Warning
- **Add descriptions:** Help text for each panel
- **Set refresh rate:** Auto-refresh every 5-30 seconds

### Query Optimization:

```promql
# Bad - Too much data
cicd_build_duration_seconds

# Good - Aggregated
avg_over_time(cicd_build_duration_seconds[5m])

# Better - With rate
rate(cicd_build_duration_seconds[5m])
```

---

## 📊 Advanced Panels

### Panel: Build Failure Rate
```promql
(1 - avg_over_time(cicd_build_status[24h])) * 100
```

### Panel: Average Build Time
```promql
avg_over_time(cicd_build_duration_seconds[1d])
```

### Panel: Slowest Builds
```promql
topk(5, cicd_build_duration_seconds)
```

### Panel: Build Frequency
```promql
rate(cicd_pipeline_timestamp[1h])
```

### Panel: Code Velocity
```promql
sum_over_time(cicd_lines_added[7d]) + sum_over_time(cicd_lines_removed[7d])
```

---

## 🔔 Add Alerts

### Alert 1: Build Failed

1. Edit panel "Build Status"
2. Click **Alert** tab
3. **Create alert rule**
4. **Condition:**
   ```
   WHEN last() OF query(A, 5m, now) IS BELOW 1
   ```
5. **Alert details:**
   - Name: Build Failed
   - Message: Build has failed! Check logs.
6. **Save**

### Alert 2: Build Too Slow

1. Edit panel "Build Duration"
2. **Alert** tab → **Create alert rule**
3. **Condition:**
   ```
   WHEN last() OF query(A, 5m, now) IS ABOVE 300
   ```
4. **Save**

---

## 📱 Dashboard Sharing

### Share Dashboard URL:

1. Click **Share** icon
2. Copy **Link** URL
3. Share với team

### Export Dashboard:

1. **Dashboard settings** → **JSON Model**
2. **Copy to clipboard** hoặc **Save to file**
3. Share file JSON

### Snapshot:

1. Click **Share** → **Snapshot**
2. **Publish to snapshots.raintank.io**
3. Copy public link

---

## 💡 Dashboard Templates

### Import More Dashboards:

**System Monitoring:**
- 14694 - Windows Node (System metrics)
- 1860 - Node Exporter Full
- 11074 - Node Exporter Quick

**Prometheus:**
- 3662 - Prometheus 2.0 Overview
- 7249 - Prometheus Stats

**Application:**
- 4701 - JVM Dashboard
- 11159 - Nginx Monitoring

**Kubernetes:**
- 315 - Kubernetes Cluster Monitoring
- 8588 - Kubernetes Deployment Statefulset

---

## 🚀 Quick Actions

### View Dashboard:
```
http://localhost:3000/d/cicd-monitoring
```

### View All Dashboards:
```
http://localhost:3000/dashboards
```

### Grafana Explore (Ad-hoc queries):
```
http://localhost:3000/explore
```

---

## 📚 Learn More

### Grafana Documentation:
- [Creating Dashboards](https://grafana.com/docs/grafana/latest/dashboards/)
- [Panel Types](https://grafana.com/docs/grafana/latest/panels/)
- [Prometheus Queries](https://prometheus.io/docs/prometheus/latest/querying/basics/)

### Video Tutorials:
- [Grafana Dashboard Tutorial](https://www.youtube.com/watch?v=sKNZMtoSHN4)
- [PromQL Tutorial](https://www.youtube.com/watch?v=hvACEDjHQZE)

---

## ✅ Checklist

- [ ] Prometheus data source added
- [ ] CI/CD dashboard imported
- [ ] System dashboard imported
- [ ] Panels customized
- [ ] Alerts configured
- [ ] Dashboard shared with team
- [ ] Auto-refresh enabled
- [ ] Time range set (Last 6 hours)

---

## 🎨 Your Current Dashboard

File: `monitoring/grafana-dashboards/cicd-dashboard.json`

**Includes 10 panels:**
1. ✅ Last Build Status
2. ✅ Last Test Status
3. ⏱️ Build & Test Duration
4. 📊 Build Success Rate (24h)
5. 📊 Test Success Rate (24h)
6. 📝 Code Changes
7. 🔢 Total Commits
8. 📁 Files Changed
9. 🏗️ Builds Today
10. 📈 Build Status Timeline

**Import ngay để sử dụng!** 🚀
