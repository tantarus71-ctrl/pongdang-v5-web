param(
  [string]$Summary,
  [string]$Next = "",
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($Summary)) {
  throw "Summary is required. Example: .\tools\record-learning.ps1 -Summary 'Fixed mobile menu overlap' -Next 'Verify 390px viewport'"
}

$date = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$logPath = Join-Path $Root 'docs/LEARNING_LOG.md'
$memoryPath = Join-Path $Root 'data/development_memory.json'

$entry = @"

## $date

- Summary: $Summary
- Next: $Next
"@
Add-Content -LiteralPath $logPath -Value $entry -Encoding UTF8

$memory = Get-Content -LiteralPath $memoryPath -Raw -Encoding UTF8 | ConvertFrom-Json
$fact = [pscustomobject]@{
  date = (Get-Date -Format 'yyyy-MM-dd')
  fact = $Summary
  evidence = 'Recorded by tools/record-learning.ps1'
}
$facts = @($memory.learnedFacts)
$facts += $fact
$memory.learnedFacts = $facts
if (![string]::IsNullOrWhiteSpace($Next)) {
  $targets = @($memory.nextLearningTargets)
  $targets = @($Next) + $targets
  $memory.nextLearningTargets = $targets | Select-Object -First 8
}
$memory.updatedAt = (Get-Date -Format 'yyyy-MM-dd')
$memory | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $memoryPath -Encoding UTF8

Write-Host "Recorded learning: $Summary"
