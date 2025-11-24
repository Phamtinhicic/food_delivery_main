# Hướng dẫn Tạo Dashboard Test Monitoring Thủ Công

## 🎯 Mục tiêu
Tạo dashboard hiển thị:
1. **Danh sách tất cả tests đã chạy**
2. **Test cases bị FAIL** (highlight đỏ)
3. **Thống kê pass/fail ratio**

---

## 📋 BƯỚC 1: Cấu hình GitHub Actions để log tests

### 1.1. Update workflow `.github/workflows/ci-cd.yml`

Tìm section **"Run backend tests"** và sửa như sau:

```yaml
- name: Run backend tests
  working-directory: backend
  env:
    NODE_ENV: test
    MONGO_URI: mongodb://localhost:27017/FoodDeliveryTest
    JWT_SECRET: test_secret_key_for_ci
    SALT: 10
    DEV_PAYMENT: true
  run: |
    # Chạy tests và lưu output
    npm test -- --verbose --json --outputFile=test-results.json 2>&1 | tee test-output.log
    echo "TEST_END=$(date +%s)" >> $GITHUB_ENV
```

### 1.2. Thêm step push logs (sau step Run backend tests)

```yaml
- name: Push test logs to Loki
  if: always()
  continue-on-error: true
  env:
    LOKI_URL: ${{ secrets.GRAFANA_CLOUD_LOKI_URL }}
    LOKI_USER: ${{ secrets.GRAFANA_CLOUD_LOKI_USER }}
    LOKI_API_KEY: ${{ secrets.GRAFANA_CLOUD_API_KEY }}
  working-directory: backend
  run: |
    if [ -z "$LOKI_URL" ]; then
      echo "⚠️  Loki not configured"
      exit 0
    fi
    
    echo "📝 Pushing test logs to Loki..."
    
    # Parse JSON test results
    if [ -f test-results.json ]; then
      # Parse từng test case
      cat test-results.json | jq -r '.testResults[] | .assertionResults[] | 
        {
          test: .fullName,
          status: .status,
          duration: .duration,
          error: (.failureMessages[0] // "")
        } | @json' | while read -r result; do
        
        TEST_NAME=$(echo "$result" | jq -r '.test')
        STATUS=$(echo "$result" | jq -r '.status')
        DURATION=$(echo "$result" | jq -r '.duration')
        ERROR=$(echo "$result" | jq -r '.error' | head -c 500)
        
        # Xác định level
        if [ "$STATUS" = "passed" ]; then
          LEVEL="info"
        else
          LEVEL="error"
        fi
        
        # Tạo Loki payload
        TIMESTAMP=$(date +%s)000000000
        
        PAYLOAD=$(jq -n \
          --arg job "github-actions" \
          --arg repo "$GITHUB_REPOSITORY" \
          --arg branch "$GITHUB_REF_NAME" \
          --arg workflow "$GITHUB_WORKFLOW" \
          --arg run_id "$GITHUB_RUN_ID" \
          --arg level "$LEVEL" \
          --arg status "$STATUS" \
          --arg test "$TEST_NAME" \
          --arg error "$ERROR" \
          --arg duration "$DURATION" \
          --arg ts "$TIMESTAMP" \
          --arg msg "$TEST_NAME - $STATUS" \
          '{
            streams: [{
              stream: {
                job: $job,
                repository: $repo,
                branch: $branch,
                workflow: $workflow,
                run_id: $run_id,
                level: $level,
                status: $status,
                test_name: $test,
                test_duration_ms: $duration
              },
              values: [[$ts, $msg]]
            }]
          }')
        
        # Push to Loki
        echo "$PAYLOAD" | curl -s -X POST \
          -H "Content-Type: application/json" \
          -u "${LOKI_USER}:${LOKI_API_KEY}" \
          -d @- \
          "${LOKI_URL}" >/dev/null
      done
      
      echo "✅ Test logs pushed!"
    fi
```

