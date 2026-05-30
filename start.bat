
@echo off
title ClinicFlow - Full Stack
color 0B

echo.
echo =============================================
echo  🏥 ClinicFlow - Hệ thống đặt lịch khám
echo =============================================
echo.

REM Kiểm tra Node.js
echo [1/3] Kiem tra Node.js...
node --version &gt;nul 2&gt;&amp;1
if %errorlevel% neq 0 (
    echo [LOI] Node.js chua duoc cai dat!
    echo Vui long tai Node.js tu https://nodejs.org/
    pause
    exit /b
)

REM Cài dependencies backend nếu chưa có
if not exist backend\node_modules (
    echo [2/3] Cai dat dependencies backend...
    cd backend
    call npm install
    cd ..
)

echo.
echo =============================================
echo  ✨ DANG KHOI DONG HỆ THỐNG...
echo =============================================
echo.

REM Khởi động backend trong cửa sổ mới
start "ClinicFlow Backend" cmd /k "cd backend &amp;&amp; node server.js"

echo Chờ backend khoi dong (3 giay)...
timeout /t 3 /nobreak &gt;nul

REM Khởi động frontend
echo Khoi dong frontend (http://localhost:8000)...
start "" http://localhost:8000
cd frontend
python -m http.server 8000
