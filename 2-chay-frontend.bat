
@echo off
title ClinicFlow Frontend
cd /d "%~dp0frontend"
echo.
echo Frontend dang chay tai http://localhost:8000
echo.
python -m http.server 8000
pause
