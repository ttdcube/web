
@echo off
title ClinicFlow - Full Stack
color 0B

echo.
echo =============================================
echo  ClinicFlow - He thong dat lich kham
echo =============================================
echo.

echo [1/3] Kiem tra Node.js...
node --version
if %errorlevel% neq 0 (
    echo.
    echo [LOI] Node.js chua duoc cai dat!
    echo Vui long tai Node.js tu https://nodejs.org/
    echo.
    pause
    exit /b
)

if not exist backend\node_modules (
    echo [2/3] Cai dat dependencies backend...
    cd backend
    call npm install
    cd ..
)

echo.
echo =============================================
echo  DANG KHOI DONG HE THONG...
echo =============================================
echo.

start "ClinicFlow Backend" cmd /k "cd backend &amp;&amp; node server.js"

echo Cho backend khoi dong (3 giay)...
timeout /t 3 /nobreak &gt;nul

echo Khoi dong frontend (http://localhost:8000)...
start "" http://localhost:8000
cd frontend
python -m http.server 8000
pause
