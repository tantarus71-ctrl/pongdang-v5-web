@echo off
setlocal
cd /d "%~dp0"
echo.
echo Gemini API key visible setup
echo ============================
echo.
echo Paste a NEW Gemini API key below, then press Enter.
echo This visible mode is simpler. Do not share screenshots of this window.
echo The key is saved to your Windows User environment, not to GitHub.
echo.
set /p GEMINI_KEY=Paste NEW GEMINI_API_KEY: 
if "%GEMINI_KEY%"=="" (
  echo.
  echo No key entered. Nothing changed.
  pause
  exit /b 2
)
setx GEMINI_API_KEY "%GEMINI_KEY%" >nul
set "GEMINI_API_KEY=%GEMINI_KEY%"
echo.
echo Saved. Checking User environment...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$k=[Environment]::GetEnvironmentVariable('GEMINI_API_KEY','User'); if([string]::IsNullOrWhiteSpace($k)){Write-Host 'NOT SAVED'; exit 2}else{Write-Host ('SAVED length=' + $k.Length)}"
echo.
pause
