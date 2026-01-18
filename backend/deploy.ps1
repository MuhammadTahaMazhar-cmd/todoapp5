# Auto-deploy script for Phase 2 Backend to Hugging Face Spaces
# Usage: .\deploy.ps1
# Or: .\deploy.ps1 -SpaceName "YourSpaceName" -HFUsername "yourusername"

param(
    [string]$SpaceName = "",
    [string]$HFUsername = ""
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Phase 2 Backend Auto-Deploy" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Get Space name and username if not provided
if ([string]::IsNullOrEmpty($SpaceName)) {
    $SpaceName = Read-Host "Enter your Hugging Face Space name (e.g., Hackthon2Phase2)"
}

if ([string]::IsNullOrEmpty($HFUsername)) {
    $HFUsername = Read-Host "Enter your Hugging Face username"
}

Write-Host ""
Write-Host "Space: $SpaceName" -ForegroundColor Yellow
Write-Host "Username: $HFUsername" -ForegroundColor Yellow
Write-Host ""

# Determine HF Space path
$hfSpacePath = "..\$SpaceName"
$spaceUrl = "https://huggingface.co/spaces/$HFUsername/$SpaceName"

if (-not (Test-Path $hfSpacePath)) {
    Write-Host "📦 Cloning Space repository..." -ForegroundColor Cyan
    Write-Host "URL: $spaceUrl" -ForegroundColor Gray
    Write-Host ""
    
    # Try to clone
    try {
        Push-Location ..
        git clone $spaceUrl 2>&1 | Out-Null
        Pop-Location
        
        if (-not (Test-Path $hfSpacePath)) {
            Write-Host "❌ Clone failed!" -ForegroundColor Red
            Write-Host ""
            Write-Host "Please clone manually first:" -ForegroundColor Yellow
            Write-Host "   cd .." -ForegroundColor White
            Write-Host "   git clone $spaceUrl" -ForegroundColor White
            Write-Host "   cd backend" -ForegroundColor White
            Write-Host "   .\deploy.ps1" -ForegroundColor White
            exit 1
        }
        Write-Host "✅ Space cloned!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Clone failed: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Clone manually:" -ForegroundColor Yellow
        Write-Host "   git clone $spaceUrl" -ForegroundColor White
        exit 1
    }
    Write-Host ""
}

Write-Host "✅ Found Space directory: $hfSpacePath" -ForegroundColor Green
Write-Host ""

# Files to copy
$filesToCopy = @(
    "app.py",
    "Dockerfile",
    "requirements.txt",
    ".dockerignore",
    "alembic.ini",
    "start.sh"
)

# Directories to copy
$dirsToCopy = @(
    "src",
    "alembic"
)

Write-Host "📋 Copying files..." -ForegroundColor Cyan

# Copy files
foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $hfSpacePath -Force | Out-Null
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Missing: $file" -ForegroundColor Yellow
    }
}

# Copy directories
foreach ($dir in $dirsToCopy) {
    if (Test-Path $dir) {
        $destPath = Join-Path $hfSpacePath $dir
        if (Test-Path $destPath) {
            Remove-Item $destPath -Recurse -Force
        }
        Copy-Item -Recurse $dir -Destination $hfSpacePath -Force | Out-Null
        Write-Host "  ✅ $dir/" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Missing: $dir" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Files copied successfully!" -ForegroundColor Green
Write-Host ""

# Check if git is initialized
Push-Location $hfSpacePath
try {
    $gitStatus = git status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "📝 Git repository detected" -ForegroundColor Cyan
        
        # Check for changes
        $changes = git status --porcelain
        if ($changes) {
            Write-Host "📦 Staging changes..." -ForegroundColor Cyan
            git add . | Out-Null
            
            Write-Host "💾 Committing..." -ForegroundColor Cyan
            git commit -m "Deploy Phase 2 FastAPI backend - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-Null
            
            Write-Host "🚀 Pushing to Hugging Face..." -ForegroundColor Cyan
            Write-Host ""
            git push
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✅✅✅ DEPLOYMENT SUCCESSFUL! ✅✅✅" -ForegroundColor Green
                Write-Host ""
                Write-Host "🔐 CRITICAL: Set these secrets in HF Space:" -ForegroundColor Yellow
                Write-Host "   1. DATABASE_URL" -ForegroundColor White
                Write-Host "   2. BETTER_AUTH_SECRET" -ForegroundColor White
                Write-Host ""
                Write-Host "🌐 Space URL: https://huggingface.co/spaces/$HFUsername/$SpaceName" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "⏳ Wait 2-5 minutes for build to complete..." -ForegroundColor Gray
            } else {
                Write-Host ""
                Write-Host "⚠️  Push failed. Run manually:" -ForegroundColor Yellow
                Write-Host "   cd $hfSpacePath" -ForegroundColor White
                Write-Host "   git push" -ForegroundColor White
                Write-Host ""
                Write-Host "Use HF access token as password when prompted." -ForegroundColor Gray
            }
        } else {
            Write-Host "ℹ️  No changes to commit" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️  Not a git repository. Skipping git operations." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To complete deployment:" -ForegroundColor Cyan
        Write-Host "   cd $hfSpacePath" -ForegroundColor Gray
        Write-Host "   git init" -ForegroundColor Gray
        Write-Host "   git add ." -ForegroundColor Gray
        Write-Host "   git commit -m 'Deploy Phase 2 backend'" -ForegroundColor Gray
        Write-Host "   git remote add origin https://huggingface.co/spaces/$HFUsername/$SpaceName" -ForegroundColor Gray
        Write-Host "   git push -u origin main" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  Git operations skipped: $_" -ForegroundColor Yellow
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "✨ Done! Check your Space for build status." -ForegroundColor Green

