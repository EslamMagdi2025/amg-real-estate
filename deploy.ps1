# Script to push changes to GitHub and auto-deploy to Vercel

Write-Host "🔄 Adding all changes to Git..." -ForegroundColor Cyan
git add .

$commitMessage = Read-Host "💾 Enter commit message"
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "✅ Changes pushed! Vercel will auto-deploy in 2-3 minutes." -ForegroundColor Green
Write-Host "🌐 Check your site at: https://your-project.vercel.app" -ForegroundColor Blue