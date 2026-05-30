
@echo off
title ClinicFlow - Backend and Frontend
color 0B

echo.
echo Starting ClinicFlow...
echo.

echo [1] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit
)

if not exist backend\node_modules (
    echo [2] Installing dependencies...
    cd backend
    call npm install
    cd ..
)

echo.
echo Starting Backend...
start "ClinicFlow Backend" cmd /k "cd backend && node server.js"

echo Waiting for backend (3 seconds)...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend on http://localhost:8000
start "" http://localhost:8000
cd frontend
python -m http.server 8000
pause
