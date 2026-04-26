@echo off
setlocal
cd /d "%~dp0"
echo.
echo Gemini API key easy setup
echo =========================
echo.
echo 1. Use a NEW Gemini API key.
echo 2. When the prompt appears, paste the key and press Enter.
echo 3. The key may be invisible while typing. That is normal.
echo 4. The key is saved to your Windows User environment, not to GitHub.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\set-gemini-user-key.ps1"
echo.
echo Final saved-key check:
powershell -NoProfile -ExecutionPolicy Bypass -Command "$k=[Environment]::GetEnvironmentVariable('GEMINI_API_KEY','User'); if([string]::IsNullOrWhiteSpace($k)){Write-Host 'NOT SAVED'}else{Write-Host ('SAVED length=' + $k.Length)}"
echo.
pause
