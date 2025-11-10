# Railway Deployment Setup Guide

## 🚀 Bước 1: Tạo Railway Project mới

### 1.1. Truy cập Railway Dashboard
- Vào https://railway.app/
- Login với GitHub account của bạn
- Click "**New Project**"

### 1.2. Chọn "Deploy from GitHub repo"
- Chọn repository: **Phamtinhicic/food_delivery_main**
- Railway sẽ tự động detect các service

---

## 📦 Bước 2: Add MongoDB Database

### 2.1. Trong Railway Project
- Click "**+ New**" → "**Database**" → "**Add MongoDB**"
- Railway sẽ tự động tạo MongoDB instance
- Chờ MongoDB khởi động (khoảng 1-2 phút)

### 2.2. Lấy MongoDB Connection String
- Click vào MongoDB service
- Tab "**Connect**"
- Copy **MongoDB Connection URL** (dạng: `mongodb://mongo:...@...railway.app:...`)
- Copy **TCP Proxy Connection String** (dạng: `mongodb://mongo:...@...proxy.rlwy.net:...`)

**Lưu 2 strings này lại!**

---

## 🔧 Bước 3: Setup Backend Service

### 3.1. Thêm Backend Service
- Click "**+ New**" → "**GitHub Repo**" 
- Chọn **food_delivery_main** repository
- Railway sẽ tự detect Dockerfile

### 3.2. Configure Backend Service

#### Settings Tab:
- **Service Name**: `backend`
- **Root Directory**: `backend`
- **Watch Paths**: `backend/**`

#### Variables Tab - Add các biến sau:

```bash
# MongoDB
MONGO_URI=<your_mongodb_tcp_proxy_connection_string>

# JWT & Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
SALT=10

# Server
PORT=${{PORT}}
NODE_ENV=production

# Stripe (Development mode)
DEV_PAYMENT=true
STRIPE_SECRET_KEY=<your_stripe_secret_key_or_leave_empty_for_dev>
```

#### Networking Tab:
- **Public Networking**: ✅ Enabled
- Railway sẽ tự generate domain: `https://backend-production-xxxx.up.railway.app`
- **Copy domain này để dùng cho frontend services!**

#### Deploy Settings:
- **Health Check Path**: `/` hoặc `/health`
- **Health Check Timeout**: `300` (5 minutes)
- **Health Check Interval**: `0` (disable auto health check - tránh cancel deployment)

### 3.3. Deploy Backend
- Click "**Deploy**"
- Chờ build xong (2-5 phút)
- Check logs để đảm bảo "Server is running on port..."

---

## 🎨 Bước 4: Setup Frontend Service

### 4.1. Thêm Frontend Service
- Click "**+ New**" → "**GitHub Repo**"
- Chọn **food_delivery_main** repository

### 4.2. Configure Frontend Service

#### Settings Tab:
- **Service Name**: `frontend`
- **Root Directory**: `frontend`
- **Watch Paths**: `frontend/**`

#### Variables Tab:

```bash
# Backend API URL (use YOUR backend domain from step 3.2)
VITE_API_URL=https://backend-production-xxxx.up.railway.app

# Production
NODE_ENV=production
```

#### Networking Tab:
- **Public Networking**: ✅ Enabled
- Domain: `https://frontend-production-xxxx.up.railway.app`

### 4.3. Deploy Frontend
- Click "**Deploy**"

---

## 👨‍💼 Bước 5: Setup Admin Service

### 5.1. Thêm Admin Service
- Click "**+ New**" → "**GitHub Repo**"
- Chọn **food_delivery_main** repository

### 5.2. Configure Admin Service

#### Settings Tab:
- **Service Name**: `admin`
- **Root Directory**: `admin`
- **Watch Paths**: `admin/**`

#### Variables Tab:

```bash
# Backend API URL (same as frontend)
VITE_API_URL=https://backend-production-xxxx.up.railway.app

NODE_ENV=production
```

#### Networking Tab:
- **Public Networking**: ✅ Enabled
- Domain: `https://admin-production-xxxx.up.railway.app`

### 5.3. Deploy Admin
- Click "**Deploy**"

---

## 🍴 Bước 6: Setup Restaurant Service

### 6.1. Thêm Restaurant Service
- Click "**+ New**" → "**GitHub Repo**"
- Chọn **food_delivery_main** repository

### 6.2. Configure Restaurant Service

#### Settings Tab:
- **Service Name**: `restaurant`
- **Root Directory**: `restaurant`
- **Watch Paths**: `restaurant/**`

#### Variables Tab:

```bash
# Backend API URL (same as others)
VITE_API_URL=https://backend-production-xxxx.up.railway.app

NODE_ENV=production
```

