@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0push-web-bac-si.ps1"
pause
