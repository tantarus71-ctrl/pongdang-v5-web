@echo off
setlocal
set "ROOT=%~dp0"
set "PY=C:\Users\tanta\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
set "EDGE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

start "pongdang-local-server" /min "%PY%" -m http.server 4830 --bind 127.0.0.1 --directory "%ROOT%"
timeout /t 2 /nobreak >nul
start "Pongdang v4.8.30" "%EDGE%" --app=http://127.0.0.1:4830/ --window-size=430,900 --window-position=80,40