---

## 📊 BƯỚC 2: Tạo Dashboard Thủ Công trên Grafana

### 2.1. Tạo Dashboard mới

1. Vào Grafana: https://phamtinhicic.grafana.net
2. Click **"+"** → **"Create Dashboard"**
3. Click **"Save dashboard"**
4. Đặt tên: **"Test Results Monitor"**

---

## 🎨 BƯỚC 3: Tạo Panel 1 - Test Summary (Stat)

### Mục đích: Hiển thị tổng số tests PASS vs FAIL

1. Click **"Add"** → **"Visualization"**
2. **Visualization type**: Chọn **"Stat"**
3. **Data source**: Chọn **"Loki"**
4. **Query**:
   ```logql
   sum(count_over_time({job="github-actions", status="passed"}[24h]))
   ```
5. Click **"+ Query"** thêm query thứ 2:
   ```logql
   sum(count_over_time({job="github-actions", status="failed"}[24h]))
   ```
6. **Panel options**:
   - Title: `Test Summary - Last 24h`
   - Description: `Total tests passed vs failed`

7. **Standard options** (bên phải):
   - Unit: `short`
   - Min: `0`
   
8. **Value mappings**:
   - Click **"Add value mapping"**
   - Type: `Value`
   - Value: `0` failed → Text: `✅ All Passed` (Green)
   
9. **Thresholds**:
   - Mode: `Absolute`
   - Add threshold: `0` = Green, `1` = Red

10. **Text size**: 
    - Title size: `20`
    - Value size: `50`

11. Click **"Apply"** (góc trên phải)

---

## 📋 BƯỚC 4: Panel 2 - All Tests Table

### Mục đích: Danh sách TẤT CẢ tests (pass + fail)

1. Click **"Add"** → **"Visualization"**
2. **Visualization**: **"Table"**
3. **Data source**: **"Loki"**
4. **Query**:
   ```logql
   {job="github-actions", repository="Phamtinhicic/food_delivery_main"} 
   | json 
   | status != ""
   | line_format "{{.test_name}} | {{.status}} | {{.test_duration_ms}}ms"
   ```

5. **Transformations** (tab bên cạnh Query):
   - Click **"Add transformation"**
   - Chọn **"Extract fields"**
   - Source: `Line`
   - Format: `Auto`
   
6. **Transformations** (tiếp):
   - Click **"Add transformation"** 
   - Chọn **"Organize fields"**
   - Rename:
     - `test_name` → `Test Name`
     - `status` → `Status`
     - `test_duration_ms` → `Duration (ms)`
   - Hide các columns không cần

7. **Field overrides**:
   - Click **"Add field override"**
   - **Fields with name**: `Status`
   - **Add override property**: 
     - **Mappings**:
       - Value `passed` → Display text `✅ PASSED` (Green)
       - Value `failed` → Display text `❌ FAILED` (Red)
     - **Cell display mode**: `Color background`

8. **Panel options**:
   - Title: `All Test Cases`
   - Description: `Complete list of test executions`

9. **Table options**:
   - Show header: `ON`
   - Column width: `Auto`
   - Cell height: `Default`

10. Click **"Apply"**

---

## ❌ BƯỚC 5: Panel 3 - Failed Tests ONLY

### Mục đích: CHỈ hiển thị tests BỊ FAIL

1. **Add panel** → **Table**
2. **Data source**: **Loki**
3. **Query**:
   ```logql
   {job="github-actions", status="failed"} 
   | json 
   | line_format "{{.test_name}} | {{.error}}"
   ```

4. **Transformations**:
   - **Extract fields**: Source `Line`, Format `Auto`
   - **Organize fields**: 
     - Rename: `test_name` → `Failed Test`, `error` → `Error Message`
     - Reorder: Test Name → Error → Time

5. **Field override** cho `Failed Test`:
   - **Cell display**: `Color background`
   - **Color**: Fixed `Red`

