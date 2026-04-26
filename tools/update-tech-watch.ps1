param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [int]$TimeoutSec = 20
)

$ErrorActionPreference = 'Stop'
$watchPath = Join-Path $Root 'data/technology_watchlist.json'
$logPath = Join-Path $Root 'data/technology_research_log.json'

$watch = Get-Content -LiteralPath $watchPath -Raw -Encoding UTF8 | ConvertFrom-Json
$results = @()

foreach ($candidate in $watch.candidates) {
  $entry = [ordered]@{
    id = $candidate.id
    name = $candidate.name
    source = $candidate.source
    checkedAt = (Get-Date).ToString('s')
    ok = $false
    title = ""
    status = $candidate.status
    risk = $candidate.risk
    note = ""
  }
  try {
    $response = Invoke-WebRequest -Uri $candidate.source -UseBasicParsing -TimeoutSec $TimeoutSec
    $entry.ok = $true
    $entry.note = "HTTP $($response.StatusCode)"
    if ($response.Content -match '<title>(.*?)</title>') {
      $entry.title = ([System.Net.WebUtility]::HtmlDecode($Matches[1])).Trim()
    }
  } catch {
    $entry.note = $_.Exception.Message
  }
  $results += [pscustomobject]$entry
}

$log = [ordered]@{
  schema = 'pongdang_technology_research_log'
  version = 1
  updatedAt = (Get-Date).ToString('yyyy-MM-dd')
  entries = $results
}

$log | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $logPath -Encoding UTF8
Write-Host "Updated technology research log: $logPath"
foreach ($result in $results) {
  Write-Host "$($result.id): $($result.note)"
}
