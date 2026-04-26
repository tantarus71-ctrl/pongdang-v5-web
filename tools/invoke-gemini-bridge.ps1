param(
  [string]$Prompt,
  [string]$PromptFile,
  [string]$OutputFile,
  [string]$Model = 'gemini-2.5-flash',
  [int]$TimeoutSec = 60
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($Prompt) -and ![string]::IsNullOrWhiteSpace($PromptFile)) {
  if (!(Test-Path -LiteralPath $PromptFile)) {
    Write-Host "Prompt file not found: $PromptFile"
    exit 4
  }
  $Prompt = Get-Content -LiteralPath $PromptFile -Raw -Encoding UTF8
}

if ([string]::IsNullOrWhiteSpace($Prompt)) {
  Write-Host 'Prompt or PromptFile is required.'
  exit 4
}

function Get-GeminiKey {
  $key = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'Process')
  if ([string]::IsNullOrWhiteSpace($key)) {
    $key = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')
  }
  if ([string]::IsNullOrWhiteSpace($key)) {
    $key = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'Machine')
  }
  return $key
}

$key = Get-GeminiKey
if ([string]::IsNullOrWhiteSpace($key)) {
  Write-Host 'GEMINI_API_KEY is not visible to this process.'
  Write-Host 'If the key was saved in an elevated/user environment, run this bridge from that same environment or restart Codex.'
  exit 2
}

$uri = "https://generativelanguage.googleapis.com/v1beta/models/$($Model):generateContent"
$body = @{
  contents = @(
    @{
      role = 'user'
      parts = @(
        @{ text = $Prompt }
      )
    }
  )
} | ConvertTo-Json -Depth 8

$headers = @{
  'x-goog-api-key' = $key
  'Content-Type' = 'application/json'
}

Write-Host "Gemini bridge request"
Write-Host "Model: $Model"
Write-Host "Secret value: hidden"

try {
  $response = Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $body -TimeoutSec $TimeoutSec
} catch {
  Write-Host "Gemini request failed: $($_.Exception.Message)"
  exit 1
}

$textParts = @()
foreach ($candidate in $response.candidates) {
  foreach ($part in $candidate.content.parts) {
    if ($part.text) {
      $textParts += $part.text
    }
  }
}

if ($textParts.Count -eq 0) {
  Write-Host 'Gemini returned no text.'
  exit 3
}

Write-Host ''
Write-Host 'Gemini response:'
$text = $textParts -join "`n"
Write-Host $text

if (![string]::IsNullOrWhiteSpace($OutputFile)) {
  $dir = Split-Path -Parent $OutputFile
  if (![string]::IsNullOrWhiteSpace($dir) -and !(Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
  $text | Set-Content -LiteralPath $OutputFile -Encoding UTF8
  Write-Host ''
  Write-Host "Saved Gemini response: $OutputFile"
}
