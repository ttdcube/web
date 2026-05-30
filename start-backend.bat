
@echo off
title ClinicFlow Backend
color 0B

echo.
echo =============================================
echo  🏥 ClinicFlow - Backend Node.js
echo =============================================
echo.

REM Kiểm tra Node.js
echo [1/2] Kiem tra Node.js...
node --version >nul 2>&amp;1
if %errorlevel% neq 0 (
    echo [LOI] Node.js chua duoc cai dat!
    echo Vui long tai Node.js tu https://nodejs.org/
    pause
    exit /b
)

REM Cài dependencies nếu chưa có
if not exist backend\node_modules (
    echo [2/2] Cai dat dependencies backend...
    cd backend
    call npm install
    cd ..
)

echo.
echo =============================================
echo  ✨ DANG KHOI DONG BACKEND...
echo  Server se chay tai http://localhost:5000
echo =============================================
echo.

cd backend
node server.js
pause
