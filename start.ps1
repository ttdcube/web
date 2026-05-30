
# ClinicFlow - Khởi động hệ thống
Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host " 🏥 ClinicFlow - Hệ thống đặt lịch khám" -ForegroundColor Cyan
Write-Host "=============================================`n" -ForegroundColor Cyan

# Kiểm tra Node.js
Write-Host "[1/3] Kiểm tra Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js đã cài đặt: $nodeVersion`n" -ForegroundColor Green
} catch {
    Write-Host "✗ LỖI: Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng tải từ https://nodejs.org/" -ForegroundColor Red
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

# Cài dependencies backend nếu cần
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "[2/3] Cài đặt dependencies backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✓ Hoàn tất cài đặt`n" -ForegroundColor Green
} else {
    Write-Host "[2/3] Dependencies đã cài đặt sẵn`n" -ForegroundColor Green
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " ✨ Đang khởi động hệ thống..." -ForegroundColor Cyan
Write-Host "=============================================`n" -ForegroundColor Cyan

# Khởi động backend
Write-Host "Khởi động Backend (http://localhost:5000)..." -ForegroundColor Magenta
$backendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]\backend
    node server.js
} -ArgumentList $PWD.Path

# Đợi 3 giây
Start-Sleep -Seconds 3

# Khởi động frontend
Write-Host "Khởi động Frontend (http://localhost:8000)..." -ForegroundColor Magenta
Start-Process "http://localhost:8000"
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]\frontend
    python -m http.server 8000
} -ArgumentList $PWD.Path

Write-Host "`n✅ Hệ thống đã khởi động!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:8000" -ForegroundColor White
Write-Host "   Backend: http://localhost:5000" -ForegroundColor White
Write-Host "`nNhấn Ctrl+C để dừng hệ thống.`n" -ForegroundColor Gray

# Chờ người dùng nhấn Ctrl+C
try {
    Wait-Job $backendJob, $frontendJob | Out-Null
} finally {
    Write-Host "`nĐang dừng hệ thống..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -Force -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Đã dừng hệ thống!" -ForegroundColor Green
}
