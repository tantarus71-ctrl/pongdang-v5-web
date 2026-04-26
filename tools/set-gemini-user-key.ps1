$ErrorActionPreference = 'Stop'

Write-Host "Gemini API key user setup"
Write-Host "Paste a NEW Gemini API key. The key will not be printed."
Write-Host "If an old key was posted in chat, revoke it before using a new one."
Write-Host "Important: pasted text may be invisible here. Paste once, then press Enter."
Write-Host ""

$secureKey = Read-Host "New GEMINI_API_KEY" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
try {
  $key = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
  if ($bstr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

if ([string]::IsNullOrWhiteSpace($key)) {
  Write-Host "No key entered. Nothing changed."
  exit 2
}

[Environment]::SetEnvironmentVariable('GEMINI_API_KEY', $key, 'User')
$env:GEMINI_API_KEY = $key

Write-Host ""
Write-Host "Saved GEMINI_API_KEY to the current Windows user environment."
Write-Host "Open a new PowerShell/Codex session if another process cannot see it immediately."
Write-Host "Checking configuration..."
& (Join-Path $PSScriptRoot 'check-gemini-config.ps1')
