param(
  [Parameter(Mandatory = $true)]
  [string]$DraftFile,
  [string]$ReviewName = 'chatgpt_draft_review',
  [string]$Model = 'gemini-2.5-flash'
)

$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

if (!(Test-Path -LiteralPath $DraftFile)) {
  $candidate = Join-Path $Root $DraftFile
  if (Test-Path -LiteralPath $candidate) {
    $DraftFile = $candidate
  } else {
    Write-Host "Draft file not found: $DraftFile"
    exit 4
  }
}

$draft = Get-Content -LiteralPath $DraftFile -Raw -Encoding UTF8
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$safeName = ($ReviewName -replace '[^0-9A-Za-z._-]', '_')
$outDir = Join-Path $Root 'docs/gemini_reviews'
$outFile = Join-Path $outDir "$stamp`_$safeName.md"

$prompt = @"
You are the Gemini reviewer for the pongdang-v5-web project.

Project source of truth:
- GitHub main
- manifest.json
- project-manifest.json
- docs/AI_MUTUAL_EXPANSION_LOOP.md
- data/ai_expansion_state.json

Review the ChatGPT draft below. Do not request secrets, credentials, payment changes, or permission changes.

Return a concise Korean review with these sections:
1. 핵심 판단
2. 위험/누락
3. 성능/안정성 관점
4. Codex에게 줄 실행 지시
5. 채택 단계: level_0, level_1, level_2, level_3 중 하나

ChatGPT draft:
---
$draft
---
"@

& (Join-Path $PSScriptRoot 'invoke-gemini-bridge.ps1') -Prompt $prompt -Model $Model -OutputFile $outFile
