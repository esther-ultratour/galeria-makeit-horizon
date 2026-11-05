<#
  deploy.ps1 — Deploy da galeria Horizon (Make it) para o AWS S3.

  Uso:
    ./deploy.ps1             # sync completo + cache-control no HTML/JS
    ./deploy.ps1 -QuickHtml  # atualiza só index.html e inject.js (rápido)

  Pré-requisitos: AWS CLI instalado e credenciais (aws configure, regiao sa-east-1).
#>

param([switch]$QuickHtml)

$ErrorActionPreference = 'Stop'
$Bucket = 's3://skylineip/Tour Virtual/makeit/horizon/ferramentas/galeria'
$NoCache = 'no-cache,no-store,must-revalidate'

Set-Location -Path $PSScriptRoot

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  Write-Host 'ERRO: AWS CLI nao encontrado no PATH.' -ForegroundColor Red
  exit 1
}

function Copy-Html($file) {
  Write-Host "  -> $file" -ForegroundColor Cyan
  aws s3 cp $file "$Bucket/$file" --cache-control $NoCache
}

if (-not $QuickHtml) {
  # Sobe SO o que a galeria consome (fica de fora: _originais/, scripts, docs).
  aws s3 sync . "$Bucket/" `
    --exclude "*" `
    --include "index.html" --include "inject.js" `
    --include "assets/brand/*" --include "assets/fachada/*" --include "assets/areas-comuns/*" `
    --include "assets/apartamento/*" --include "assets/plantas/*" --include "assets/miniaturas/*" `
    --exclude "*Thumbs.db" `
    --delete
}

# HTML/JS com cache-control para o 3DVista nunca servir versao cacheada
Copy-Html 'index.html'
Copy-Html 'inject.js'

Write-Host 'Deploy concluido.' -ForegroundColor Green
Write-Host "Base: https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/makeit/horizon/ferramentas/galeria/" -ForegroundColor DarkGray
