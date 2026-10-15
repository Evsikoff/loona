@echo off
cd /d "%~dp0"
where py >nul 2>nul && (py run_local.py) || (python run_local.py)
if errorlevel 1 (
  echo.
  echo Python not found. Install it from https://www.python.org/downloads/ and tick "Add python.exe to PATH".
)
pause
