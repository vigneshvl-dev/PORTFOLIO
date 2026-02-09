@echo off
cd /d "%~dp0"
echo Starting deployment... > deploy_log.txt
echo Date: %date% %time% >> deploy_log.txt

echo Preparing files (Running git add)... >> deploy_log.txt
git add . >> deploy_log.txt 2>&1

echo Saving changes (Running git commit)... >> deploy_log.txt
git commit -m "Update portfolio: Remove Engineers Day 2025 Certificate" >> deploy_log.txt 2>&1

echo Synchronizing with GitHub (Running git pull)... >> deploy_log.txt
git pull --rebase >> deploy_log.txt 2>&1

echo Uploading to website (Running git push)... >> deploy_log.txt
git push >> deploy_log.txt 2>&1

echo Done! >> deploy_log.txt
echo.
echo ======================================================
echo PROCESS COMPLETE!
echo ======================================================
echo If you don't see changes on your site, please check 
echo the "deploy_log.txt" file for errors.
echo ======================================================
pause
