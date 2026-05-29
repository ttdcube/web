
@echo off
title 🏥 ClinicFlow - Hệ thống đặt lịch khám
mode con: cols=80 lines=20
color 0B

:: In logo
cls
echo.
echo    ██████╗██╗  ██╗██╗███╗   ██╗██╗ ██████╗███████╗██╗      ██████╗ ██╗    ██╗
echo   ██╔════╝██║  ██║██║████╗  ██║██║██╔════╝██╔════╝██║     ██╔═══██╗██║    ██║
echo   ██║     ███████║██║██╔██╗ ██║██║██║     █████╗  ██║     ██║   ██║██║ █╗ ██║
echo   ██║     ██╔══██║██║██║╚██╗██║██║██║     ██╔══╝  ██║     ██║   ██║██║███╗██║
echo   ╚██████╗██║  ██║██║██║ ╚████║██║╚██████╗██║     ███████╗╚██████╔╝╚███╔███╔╝
echo    ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
echo.
echo                        HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH
echo.
echo ────────────────────────────────────────────────────────────────────────────────
echo.

:: Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [Loi] Python chua duoc cai dat!
    echo Vui long tai Python tu: https://www.python.org/downloads/
    echo.
    pause
    exit /b
)

echo [OK] Python da duoc cai dat!
echo.

:: Port mặc định
set PORT=8000

:: Kiểm tra port (dùng PowerShell để kiểm tra)
powershell -Command "$tcp = New-Object System.Net.Sockets.TcpListener('localhost', $env:PORT); try { $tcp.Start(); $tcp.Stop(); Write-Host '[OK] Port' $env:PORT 'trong!' } catch { Write-Host '[CẢNH BÁO] Port' $env:PORT 'đã dùng!'; $env:PORT = Read-Host 'Nhập port khác'; }" >nul 2>&1

:: Thông báo
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo ✅ SERVER ĐANG CHẠY THÀNH CÔNG!
echo 📍 Địa chỉ server:  http://localhost:%PORT%
echo 📂 Thư mục gốc:     %cd%
echo ════════════════════════════════════════════════════════════════════════════
echo 💡 Nhấn Ctrl + C để dừng server
echo.

:: Mở trình duyệt (chờ 2 giây để server khởi động)
timeout /t 2 /nobreak >nul
start http://localhost:%PORT%

:: Chạy server Python
python -m http.server %PORT%

echo.
pause
