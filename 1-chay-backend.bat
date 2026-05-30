
@echo off
title ClinicFlow Backend
cd /d "%~dp0backend"
if not exist node_modules (
  echo Dang cai dependencies...
  call npm install
)
echo.
echo Backend dang chay tai http://localhost:5000
echo.
node server.js
pause