6. **Panel options**:
   - Title: `❌ Failed Test Cases`
   - Description: `Tests that failed - requires attention`

7. Click **"Apply"**

---

## 📈 BƯỚC 6: Panel 4 - Pass/Fail Ratio (Pie Chart)

1. **Add panel** → **Pie chart**
2. **Data source**: **Loki**
3. **Query A**:
   ```logql
   sum(count_over_time({job="github-actions", status="passed"}[24h]))
   ```
   Legend: `Passed`

4. **Query B**:
   ```logql
   sum(count_over_time({job="github-actions", status="failed"}[24h]))
   ```
   Legend: `Failed`

5. **Options**:
   - Pie chart type: `Donut`
   - Legend placement: `Right`
   - Legend values: `Value`, `Percent`

6. **Colors**:
   - Query A (Passed): Green
   - Query B (Failed): Red

7. Title: `Test Results Distribution`

8. Click **"Apply"**

---

## ⏱️ BƯỚC 7: Panel 5 - Test Duration Trend

1. **Add panel** → **Time series**
2. **Data source**: **Loki**
3. **Query**:
   ```logql
   avg(test_duration_ms) by (test_name)
   ```

4. **Options**:
   - Title: `Test Execution Time Trend`
   - Legend: `Bottom`
   - Tooltip mode: `All`

5. **Standard options**:
   - Unit: `milliseconds (ms)`
   - Min: `0`

6. **Thresholds**:
   - `0` = Green (fast)
   - `1000` = Yellow (1s)
   - `3000` = Red (>3s, slow!)

7. Click **"Apply"**

---

## 🔍 BƯỚC 8: Panel 6 - Test Error Details (Logs)

1. **Add panel** → **Logs**
2. **Data source**: **Loki**
3. **Query**:
   ```logql
   {job="github-actions", status="failed"} | json
   ```

4. **Options**:
   - Show time: `ON`
   - Show labels: `ON`
   - Wrap lines: `ON`
   - Deduplication: `None`
   - Order: `Descending` (newest first)

5. Title: `Failed Test Error Logs`

6. Click **"Apply"**

---

## 🎨 BƯỚC 9: Sắp xếp Layout

### Kéo thả panels theo layout này:

```
┌─────────────────┬─────────────────┬─────────────────┐
│ Test Summary    │ Pass/Fail Ratio │ Latest Run      │
│ (Stat)          │ (Pie Chart)     │ (Stat)          │
├─────────────────┴─────────────────┴─────────────────┤
│ All Test Cases (Table)                               │
│ Sortable, filterable table with all tests           │
├──────────────────────────────────────────────────────┤
│ ❌ Failed Test Cases (Table)                         │
│ Only showing failed tests with error messages       │
├──────────────────────────────────────────────────────┤
│ Test Duration Trend (Graph)                          │
│ Time series showing test performance over time      │
├──────────────────────────────────────────────────────┤
│ Test Error Logs (Logs panel)                         │
│ Raw logs with full error details                    │
└──────────────────────────────────────────────────────┘
```

**Cách kéo thả**:
1. Click **"Edit"** (góc trên phải)
2. Hover vào panel title → Kéo panel
3. Resize bằng cách kéo góc panel

**Grid size chuẩn**:
- Full width: 24 units
- Half width: 12 units
- Third width: 8 units
- Quarter width: 6 units

---

## ⚙️ BƯỚC 10: Cấu hình Dashboard Settings

1. Click **biểu tượng bánh răng** ⚙️ (góc trên)
2. **General**:
   - Name: `Test Results Monitor`
   - Description: `Monitoring test execution results`
   - Tags: `testing`, `ci-cd`, `quality`
   - Timezone: `Browser time`

3. **Time options**:
   - Auto refresh: `30s`
   - Default time range: `Last 24 hours`

