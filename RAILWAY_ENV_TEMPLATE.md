# Railway Environment Variables Template
# Copy và paste vào Railway Dashboard cho từng service

# ===========================================
# BACKEND SERVICE VARIABLES
# ===========================================
# Service Settings:
# - Service Name: backend
# - Root Directory: backend
# - Watch Paths: backend/**
# - Health Check Path: / (hoặc /health)
# - Health Check Interval: 0 (disable để tránh cancel deployment)

MONGO_URI=mongodb://mongo:PASSWORD@metro.proxy.rlwy.net:PORT/FoodDelivery?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-please-123456789
SALT=10
PORT=${{PORT}}
NODE_ENV=production
DEV_PAYMENT=true
STRIPE_SECRET_KEY=

# Sau khi add MongoDB database, thay thế:
# - PASSWORD: password từ MongoDB connection string
# - PORT: port từ MongoDB TCP Proxy connection string
# Ví dụ: mongodb://mongo:aJGHxRDApSpoCYjkHuugbvvSCGSyxhNH@metro.proxy.rlwy.net:27010/FoodDelivery?authSource=admin


# ===========================================
# FRONTEND SERVICE VARIABLES
# ===========================================
# Service Settings:
# - Service Name: frontend
# - Root Directory: frontend
# - Watch Paths: frontend/**

VITE_API_URL=https://backend-production-xxxx.up.railway.app
NODE_ENV=production

# Thay thế xxxx bằng domain thực của Backend service
# Lấy từ: Backend service → Settings → Networking → Public URL


# ===========================================
# ADMIN SERVICE VARIABLES
# ===========================================
# Service Settings:
# - Service Name: admin
# - Root Directory: admin
# - Watch Paths: admin/**

VITE_API_URL=https://backend-production-xxxx.up.railway.app
NODE_ENV=production

# Sử dụng CÙNG Backend URL như Frontend


# ===========================================
# RESTAURANT SERVICE VARIABLES
# ===========================================
# Service Settings:
# - Service Name: restaurant
# - Root Directory: restaurant
# - Watch Paths: restaurant/**

VITE_API_URL=https://backend-production-xxxx.up.railway.app
NODE_ENV=production

# Sử dụng CÙNG Backend URL như Frontend


# ===========================================
# DEPLOYMENT ORDER (Quan trọng!)
# ===========================================
# 1. Add MongoDB Database TRƯỚC
# 2. Deploy Backend với MongoDB URI
# 3. Lấy Backend URL sau khi deploy xong
# 4. Deploy Frontend/Admin/Restaurant với Backend URL

# ===========================================
# MONGODB SETUP NOTES
# ===========================================
# Trong Railway Dashboard:
# 1. Click "+ New" → "Database" → "Add MongoDB"
# 2. Đợi MongoDB start (1-2 phút)
# 3. Click MongoDB service → "Connect" tab
# 4. Copy "TCP Proxy Connection String"
# 5. Dán vào MONGO_URI của Backend service
# 6. Deploy Backend

# ===========================================
# TESTING AFTER DEPLOYMENT
# ===========================================
# Backend health check:
# curl https://backend-production-xxxx.up.railway.app/
# Expected: "API Working"

# Frontend test:
# Open https://frontend-production-xxxx.up.railway.app
# Expected: Website loads, can browse food items

# Admin test:
# Open https://admin-production-xxxx.up.railway.app
# Expected: Login page appears

# Restaurant test:
# Open https://restaurant-production-xxxx.up.railway.app
# Expected: Login page appears
