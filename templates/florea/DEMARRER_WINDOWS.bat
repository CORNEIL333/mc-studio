@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
 start "" "http://localhost:8080"
 py -3 -m http.server 8080
) else (
 where python >nul 2>nul
 if errorlevel 1 (
  echo Python 3 est necessaire. Vous pouvez aussi utiliser Live Server dans VS Code.
  pause
  exit /b 1
 )
 start "" "http://localhost:8080"
 python -m http.server 8080
)
pause
