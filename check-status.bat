@echo off
echo ======================================================
echo    Archivalia E-Library System - Status Checker
echo ======================================================
echo.
echo [1] Checking Frontend Server (Port 5173)...
netstat -ano | findstr /R /C:":5173 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:5173
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [2] Checking Backend Eureka Registry (Port 8761)...
netstat -ano | findstr /R /C:":8761 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8761
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [3] Checking Backend API Gateway (Port 8080)...
netstat -ano | findstr /R /C:":8080 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8080
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo ======================================================
pause
