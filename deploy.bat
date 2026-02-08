@echo off
:: Ensure the script runs in the directory where it is located
cd /d "%~dp0"

echo Deploying your portfolio updates from %cd%...

:: Check if .git directory exists
if not exist ".git" (
    echo ERROR: This folder is not a Git repository. 
    echo Please make sure you are running this script inside your PORTFOLIO folder.
    pause
    exit /b
)

git add .
git commit -m "Update portfolio: Remove Gemini Certified Student Certificate"
git push
echo.
echo Done! Please refresh your website in 1-2 minutes.
pause