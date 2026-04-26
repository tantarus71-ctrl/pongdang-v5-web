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
    Test-File $manifest.planning.learning_system 'Project learning system'
    Test-File $manifest.planning.session_start_prompt 'Session start prompt'
    Test-File $manifest.planning.development_memory 'Development memory'
    if ($manifest.planning.exchange_protocol) {
      Test-File $manifest.planning.exchange_protocol 'Mutual exchange protocol'
    }
    if ($manifest.planning.chatgpt_codex_sequential_workflow) {
      Test-File $manifest.planning.chatgpt_codex_sequential_workflow 'ChatGPT/Codex sequential workflow'
    }
    if ($manifest.planning.ai_collaboration_protocol) {
      Test-File $manifest.planning.ai_collaboration_protocol 'AI collaboration protocol'
    }
    if ($manifest.planning.ai_collaboration_matrix) {
      Test-File $manifest.planning.ai_collaboration_matrix 'AI collaboration matrix'
    }
    if ($manifest.planning.ai_mutual_expansion_loop) {
      Test-File $manifest.planning.ai_mutual_expansion_loop 'AI mutual expansion loop'
    }
    if ($manifest.planning.ai_expansion_state) {
      Test-File $manifest.planning.ai_expansion_state 'AI expansion state'
    }
    if ($manifest.planning.chatgpt_gemini_integration) {
      Test-File $manifest.planning.chatgpt_gemini_integration 'ChatGPT Gemini integration'
    }
    if ($manifest.planning.gemini_account_setup) {
      Test-File $manifest.planning.gemini_account_setup 'Gemini account setup'
    }
    if ($manifest.planning.exchange_channels) {
      Test-File $manifest.planning.exchange_channels 'Exchange channels'
    }
    if ($manifest.planning.self_expansion_tech_radar) {
      Test-File $manifest.planning.self_expansion_tech_radar 'Self expansion tech radar'
    }
    if ($manifest.planning.technology_watchlist) {
      Test-File $manifest.planning.technology_watchlist 'Technology watchlist'
    }
    if ($manifest.planning.technology_research_log) {
      Test-File $manifest.planning.technology_research_log 'Technology research log'
    }
    if ($manifest.planning.ecosystem_assets) {
      Test-File $manifest.planning.ecosystem_assets 'Gonjiam ecosystem assets'
    }
    if ($manifest.planning.next_fish_design_reflection) {
      Test-File $manifest.planning.next_fish_design_reflection 'Next fish design reflection'
    }
    if ($manifest.planning.fish_design_style_guide) {
      Test-File $manifest.planning.fish_design_style_guide 'Fish design style guide'
    }
    if ($manifest.planning.pirami_candidate_assets) {
      foreach ($candidateAsset in $manifest.planning.pirami_candidate_assets) {
        Test-File $candidateAsset 'Pirami candidate asset'
      }
    }
    Test-File $manifest.planning.decision_log 'Decision log'
    Test-File $manifest.planning.learning_log 'Learning log'
    Test-File $manifest.planning.chat_version_plan 'Chat version plan'
    Test-File $manifest.planning.sync_prompt 'Codex/ChatGPT sync prompt'
    Test-File $manifest.planning.fish_catalog_draft 'Fish catalog draft'
    if ($manifest.planning.child_quality_layout_candidate) {
      Test-File $manifest.planning.child_quality_layout_candidate 'Child quality layout candidate'
    }
    if ($manifest.planning.discovery_card_ux_candidate) {
      Test-File $manifest.planning.discovery_card_ux_candidate 'Discovery card UX candidate'
    }
    foreach ($candidateField in @(
      @{ Name = 'responsive_aquarium_ui_candidate'; Label = 'Responsive aquarium UI candidate' },
      @{ Name = 'responsive_ui_apply_candidate'; Label = 'Responsive UI apply candidate' },
      @{ Name = 'optimized_shell_candidate'; Label = 'Optimized shell candidate' },
      @{ Name = 'lightweight_modular_candidate'; Label = 'Lightweight modular candidate' },
      @{ Name = 'production_candidate'; Label = 'Production candidate' },
      @{ Name = 'visual_qa_matrix'; Label = 'Visual QA matrix' },
      @{ Name = 'index_replacement_precheck'; Label = 'Index replacement precheck' },
      @{ Name = 'safe_entry_candidate'; Label = 'Safe entry candidate' },
      @{ Name = 'safe_entry_plan'; Label = 'Safe entry plan' },
      @{ Name = 'external_demo_candidate'; Label = 'External demo candidate' },
      @{ Name = 'external_demo_guide'; Label = 'External demo guide' },
      @{ Name = 'external_demo_package'; Label = 'External demo package' },
      @{ Name = 'qr_helper_candidate'; Label = 'QR helper candidate' },
      @{ Name = 'qr_helper_plan'; Label = 'QR helper plan' },
      @{ Name = 'child_friendly_scale_candidate'; Label = 'Child friendly scale candidate' }
    )) {
      $fieldName = $candidateField.Name
      if ($manifest.planning.$fieldName) {
        Test-File $manifest.planning.$fieldName $candidateField.Label
      }
    }
    Test-File $manifest.planning.mobile_menu_candidate 'Mobile menu candidate CSS'
  }

  Test-File 'tools/check-gemini-config.ps1' 'Gemini config checker'
  Test-File 'tools/set-gemini-user-key.ps1' 'Gemini user key setup helper'
  Test-File 'GEMINI_KEY_SETUP_EASY.cmd' 'Gemini easy key setup launcher'
  Test-File 'GEMINI_KEY_SETUP_VISIBLE.cmd' 'Gemini visible key setup launcher'
  Test-File 'tools/invoke-gemini-bridge.ps1' 'Gemini Codex bridge'
  Test-File 'tools/request-gemini-review.ps1' 'ChatGPT Gemini review helper'
  Test-File 'GEMINI_CODEX_BRIDGE_TEST.cmd' 'Gemini Codex bridge launcher'
  Test-File 'docs/drafts/.gitkeep' 'ChatGPT draft directory marker'
  Test-File 'docs/gemini_reviews/.gitkeep' 'Gemini review directory marker'

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
  $memoryPath = Join-Path $Root 'data/development_memory.json'
  $memory = Read-JsonFile $memoryPath
  if ($memory) {
    if ($memory.schema -ne 'pongdang_development_memory') {
      Add-Err "Development memory schema mismatch: $($memory.schema)"
    }
    if (!$memory.mustRead -or $memory.mustRead.Count -lt 4) {
      Add-Err "Development memory must include mustRead files."
    }
    if (!$memory.invariants -or $memory.invariants.Count -lt 4) {
      Add-Err "Development memory must include invariants."
    }
  }
  $ecosystemPath = Join-Path $Root 'data/gonjiam_ecosystem_assets_v1.json'
  if (Test-Path -LiteralPath $ecosystemPath) {
    $ecosystem = Read-JsonFile $ecosystemPath
    if ($ecosystem) {
      if (!$ecosystem.zones -or $ecosystem.zones.Count -lt 5) {
        Add-Err "Gonjiam ecosystem assets must define at least five zones."
      }
      if (!$ecosystem.realSpecies -or $ecosystem.realSpecies.Count -lt 1) {
        Add-Err "Gonjiam ecosystem assets must include candidate real species."
      }
      if ([string]::IsNullOrWhiteSpace([string]$ecosystem.principle)) {
        Add-Warn "Gonjiam ecosystem assets should preserve a non-confirmation principle."
      }
    }
  }
  $exchangePath = Join-Path $Root 'data/exchange_channels.json'
  if (Test-Path -LiteralPath $exchangePath) {
    $exchange = Read-JsonFile $exchangePath
    if ($exchange) {
      if ($exchange.schema -ne 'pongdang_exchange_channels') {
        Add-Err "Exchange channels schema mismatch: $($exchange.schema)"
      }
      if (!$exchange.channels -or $exchange.channels.Count -lt 5) {
        Add-Err "Exchange channels must define at least five communication channels."
      }
    }
  }
  $watchPath = Join-Path $Root 'data/technology_watchlist.json'
  if (Test-Path -LiteralPath $watchPath) {
    $watch = Read-JsonFile $watchPath
    if ($watch) {
      if ($watch.schema -ne 'pongdang_technology_watchlist') {
        Add-Err "Technology watchlist schema mismatch: $($watch.schema)"
      }
      if (!$watch.candidates -or $watch.candidates.Count -lt 3) {
        Add-Err "Technology watchlist must include at least three candidates."
      }
    }
  }
  $aiMatrixPath = Join-Path $Root 'data/ai_collaboration_matrix.json'
  if (Test-Path -LiteralPath $aiMatrixPath) {
    $aiMatrix = Read-JsonFile $aiMatrixPath
    if ($aiMatrix) {
      if ($aiMatrix.schema -ne 'pongdang_ai_collaboration_matrix') {
        Add-Err "AI collaboration matrix schema mismatch: $($aiMatrix.schema)"
      }
      foreach ($participant in @('chatgpt', 'gemini', 'codex')) {
        if (!$aiMatrix.participants.$participant) {
          Add-Err "AI collaboration matrix missing participant: $participant"
        }
      }
      if (!$aiMatrix.securityRules -or $aiMatrix.securityRules.Count -lt 4) {
        Add-Err "AI collaboration matrix must include security rules."
      }
    }
  }
  $aiExpansionPath = Join-Path $Root 'data/ai_expansion_state.json'
  if (Test-Path -LiteralPath $aiExpansionPath) {
    $aiExpansion = Read-JsonFile $aiExpansionPath
    if ($aiExpansion) {
      if ($aiExpansion.schema -ne 'pongdang_ai_expansion_state') {
        Add-Err "AI expansion state schema mismatch: $($aiExpansion.schema)"
      }
      if (!$aiExpansion.loop -or $aiExpansion.loop.Count -lt 4) {
        Add-Err "AI expansion state must define the full handoff loop."
      }
      foreach ($actor in @('chatgpt', 'gemini', 'codex', 'github')) {
        $found = $false
        foreach ($step in $aiExpansion.loop) {
          if ($step.actor -eq $actor) { $found = $true }
        }
        if (!$found) {
          Add-Err "AI expansion state missing actor in loop: $actor"
        }
      }
      if (!$aiExpansion.promotionLevels -or $aiExpansion.promotionLevels.Count -lt 5) {
        Add-Err "AI expansion state must include promotion levels."
      }
    }
  }
  $piramiSwim = Join-Path $Root 'assets/fish/pirami/swim.svg'
  $piramiCard = Join-Path $Root 'assets/fish/pirami/card.svg'
  if ((Test-Path -LiteralPath $piramiSwim) -or (Test-Path -LiteralPath $piramiCard)) {
    if (!(Test-Path -LiteralPath $piramiSwim)) {
      Add-Warn "Pirami card.svg exists but swim.svg is missing; keep pirami out of runtime data."
    } elseif (!(Test-Path -LiteralPath $piramiCard)) {
      Add-Warn "Pirami swim.svg exists; keep it as candidate asset until card.svg and data mapping are ready."
    } else {
      Add-Warn "Pirami swim.svg and card.svg exist; keep them as candidate assets until species data mapping and runtime behavior are ready."
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
