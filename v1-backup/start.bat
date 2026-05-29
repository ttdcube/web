
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
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Node.js chua duoc cai dat!
    echo Vui long tai Node.js tu https://nodejs.org/
    pause
    exit /b
)

REM Kiểm tra Python
echo [2/3] Kiem tra Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Python chua duoc cai dat!
    echo Vui long tai Python tu https://www.python.org/
    pause
    exit /b
)

REM Cài dependencies nếu chưa có
if not exist backend\node_modules (
    echo [3/3] Cai dat dependencies backend...
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
start "ClinicFlow Backend" cmd /k "cd backend && node server.js"

echo Chờ backend khoi dong (3 giay)...
timeout /t 3 /nobreak >nul

REM Khởi động frontend
echo Khoi dong frontend...
start "" http://localhost:8000
cd frontend
python -m http.server 8000
