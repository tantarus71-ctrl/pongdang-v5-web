param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'
$errors = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

function Add-Err([string]$Message) { $errors.Add($Message) | Out-Null }
function Add-Warn([string]$Message) { $warnings.Add($Message) | Out-Null }
function Read-JsonFile([string]$Path) {
  if (!(Test-Path $Path)) {
    Add-Err "Missing JSON file: $Path"
    return $null
  }
  try {
    return Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
  } catch {
    Add-Err "Invalid JSON: $Path - $($_.Exception.Message)"
    return $null
  }
}
function Test-File([string]$Path, [string]$Label) {
  $full = Join-Path $Root $Path
  if (!(Test-Path -LiteralPath $full)) {
    Add-Err "$Label not found: $Path"
  }
}

$manifestPath = Join-Path $Root 'manifest.json'
$projectPath = Join-Path $Root 'project-manifest.json'
$packagePath = Join-Path $Root 'package_manifest.json'
$manifest = Read-JsonFile $manifestPath
$project = Read-JsonFile $projectPath
$package = Read-JsonFile $packagePath

if ($manifest -and $project -and $package) {
  $version = [string]$manifest.version
  foreach ($pair in @(
    @{ Name = 'project-manifest.json'; Value = [string]$project.version },
    @{ Name = 'package_manifest.json'; Value = [string]$package.version },
    @{ Name = 'completed_step'; Value = [string]$manifest.completed_step.version }
  )) {
    if ($pair.Value -ne $version) {
      Add-Err "Version mismatch: manifest.json=$version, $($pair.Name)=$($pair.Value)"
    }
  }

  Test-File $manifest.entrypoints.root 'Root entry'
  Test-File $manifest.entrypoints.viewer 'Viewer entry'
  Test-File $manifest.entrypoints.app 'App entry'
  Test-File $manifest.entrypoints.patch 'Patch entry'
  Test-File $manifest.final_background.file 'Final background'
  if ($manifest.planning) {
    Test-File $manifest.planning.chat_version_plan 'Chat version plan'
    Test-File $manifest.planning.sync_prompt 'Codex/ChatGPT sync prompt'
    Test-File $manifest.planning.fish_catalog_draft 'Fish catalog draft'
    Test-File $manifest.planning.mobile_menu_candidate 'Mobile menu candidate CSS'
  }

  $appPath = Join-Path $Root $manifest.entrypoints.app
  $patchPath = Join-Path $Root $manifest.entrypoints.patch
  if (Test-Path -LiteralPath $appPath) {
    $app = Get-Content -LiteralPath $appPath -Raw -Encoding UTF8
    if ($app -notmatch [regex]::Escape($version)) {
      Add-Err "App entry does not contain current version: $version"
    }
    if ($app -notmatch [regex]::Escape($manifest.entrypoints.patch.Replace('\','/'))) {
      Add-Warn "App entry may not reference patch file directly: $($manifest.entrypoints.patch)"
    }
    foreach ($asset in @(
      'assets/backgrounds/upper_day_underwater_real_v2.png',
      'assets/fish/beodeulchi/right.png',
      'assets/fish/beodeulchi/left.png',
      'assets/fish/beodeulchi/front_left.png',
      'assets/fish/beodeulchi/front_right.png',
      'assets/fish/beodeulchi/swim.svg',
      'assets/fish/beodeulchi/card.svg'
    )) {
      if (!(Test-Path -LiteralPath (Join-Path $Root $asset))) {
        Add-Err "Required runtime asset missing: $asset"
      }
    }
    foreach ($futureAsset in @(
      'assets/fish/beodeulchi/card.png',
      'assets/fish/beodeulchi/popup.png'
    )) {
      if (!(Test-Path -LiteralPath (Join-Path $Root $futureAsset))) {
        Add-Warn "Future beodeulchi asset missing, keep fallback active: $futureAsset"
      }
    }
  }
  if (Test-Path -LiteralPath $patchPath) {
    $patch = Get-Content -LiteralPath $patchPath -Raw -Encoding UTF8
    if ($patch.Length -lt 1000) {
      Add-Warn "Patch file is unexpectedly small: $($manifest.entrypoints.patch)"
    }
  }
  $catalogPath = Join-Path $Root 'data/fish_catalog_option2.json'
  $catalog = Read-JsonFile $catalogPath
  if ($catalog) {
    if ($catalog.schema -ne 'fish_database_option2') {
      Add-Err "Fish catalog schema mismatch: $($catalog.schema)"
    }
    if (!$catalog.species.beodeulchi) {
      Add-Err "Fish catalog must include beodeulchi draft data."
    }
  }
}

Write-Host "Pongdang release validation"
Write-Host "Root: $Root"
if ($manifest) { Write-Host "Version: $($manifest.version)" }

if ($warnings.Count -gt 0) {
  Write-Host ""
  Write-Host "Warnings:"
  $warnings | ForEach-Object { Write-Host " - $_" }
}

if ($errors.Count -gt 0) {
  Write-Host ""
  Write-Host "Errors:"
  $errors | ForEach-Object { Write-Host " - $_" }
  exit 1
}

Write-Host "OK: release structure is consistent."
exit 0
