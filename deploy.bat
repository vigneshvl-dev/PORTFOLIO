@echo off
cd /d "%~dp0"
echo Starting deployment... > deploy_log.txt
echo Date: %date% %time% >> deploy_log.txt

echo Running git add . >> deploy_log.txt
git add . >> deploy_log.txt 2>&1

echo Running git commit... >> deploy_log.txt
git commit -m "Update portfolio: Remove Engineers Day 2025 Certificate" >> deploy_log.txt 2>&1

echo Running git push... >> deploy_log.txt
git push >> deploy_log.txt 2>&1

echo Done! >> deploy_log.txt
echo.
echo Process complete. If you don't see changes, please check deploy_log.txt.
pause
