
# ClinicFlow - Run Backend and Frontend
Write-Host "`n=== Starting ClinicFlow ===" -ForegroundColor Cyan

# Check Node.js
Write-Host "`n[1/3] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVer = node --version
    Write-Host "OK: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not installed!" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Gray
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "`n[2/3] Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

Write-Host "`n[3/3] Starting services..." -ForegroundColor Yellow

# Start backend in new window
$backendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]\backend
    node server.js
} -ArgumentList $PWD.Path

Write-Host "Backend started on http://localhost:5000" -ForegroundColor Green
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Frontend starting on http://localhost:8000" -ForegroundColor Green
Start-Process "http://localhost:8000"
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]\frontend
    python -m http.server 8000
} -ArgumentList $PWD.Path

Write-Host "`n=== Services are running! ===" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop everything`n" -ForegroundColor Gray

# Wait for user interruption
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    Write-Host "`nStopping services..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -Force -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -Force -ErrorAction SilentlyContinue
    Write-Host "All services stopped" -ForegroundColor Green
}
