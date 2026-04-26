param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'

Write-Host "Gemini configuration check"
Write-Host "Root: $Root"

$key = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'Process')
if ([string]::IsNullOrWhiteSpace($key)) {
  $key = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')
}
if ([string]::IsNullOrWhiteSpace($key)) {
  $key = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'Machine')
}

if ([string]::IsNullOrWhiteSpace($key)) {
  Write-Host "GEMINI_API_KEY is not set."
  Write-Host "Set it in PowerShell without saving it to the repository:"
  Write-Host '$env:GEMINI_API_KEY="your_api_key_here"'
  exit 2
}

Write-Host "GEMINI_API_KEY is present."
Write-Host "Key length: $($key.Length)"
Write-Host "Secret value: hidden"
Write-Host "OK: Gemini account access can be used by tools that read GEMINI_API_KEY."
exit 0
