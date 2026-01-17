@echo off
title BIS System Launcher

echo ================================
echo Starting XAMPP Services
echo ================================

start "" "C:\xampp\apache_start.bat"
start "" "C:\xampp\mysql_start.bat"

timeout /t 5 >nul

echo ================================
echo Starting Backend Server
echo ================================

start "BIS Backend" cmd /k ^
cd /d "C:\Users\Arden\Desktop\Barangay22\backend" ^& npm install ^& npm run dev

timeout /t 3 >nul

echo ================================
echo Starting Frontend Server
echo ================================

start "BIS Frontend" cmd /k ^
cd /d "C:\Users\Arden\Desktop\Barangay22\frontend" ^& npm install ^& npm run dev

echo ================================
echo Opening browser...
echo ================================

timeout /t 3 >nul
start http://192.168.0.180:5173

echo ================================
echo All services started successfully
echo ================================

pause
