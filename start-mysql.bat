@echo off
:: Batch script to start MySQL80 with Administrator Elevation
echo ========================================================
echo   Archivalia - Starting MySQL 8.0 Windows Service
echo ========================================================
echo.
net session >nul 2>&1
if %errorLevel% == 0 (
    net start MySQL80
) else (
    echo Elevating privileges to start MySQL80...
    powershell -Command "Start-Process cmd -ArgumentList '/c net start MySQL80 && echo MySQL Started Successfully! && pause' -Verb RunAs"
)
