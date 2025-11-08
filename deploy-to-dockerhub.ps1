# Script để build và push images lên Docker Hub
# Chạy script này trên máy local trước khi deploy

Write-Host "=== Food Delivery - Build & Push to Docker Hub ===" -ForegroundColor Cyan

# Yêu cầu nhập Docker Hub username
$DOCKERHUB_USERNAME = Read-Host "Enter your Docker Hub username"

if ([string]::IsNullOrEmpty($DOCKERHUB_USERNAME)) {
    Write-Host "Error: Docker Hub username is required!" -ForegroundColor Red
    exit 1
}

Write-Host "`nLogging in to Docker Hub..." -ForegroundColor Yellow
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker login failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Building Images ===" -ForegroundColor Green

# Build Backend
Write-Host "`n[1/4] Building Backend..." -ForegroundColor Yellow
docker build -t ${DOCKERHUB_USERNAME}/food-delivery-backend:latest ./backend
if ($LASTEXITCODE -ne 0) { exit 1 }

# Build Frontend
Write-Host "`n[2/4] Building Frontend..." -ForegroundColor Yellow
docker build -t ${DOCKERHUB_USERNAME}/food-delivery-frontend:latest ./frontend
if ($LASTEXITCODE -ne 0) { exit 1 }

# Build Admin
Write-Host "`n[3/4] Building Admin..." -ForegroundColor Yellow
docker build -t ${DOCKERHUB_USERNAME}/food-delivery-admin:latest ./admin
if ($LASTEXITCODE -ne 0) { exit 1 }

# Build Restaurant
Write-Host "`n[4/4] Building Restaurant..." -ForegroundColor Yellow
docker build -t ${DOCKERHUB_USERNAME}/food-delivery-restaurant:latest ./restaurant
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n=== Pushing Images to Docker Hub ===" -ForegroundColor Green

# Push Backend
Write-Host "`n[1/4] Pushing Backend..." -ForegroundColor Yellow
docker push ${DOCKERHUB_USERNAME}/food-delivery-backend:latest
if ($LASTEXITCODE -ne 0) { exit 1 }

# Push Frontend
Write-Host "`n[2/4] Pushing Frontend..." -ForegroundColor Yellow
docker push ${DOCKERHUB_USERNAME}/food-delivery-frontend:latest
if ($LASTEXITCODE -ne 0) { exit 1 }

# Push Admin
Write-Host "`n[3/4] Pushing Admin..." -ForegroundColor Yellow
docker push ${DOCKERHUB_USERNAME}/food-delivery-admin:latest
if ($LASTEXITCODE -ne 0) { exit 1 }

# Push Restaurant
Write-Host "`n[4/4] Pushing Restaurant..." -ForegroundColor Yellow
docker push ${DOCKERHUB_USERNAME}/food-delivery-restaurant:latest
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n=== Success! ===" -ForegroundColor Green
Write-Host "All images have been pushed to Docker Hub" -ForegroundColor Green
Write-Host "`nYour images:" -ForegroundColor Cyan
Write-Host "  - ${DOCKERHUB_USERNAME}/food-delivery-backend:latest"
Write-Host "  - ${DOCKERHUB_USERNAME}/food-delivery-frontend:latest"
Write-Host "  - ${DOCKERHUB_USERNAME}/food-delivery-admin:latest"
Write-Host "  - ${DOCKERHUB_USERNAME}/food-delivery-restaurant:latest"
Write-Host "`nNext: Upload docker-compose.production.yml and .env.production to your server" -ForegroundColor Yellow
