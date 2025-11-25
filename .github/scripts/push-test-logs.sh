#!/bin/bash
# Script: push-test-logs.sh
# Mục đích: Parse test output và push lên Loki
# Sử dụng: Thêm vào GitHub Actions workflow

# Đọc test output
TEST_LOG_FILE="$1"
LOKI_URL="$2"
LOKI_USER="$3"
LOKI_API_KEY="$4"

if [ ! -f "$TEST_LOG_FILE" ]; then
  echo "Test log file not found: $TEST_LOG_FILE"
  exit 1
fi

echo "📝 Parsing test results and pushing to Loki..."

# Parse từng dòng test output
while IFS= read -r line; do
  # Xác định test status
  if echo "$line" | grep -qE "PASS|✓"; then
    LEVEL="info"
    STATUS="passed"
  elif echo "$line" | grep -qE "FAIL|✕|×"; then
    LEVEL="error"
    STATUS="failed"
  else
    LEVEL="debug"
    STATUS="log"
  fi
  
  # Extract test name (nếu có)
  TEST_NAME=$(echo "$line" | sed -n 's/.*[✓✕×] \(.*\)/\1/p' || echo "")
  
  # Extract error message (cho failed tests)
  if [ "$STATUS" = "failed" ]; then
    ERROR_MSG=$(echo "$line" | sed 's/.*Error: //' | head -c 200)
  else
    ERROR_MSG=""
  fi
  
  # Escape JSON special characters
  LINE_ESCAPED=$(echo "$line" | jq -Rs .)
  TEST_NAME_ESCAPED=$(echo "$TEST_NAME" | jq -Rs .)
  ERROR_ESCAPED=$(echo "$ERROR_MSG" | jq -Rs .)
  
  # Create Loki payload
  TIMESTAMP=$(date +%s)000000000  # nanoseconds
  
  PAYLOAD=$(cat <<EOF
{
  "streams": [{
    "stream": {
      "job": "github-actions",
      "repository": "$GITHUB_REPOSITORY",
      "branch": "$GITHUB_REF_NAME",
      "workflow": "$GITHUB_WORKFLOW",
      "run_id": "$GITHUB_RUN_ID",
      "level": "$LEVEL",
      "status": "$STATUS",
      "test_name": $TEST_NAME_ESCAPED,
      "error": $ERROR_ESCAPED
    },
    "values": [
      ["$TIMESTAMP", $LINE_ESCAPED]
    ]
  }]
}
EOF
  )
  
  # Push to Loki
  curl -s -X POST \
    -H "Content-Type: application/json" \
    -u "${LOKI_USER}:${LOKI_API_KEY}" \
    -d "$PAYLOAD" \
    "${LOKI_URL}" >/dev/null 2>&1
  
done < "$TEST_LOG_FILE"

echo "✅ Test logs pushed to Loki successfully!"