#### Networking Tab:
- **Public Networking**: ✅ Enabled
- Domain: `https://restaurant-production-xxxx.up.railway.app`

### 6.3. Deploy Restaurant
- Click "**Deploy**"

---

## ✅ Bước 7: Verify Deployment

### 7.1. Check Backend
```bash
# Test API
curl https://backend-production-xxxx.up.railway.app/

# Should return: "API Working"
```

### 7.2. Check Frontend Services
- Open each URL in browser:
  - Frontend: `https://frontend-production-xxxx.up.railway.app`
  - Admin: `https://admin-production-xxxx.up.railway.app`
  - Restaurant: `https://restaurant-production-xxxx.up.railway.app`

### 7.3. Check MongoDB Connection
- Backend logs should show: "DB Connected"
- No error về MongoDB connection

---

## 🔄 Bước 8: Import Sample Data (Optional)

### 8.1. Connect to MongoDB via Railway CLI

```bash
# Link to Railway project
railway link

# Connect to backend service
railway run --service backend node createAdmin.js
```

### 8.2. Create Admin User

```bash
cd backend
railway run --service backend node scripts/createAdmin.js
```

Nhập thông tin:
- Email: `admin@fooddelivery.com`
- Password: `Admin@123456`
- Name: `Admin User`

---

## 📝 Tóm tắt Environment Variables

### Backend Service:
```env
MONGO_URI=<railway_mongodb_tcp_proxy_url>
JWT_SECRET=your-secret-key
SALT=10
PORT=${{PORT}}
NODE_ENV=production
DEV_PAYMENT=true
```

### Frontend/Admin/Restaurant Services:
```env
VITE_API_URL=https://backend-production-xxxx.up.railway.app
NODE_ENV=production
```

---

## 🛠️ Troubleshooting

### ❌ Backend deployment keeps canceling
**Solution**: 
- Go to Backend service → Settings → Deploy
- Set **Health Check Interval** to `0` (disable)
- Or change **Health Check Path** to `/`

### ❌ Frontend shows "Network Error" 
**Solution**:
- Check `VITE_API_URL` variable in frontend/admin/restaurant services
- Must match backend domain EXACTLY
- Include `https://` prefix

### ❌ MongoDB connection failed
**Solution**:
- Use **TCP Proxy** connection string (metro.proxy.rlwy.net)
- NOT the internal Railway URL
- Format: `mongodb://mongo:password@metro.proxy.rlwy.net:PORT/FoodDelivery?authSource=admin`

### ❌ Docker rate limit (429 Too Many Requests)
**Solution**:
- Login to Docker Hub: `docker login`
- Or wait 6 hours for rate limit reset
- Or upgrade Docker Hub account

---

## 🎯 Deployment Checklist

- [ ] Created Railway project
- [ ] Added MongoDB database
- [ ] Configured Backend service with all env vars
- [ ] Deployed Backend successfully
- [ ] Copied Backend URL
- [ ] Configured Frontend service with Backend URL
- [ ] Deployed Frontend successfully
- [ ] Configured Admin service with Backend URL
- [ ] Deployed Admin successfully
- [ ] Configured Restaurant service with Backend URL
- [ ] Deployed Restaurant successfully
- [ ] Tested all services in browser
- [ ] Created admin user
- [ ] Verified MongoDB connection

---

## 📞 Railway CLI Commands

```bash
# Link to project
railway link

# Check status
railway status

# View logs
railway logs --service backend

# Run command in service
railway run --service backend <command>

# Deploy manually
railway up --service backend
```

---

## 🔗 Important URLs to Save

After deployment, lưu lại các URLs:

1. **Backend**: `https://backend-production-xxxx.up.railway.app`
2. **Frontend**: `https://frontend-production-xxxx.up.railway.app`
3. **Admin**: `https://admin-production-xxxx.up.railway.app`
4. **Restaurant**: `https://restaurant-production-xxxx.up.railway.app`
5. **MongoDB TCP Proxy**: `mongodb://mongo:...@metro.proxy.rlwy.net:...`

---

## 🚀 Next Steps

1. Test đầy đủ các chức năng:
   - Đăng ký/đăng nhập user
   - Thêm món ăn (admin)
   - Đặt hàng (frontend)
   - Xem đơn hàng (restaurant)

2. Setup custom domain (optional):
   - Mua domain
   - Add CNAME record
   - Configure trong Railway

3. Setup monitoring:
   - Enable Railway alerts
   - Check logs regularly

4. Backup MongoDB:
   - Export data định kỳ
   - Setup automated backups

---

**🎉 Chúc bạn deploy thành công!**
