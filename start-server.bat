
@echo off
title ClinicFlow - Server
color 0B
echo.
echo DANG KHOI DONG SERVER CLINICFLOW...
echo.
echo Server se chay tai: http://localhost:8000
echo.
echo DANG MO TRINH DUYET...
timeout /t 2 /nobreak >nul
start http://localhost:8000
echo.
echo DANG CHAY SERVER (NHAN Ctrl+C DE DUNG)...
python -m http.server 8000
pause
