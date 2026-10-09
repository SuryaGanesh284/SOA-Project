@echo off
title Archivalia E-Library System - Service Terminator
echo ======================================================================
echo    Archivalia Enterprise Academic E-Library System (PS038)
echo             Stopping All Microservice Processes
echo ======================================================================
echo.

set "PORTS=5173 8761 8080 8081 8082 8083 8084 8085 8086 8087 8088"

for %%p in (%PORTS%) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%p " ^| findstr "LISTENING"') do (
        echo Stopping service on port %%p (PID: %%a)...
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo All microservice processes have been terminated.
timeout /t 2 /nobreak >nul
call check-status.bat
