param(
  [string]$RepoUrl = "",
  [string]$CommitMessage = "Hoan thien he thong dat lich kham benh truc tuyen"
)

$ErrorActionPreference = "Stop"

function Stop-WithMessage {
  param([string]$Message)
  Write-Host ""
  Write-Host "LOI: $Message" -ForegroundColor Red
  exit 1
}

function Run-Git {
  param([string[]]$ArgsList)
  Write-Host "git $($ArgsList -join ' ')" -ForegroundColor Cyan
  & git @ArgsList
  if ($LASTEXITCODE -ne 0) {
    Stop-WithMessage "Lenh git that bai: git $($ArgsList -join ' ')"
  }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Stop-WithMessage "Chua cai Git. Hay cai Git truoc khi chay script."
}

Set-Location $PSScriptRoot
Write-Host "Dang chay tai thu muc: $PSScriptRoot" -ForegroundColor Green

if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
  Write-Host "Nhap URL GitHub repository cho web bac si." -ForegroundColor Yellow
  Write-Host "Vi du: https://github.com/ten-tai-khoan/web-bac-si.git"
  $RepoUrl = Read-Host "Repo URL"
}

if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
  Stop-WithMessage "Ban chua nhap URL repository."
}

if (-not (Test-Path ".git")) {
  Run-Git @("init")
}

Run-Git @("add", ".")

$status = & git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
  Write-Host "Khong co thay doi moi de commit." -ForegroundColor Yellow
} else {
  Run-Git @("commit", "-m", $CommitMessage)
}

$branch = (& git branch --show-current).Trim()
if ([string]::IsNullOrWhiteSpace($branch) -or $branch -ne "main") {
  Run-Git @("branch", "-M", "main")
}

$remotes = & git remote
if ($remotes -notcontains "origin") {
  Run-Git @("remote", "add", "origin", $RepoUrl)
} else {
  Run-Git @("remote", "set-url", "origin", $RepoUrl)
}

Run-Git @("push", "-u", "origin", "main")

Write-Host ""
Write-Host "Da day web bac si len GitHub thanh cong." -ForegroundColor Green
Write-Host "Repository: $RepoUrl"
