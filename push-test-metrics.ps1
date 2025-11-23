Write-Host "`n=== Pushing CI/CD Test Metrics ===" -ForegroundColor Cyan

$url = "http://localhost:9091/metrics/job/cicd/instance/food_delivery_main"

$metrics = @"
cicd_build_status 1
cicd_test_status 1
cicd_build_duration_seconds 45
cicd_test_duration_seconds 30
cicd_total_commits 150
cicd_files_changed 8
cicd_lines_added 120
cicd_lines_removed 45
"@

try {
    Invoke-WebRequest -Uri $url -Method Post -Body $metrics -ContentType "text/plain" -UseBasicParsing | Out-Null
    Write-Host "`n Metrics pushed successfully!" -ForegroundColor Green
    Write-Host "`n View in:" -ForegroundColor Yellow
    Write-Host "   Pushgateway: http://localhost:9091" -ForegroundColor White
    Write-Host "   Prometheus:  http://localhost:9090/graph?g0.expr=cicd_build_status" -ForegroundColor White
    Write-Host "   Grafana:     http://localhost:3000" -ForegroundColor White
    Write-Host "`n Now import the dashboard in Grafana!" -ForegroundColor Cyan
} catch {
    Write-Host "`n Failed to push metrics" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
