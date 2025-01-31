@echo off
title kTicketBot - A basic ticket bot includes what you need

: start
echo kTicketBot - Starting...

if not exist "node_modules" (
    echo Modules not installed. Modules are being installed.
    npm i
    echo Installation of modules is complete. Close and reopen the window.
    pause
)

node index.js
goto start
pause