param(
  [string]$CommitMessage = "",
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'
$git = 'C:\Program Files\Git\cmd\git.exe'
if (!(Test-Path $git)) { $git = 'git' }

& powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'validate-release.ps1') -Root $Root
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$manifest = Get-Content -LiteralPath (Join-Path $Root 'manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
  $CommitMessage = "Publish Pongdang $($manifest.version)"
}

& $git -c "safe.directory=$($Root.Replace('\','/'))" -C $Root status --short
& $git -c "safe.directory=$($Root.Replace('\','/'))" -C $Root add -A

$staged = & $git -c "safe.directory=$($Root.Replace('\','/'))" -C $Root diff --cached --name-only
if ($staged) {
  & $git -c "safe.directory=$($Root.Replace('\','/'))" -C $Root commit -m $CommitMessage
} else {
  Write-Host "No staged changes to commit."
}

& $git -c "safe.directory=$($Root.Replace('\','/'))" -C $Root push origin main
& $git -c "safe.directory=$($Root.Replace('\','/'))" -C $Root push origin main:gh-pages

try {
  $url = "$($manifest.urls.pages)app_assets/index.html?check=$([uri]::EscapeDataString($manifest.version))-$(Get-Date -Format yyyyMMddHHmmss)"
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.Content -match [regex]::Escape($manifest.version)) {
    Write-Host "OK: GitHub Pages is serving $($manifest.version)"
  } else {
    Write-Host "Warning: GitHub Pages responded but version text was not found yet."
  }
} catch {
  Write-Host "Warning: GitHub Pages verification failed or is still deploying: $($_.Exception.Message)"
}