4. **Variables** (optional):
   - Add variable `branch`:
     - Type: `Query`
     - Data source: `Loki`
     - Query: `label_values(branch)`
   - Dùng trong queries: `{branch="$branch"}`

5. Click **"Save dashboard"**

---

## 🚀 BƯỚC 11: Test Dashboard

### 11.1. Trigger test run:

```bash
# Push code lên GitHub
git add .
git commit -m "test: trigger CI/CD for dashboard testing"
git push origin main
```

### 11.2. Xem kết quả:

1. Vào **GitHub Actions** → Đợi workflow chạy xong
2. Quay lại **Grafana dashboard**
3. Click **"Refresh"** 🔄
4. Kiểm tra:
   - ✅ Test summary có số liệu?
   - ✅ Table hiển thị tests?
   - ✅ Failed tests (nếu có) hiển thị đỏ?
   - ✅ Logs có dữ liệu?

---

## 🎯 Kết quả mong đợi

Dashboard sẽ hiển thị:

✅ **Test Summary**: 
```
✅ 41 Passed    ❌ 0 Failed
```

✅ **All Tests Table**:
```
Test Name                                    | Status      | Duration
--------------------------------------------|-------------|----------
User Controller › Register › creates user   | ✅ PASSED   | 145ms
User Controller › Login › correct password  | ✅ PASSED   | 89ms
Cart Controller › adds item to cart         | ✅ PASSED   | 52ms
Food Controller › lists all foods           | ❌ FAILED   | 231ms
```

✅ **Failed Tests Table** (nếu có lỗi):
```
Failed Test                    | Error Message
-------------------------------|--------------------------------
Food Controller › lists foods  | TypeError: Cannot read property...
```

✅ **Pie Chart**: 
- Green slice: 95% (Passed)
- Red slice: 5% (Failed)

---

## 🔍 Tips Nâng Cao

### 1. Filter theo Branch:
Thêm vào query:
```logql
{job="github-actions", branch="main"} | json
```

### 2. Search test name:
Trong Table panel → Click filter icon → Gõ tên test

### 3. Alert khi có test fail:
1. Edit panel "Failed Tests"
2. Tab **Alert** → **Create alert rule**
3. Condition: `count > 0`
4. Send to: Email/Slack

### 4. Export dashboard:
- Dashboard settings → **JSON Model**
- Copy và save vào file
- Share với team

---

## ✅ Checklist Hoàn Thành

- [ ] Update workflow với test logging
- [ ] Add Loki secrets vào GitHub
- [ ] Tạo dashboard mới
- [ ] Panel 1: Test Summary (Stat)
- [ ] Panel 2: All Tests (Table)
- [ ] Panel 3: Failed Tests (Table - Red)
- [ ] Panel 4: Pass/Fail Ratio (Pie)
- [ ] Panel 5: Duration Trend (Graph)
- [ ] Panel 6: Error Logs (Logs panel)
- [ ] Sắp xếp layout đẹp
- [ ] Test bằng cách push code
- [ ] Verify data hiển thị đúng

---

## 🆘 Troubleshooting

### Dashboard không có dữ liệu?
1. Check Loki data source connected
2. Vào **Explore** → Query: `{job="github-actions"}`
3. Verify GitHub Actions đã chạy và push logs

### Query không trả về kết quả?
1. Check time range (góc trên phải)
2. Verify label filters đúng: `job`, `repository`, `status`
3. Test query trong **Explore** trước

### Tests không hiển thị trong table?
1. Check transformation `Extract fields` có hoạt động?
2. Verify log format từ GitHub Actions
3. Test với query đơn giản trước: `{job="github-actions"}`

---

Dashboard này sẽ giúp bạn:
- 👀 Theo dõi tất cả tests đã chạy
- 🔍 Phát hiện nhanh test nào bị lỗi
- 📊 Thống kê quality metrics
- 🐛 Debug với error logs chi tiết

Chúc bạn tạo dashboard thành công! 🎉
