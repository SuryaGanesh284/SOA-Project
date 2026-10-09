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
echo [4] Checking Backend Auth Service (Port 8081)...
netstat -ano | findstr /R /C:":8081 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8081
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [5] Checking Backend Book Service (Port 8082)...
netstat -ano | findstr /R /C:":8082 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8082
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [6] Checking Backend Borrow Service (Port 8083)...
netstat -ano | findstr /R /C:":8083 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8083
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [7] Checking Backend Fine Service (Port 8084)...
netstat -ano | findstr /R /C:":8084 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8084
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [8] Checking Backend Notification Service (Port 8085)...
netstat -ano | findstr /R /C:":8085 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8085
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [9] Checking Backend Recommendation Service (Port 8086)...
netstat -ano | findstr /R /C:":8086 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8086
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [10] Checking Backend Discovery Service (Port 8087)...
netstat -ano | findstr /R /C:":8087 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8087
) else (
    echo    STATUS: [STOPPED]
)
echo.
echo [11] Checking AI Intelligence Services (Port 8088)...
netstat -ano | findstr /R /C:":8088 " >nul
if %errorlevel% equ 0 (
    echo    STATUS: [RUNNING] -^> http://localhost:8088
) else (
    echo    STATUS: [STOPPED]
)
echo.
if "%1" neq "--no-pause" pause

