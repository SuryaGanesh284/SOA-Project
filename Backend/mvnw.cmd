@echo off
setlocal
set "DIR=%~dp0"
set "MVN_CMD=%DIR%.mvn\maven\apache-maven-3.9.9\bin\mvn.cmd"
if not exist "%MVN_CMD%" (
    echo Maven binary not found at "%MVN_CMD%"
    exit /b 1
)
"%MVN_CMD%" %*
