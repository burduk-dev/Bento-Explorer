$ErrorActionPreference = 'Stop'
$exe = Join-Path $PSScriptRoot 'release\win-unpacked\Bento Explorer.exe'
if (-not (Test-Path $exe)) {
  Write-Error "Portable build not found. Run: npm run dist (or npm exec electron-builder -- --win dir)"
}
Start-Process -FilePath $exe -WorkingDirectory (Split-Path $exe)
