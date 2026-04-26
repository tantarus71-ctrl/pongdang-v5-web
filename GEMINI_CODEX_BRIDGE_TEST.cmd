@echo off
setlocal
cd /d "%~dp0"
echo.
echo Gemini Codex bridge test
echo ========================
echo.
echo This uses GEMINI_API_KEY from your Windows User environment.
echo The key will not be printed.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\invoke-gemini-bridge.ps1" -Prompt "Reply with exactly: Gemini bridge ready"
echo.
pause
