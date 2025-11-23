# Script để generate test metrics cho Grafana Dashboard

Write-Host "`n=== Generating Test CI/CD Metrics ===" -ForegroundColor Cyan
Write-Host "This will simulate 10 builds with random results`n" -ForegroundColor Yellow

$pushgatewayUrl = "http://localhost:9091"

# Simulate 10 builds
for ($i = 1; $i -le 10; $i++) {
    Write-Host "Build #$i..." -ForegroundColor White
    
    # Random success/failure (80% success rate)
    $buildStatus = if ((Get-Random -Maximum 100) -lt 80) { 1 } else { 0 }
    $testStatus = if ($buildStatus -eq 1) { 
        if ((Get-Random -Maximum 100) -lt 90) { 1 } else { 0 }
    } else { 0 }
    
    # Random durations
    $buildDuration = Get-Random -Minimum 30 -Maximum 180
    $testDuration = Get-Random -Minimum 15 -Maximum 60
    
    # Random code changes
    $filesChanged = Get-Random -Minimum 1 -Maximum 20
    $linesAdded = Get-Random -Minimum 10 -Maximum 500
    $linesRemoved = Get-Random -Minimum 5 -Maximum 200
    
    # Total commits incrementing
    $totalCommits = 100 + $i
    
    # Create metrics string (without TYPE declarations)
    $metrics = @"
cicd_build_status $buildStatus
cicd_test_status $testStatus
cicd_build_duration_seconds $buildDuration
cicd_test_duration_seconds $testDuration
cicd_total_commits $totalCommits
cicd_files_changed $filesChanged
cicd_lines_added $linesAdded
cicd_lines_removed $linesRemoved
"@
    
    # Try to push to Pushgateway
    try {
        $url = "$pushgatewayUrl/metrics/job/cicd/instance/build_$i"
        Invoke-WebRequest -Uri $url -Method Post -Body $metrics -ContentType "text/plain" -UseBasicParsing -ErrorAction Stop | Out-Null
        
        $status = if ($buildStatus -eq 1) { "✅ SUCCESS" } else { "❌ FAILED" }
        Write-Host "  $status - Duration: ${buildDuration}s - Tests: $(if($testStatus -eq 1){'✅'}else{'❌'})" -ForegroundColor $(if($buildStatus -eq 1){'Green'}else{'Red'})
    }
    catch {
        Write-Host "  ⚠ Could not push to Pushgateway" -ForegroundColor Yellow
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "`n  Note: Pushgateway might need different format" -ForegroundColor Yellow
        Write-Host "  Dashboard will get data from real GitHub Actions instead`n" -ForegroundColor Cyan
        break
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n✅ Test metrics generation complete!" -ForegroundColor Green
Write-Host "`n📊 View metrics in:" -ForegroundColor Cyan
Write-Host "   Pushgateway: http://localhost:9091" -ForegroundColor White
Write-Host "   Prometheus:  http://localhost:9090/graph" -ForegroundColor White  
Write-Host "   Grafana:     http://localhost:3000`n" -ForegroundColor White
