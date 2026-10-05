@echo off
setlocal enabledelayedexpansion
title Archivalia E-Library System - Service Launcher
echo ======================================================================
echo    Archivalia Enterprise Academic E-Library System (PS038)
echo             Full Microservices Ecosystem Launcher
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

echo [1/10] Starting Eureka Service Discovery (:8761)...
start "Eureka-Server-8761" cmd /c "cd /d "%ROOT_DIR%\Backend\eureka-server" && java -jar target\eureka-server-1.0.0-SNAPSHOT.jar"
timeout /t 6 /nobreak >nul

echo [2/10] Starting Spring Cloud API Gateway (:8080)...
start "API-Gateway-8080" cmd /c "cd /d "%ROOT_DIR%\Backend\api-gateway" && java -jar target\api-gateway-1.0.0-SNAPSHOT.jar"
timeout /t 5 /nobreak >nul

echo [3/10] Starting Auth Service (:8081)...
start "Auth-Service-8081" cmd /c "cd /d "%ROOT_DIR%\Backend\auth-service" && java -jar target\auth-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=default"

echo [4/10] Starting Book Service (:8082)...
start "Book-Service-8082" cmd /c "cd /d "%ROOT_DIR%\Backend\book-service" && java -jar target\book-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=default"

echo [5/10] Starting Borrow Service (:8083)...
start "Borrow-Service-8083" cmd /c "cd /d "%ROOT_DIR%\Backend\borrow-service" && java -jar target\borrow-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=default"

echo [6/10] Starting Fine Service (:8084)...
start "Fine-Service-8084" cmd /c "cd /d "%ROOT_DIR%\Backend\fine-service" && java -jar target\fine-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=default"

echo [7/10] Starting Notification Service (:8085)...
start "Notification-Service-8085" cmd /c "cd /d "%ROOT_DIR%\Backend\notification-service" && java -jar target\notification-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=default"

echo [8/10] Starting Recommendation Service (:8086)...
start "Recommendation-Service-8086" cmd /c "cd /d "%ROOT_DIR%\Backend\recommendation-service" && java -jar target\recommendation-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=default"

echo [9/10] Starting Resource Discovery Service (:8087)...
start "Discovery-Service-8087" cmd /c "cd /d "%ROOT_DIR%\Backend\discovery-service" && java -jar target\discovery-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=default"

echo [10/10] Starting React Vite Frontend (:5173)...
start "Frontend-Vite-5173" cmd /c "cd /d "%ROOT_DIR%\Frontend" && npm run dev -- --host"

echo.
echo All services have been launched in separate console sessions.
echo Waiting 10 seconds for services to finish bootstrapping...
timeout /t 10 /nobreak >nul

echo.
call check-status.bat
