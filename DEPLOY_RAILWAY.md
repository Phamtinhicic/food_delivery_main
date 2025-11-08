# 🚀 Deploy Food Delivery App lên Railway.app (FREE)

## 📋 Tổng quan

**Railway.app** là platform PaaS tốt nhất cho Docker apps với:
- ✅ **$5 credit FREE/tháng** (đủ cho small apps)
- ✅ **Không cần credit card** để bắt đầu
- ✅ **Deploy Docker trực tiếp**
- ✅ **MongoDB miễn phí**
- ✅ **Auto deploy từ GitHub**
- ✅ **Không sleep** (chạy 24/7)

---

## Part 1: Chuẩn bị Project

### Bước 1: Push code lên GitHub (nếu chưa có)

```powershell
# Khởi tạo git (nếu chưa có)
git init
git add .
git commit -m "Initial commit"

# Tạo repo trên GitHub: https://github.com/new
# Đặt tên: food-delivery-app

# Push lên GitHub
git remote add origin https://github.com/YOUR_USERNAME/food-delivery-app.git
git branch -M main
git push -u origin main
```

### Bước 2: Kiểm tra Dockerfile

Đảm bảo mỗi service có Dockerfile (đã có sẵn):
- ✅ `backend/Dockerfile`
- ✅ `frontend/Dockerfile`
- ✅ `admin/Dockerfile`
- ✅ `restaurant/Dockerfile`

---

## Part 2: Tạo tài khoản Railway

### Bước 1: Đăng ký Railway.app

1. Truy cập: https://railway.app
2. Click **"Login"**
3. Chọn **"Login with GitHub"**
4. Authorize Railway truy cập GitHub của bạn
5. ✅ Hoàn tất! Bạn có **$5 credit FREE**

### Bước 2: Tạo Project mới

1. Click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Chọn repository: `food-delivery-app`
4. Railway sẽ phát hiện services tự động

---

## Part 3: Deploy MongoDB

### Bước 1: Thêm MongoDB

1. Trong project Railway, click **"+ New"**
2. Chọn **"Database"** → **"Add MongoDB"**
3. Railway sẽ tạo MongoDB instance
4. ✅ MongoDB URL sẽ tự động có

### Bước 2: Lấy MongoDB Connection String

1. Click vào **MongoDB service**
2. Vào tab **"Variables"**
3. Copy biến: **`MONGO_URL`**
4. Hoặc copy từ **"Connect"** tab

Example:
```
mongodb://mongo:PASSWORD@containers.railway.app:PORT
```

---

## Part 4: Deploy Backend

### Bước 1: Tạo Backend Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Chọn repo: `food-delivery-app`
3. Railway sẽ hỏi **"Root Directory"**
4. Nhập: `backend`
5. Railway sẽ phát hiện Dockerfile và deploy

### Bước 2: Cấu hình Environment Variables

1. Click vào **Backend service**
2. Vào tab **"Variables"**
3. Thêm các biến sau:

```env
NODE_ENV=production
PORT=4000
MONGO_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=your_super_secret_jwt_key_change_this_xyz123
SALT=10
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
FRONTEND_URL=https://YOUR_FRONTEND_URL.railway.app
```

**⚠️ Lưu ý:**
- `${{MongoDB.MONGO_URL}}` - Railway tự động link với MongoDB
- `FRONTEND_URL` - Sẽ cập nhật sau khi deploy frontend

### Bước 3: Cấu hình Port

1. Vào tab **"Settings"**
2. Trong **"Networking"**:
   - **Port:** 4000
   - Enable **"Public Networking"**
3. Railway sẽ generate URL: `https://backend-production-xxxx.railway.app`

### Bước 4: Deploy

1. Click **"Deploy"** (hoặc Railway tự động deploy)
2. Xem logs trong tab **"Deployments"**
3. Đợi ~2-3 phút để build và deploy

✅ Backend đã live!

---

## Part 5: Deploy Frontend (Customer)

### Bước 1: Tạo Frontend Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Chọn repo: `food-delivery-app`
3. Root Directory: `frontend`

### Bước 2: Thêm Environment Variables

```env
VITE_API_URL=https://backend-production-xxxx.railway.app
```

**⚠️ Thay bằng Backend URL từ bước trước**

### Bước 3: Deploy

1. Railway tự động deploy
2. Sau khi xong, lấy URL: `https://frontend-production-xxxx.railway.app`

✅ Frontend đã live!

---

## Part 6: Deploy Admin Panel

### Bước 1: Tạo Admin Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Chọn repo: `food-delivery-app`
3. Root Directory: `admin`

### Bước 2: Thêm Environment Variables

```env
VITE_API_URL=https://backend-production-xxxx.railway.app
```

### Bước 3: Deploy

✅ Admin đã live tại: `https://admin-production-xxxx.railway.app`

---

## Part 7: Deploy Restaurant Panel

### Bước 1: Tạo Restaurant Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Chọn repo: `food-delivery-app`
3. Root Directory: `restaurant`

### Bước 2: Thêm Environment Variables

```env
VITE_API_URL=https://backend-production-xxxx.railway.app
```

### Bước 3: Deploy

✅ Restaurant đã live tại: `https://restaurant-production-xxxx.railway.app`

---

## Part 8: Cập nhật Backend CORS

### Bước 1: Cập nhật FRONTEND_URL trong Backend

1. Vào **Backend service** → **"Variables"**
2. Cập nhật `FRONTEND_URL`:

```env
FRONTEND_URL=https://frontend-production-xxxx.railway.app
```

3. Click **"Redeploy"** để áp dụng

---

## Part 9: Setup Custom Domain (Optional)

### Nếu bạn có domain riêng:

1. Click vào service (Frontend/Admin/Restaurant)
2. Vào tab **"Settings"** → **"Domains"**
3. Click **"Custom Domain"**
4. Nhập domain: `yourdomain.com`
5. Cấu hình DNS theo hướng dẫn của Railway

**DNS Records:**
```
Type: CNAME
Name: www (hoặc @)
Value: xxxx.railway.app
```

✅ Auto SSL/HTTPS miễn phí!

---

## Part 10: Tạo Admin Account

### Option 1: Từ Railway Dashboard

1. Click vào **Backend service**
2. Vào tab **"Deployments"**
3. Click **"View Logs"**
4. Tìm nút **"Terminal"** (shell icon)
5. Chạy lệnh:

```bash
node createAdmin.js
```

### Option 2: Từ Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run command
railway run node createAdmin.js
```

---

## Part 11: Quản lý và Monitoring

### Xem Logs

1. Click vào service
2. Vào tab **"Deployments"**
3. Click vào deployment hiện tại
4. Xem logs realtime

### Restart Service

1. Click vào service
2. Tab **"Settings"**
3. Click **"Restart"**

### Xem Metrics

1. Tab **"Metrics"**
2. Xem:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

### Check Credit Usage

1. Click **"Settings"** (góc dưới bên trái)
2. Vào **"Usage"**
3. Xem credit đã dùng và còn lại

---

## Part 12: Auto Deploy từ GitHub

Railway đã tự động setup **CI/CD**:

1. Mỗi khi bạn push code lên GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. Railway tự động:
   - Detect changes
   - Build lại Docker image
   - Deploy version mới
   - Không downtime!

✅ **Zero-downtime deployment!**

---

## Part 13: Backup MongoDB

### Option 1: Từ Railway Dashboard

1. Click vào **MongoDB service**
2. Tab **"Data"** → **"Backups"**
3. Click **"Create Backup"**

### Option 2: Manual Backup

```bash
# Install Railway CLI
railway login
railway link

# Export database
railway run mongodump --uri=$MONGO_URL --out=./backup

# Restore
railway run mongorestore --uri=$MONGO_URL ./backup
```

---

## Part 14: Scaling (Khi cần)

### Nếu app cần nhiều resource hơn:

1. Click service → **"Settings"**
2. Tab **"Resources"**
3. Tăng:
   - **Memory:** 512MB → 1GB → 2GB
   - **CPU:** Shared → Dedicated

**⚠️ Lưu ý:** Sẽ tốn thêm credit

### Horizontal Scaling

1. Tab **"Settings"** → **"Replicas"**
2. Tăng số lượng instances
3. Railway auto load balance

---

## Part 15: Environment Management

### Development vs Production

**Option 1: Branches**
```bash
# Create dev branch
git checkout -b development
git push origin development
```

Trong Railway:
1. Create new environment: **"Development"**
2. Link với branch `development`
3. Có thể có 2 môi trường:
   - **Production** (main branch)
   - **Development** (dev branch)

**Option 2: Separate Projects**
- Project 1: Food Delivery Dev
- Project 2: Food Delivery Prod

---

## Part 16: Troubleshooting

### Build Failed

**Check logs:**
1. Tab **"Deployments"** → Click failed deployment
2. Xem error message
3. Common issues:
   - Dockerfile syntax error
   - Missing dependencies
   - Wrong root directory

**Fix:**
```bash
# Test build locally
docker build -t test ./backend

# If success, push to GitHub
git push
```

### Service Not Responding

**Check:**
1. Tab **"Metrics"** - Xem CPU/Memory
2. Tab **"Logs"** - Xem error logs
3. Tab **"Settings"** - Verify PORT config

**Restart:**
```bash
Settings → Restart Service
```

### Database Connection Error

**Verify:**
1. MongoDB service đang running
2. MONGO_URI trong Backend variables đúng
3. Format: `${{MongoDB.MONGO_URL}}`

### Out of Credit

**Check usage:**
1. Settings → Usage → Xem credit còn lại
2. Nếu hết $5:
   - Add credit card để continue
   - Hoặc optimize app để giảm usage

---

## Part 17: Optimization Tips

### Giảm Credit Usage

**1. Optimize Docker Images**
```dockerfile
# Use multi-stage builds
FROM node:18-alpine AS builder
# ... build stage

FROM node:18-alpine
# ... runtime stage
```

**2. Enable Caching**
Railway tự động cache layers

**3. Sleep Unused Services**
Nếu không dùng Restaurant panel:
1. Settings → Sleep mode
2. Sẽ chỉ wake khi có request

**4. Monitor Usage**
- Check **"Usage"** tab thường xuyên
- Optimize services tốn nhiều resource nhất

---

## Part 18: URLs Summary

Sau khi deploy xong, bạn sẽ có:

```
📱 Customer App:
   https://frontend-production-xxxx.railway.app

👨‍💼 Admin Panel:
   https://admin-production-xxxx.railway.app

🍽️ Restaurant Panel:
   https://restaurant-production-xxxx.railway.app

🔌 Backend API:
   https://backend-production-xxxx.railway.app

📊 MongoDB:
   Internal (không public)
```

---

## 💰 Cost Estimation

### FREE Tier ($5 credit/month):

**Typical usage:**
```
Backend:        $1.50/month
Frontend:       $0.80/month
Admin:          $0.50/month
Restaurant:     $0.50/month
MongoDB:        $1.20/month
─────────────────────────────
Total:          ~$4.50/month
```

✅ **Đủ trong $5 credit!**

### Nếu vượt $5/month:

**Starter Plan: $5/month** (+ additional usage)
- All features
- No sleep
- Better support

---

## 🎯 Best Practices

### 1. Security
```env
# Use strong secrets
JWT_SECRET=use_random_64_character_string_here

# Stripe: Use test keys for dev, live keys for prod
STRIPE_SECRET_KEY=sk_test_... (dev)
STRIPE_SECRET_KEY=sk_live_... (prod)
```

### 2. Monitoring
- Check logs daily
- Monitor credit usage
- Set up health checks

### 3. Backups
- Backup MongoDB weekly
- Keep old backups
- Test restore process

### 4. Updates
```bash
# Regular updates
git pull
npm update
docker build
git push  # Auto deploy!
```

---

## 📊 Railway vs Local Development

| Feature | Local | Railway |
|---------|-------|---------|
| **Access** | localhost only | Public URL |
| **HTTPS** | ❌ | ✅ Auto |
| **Uptime** | When PC on | 24/7 |
| **Scaling** | ❌ | ✅ Easy |
| **Cost** | $0 | $5/month |
| **Speed** | Fast | Medium |
| **Team** | ❌ | ✅ Share URL |

---

## ✅ Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Railway account
- [ ] Deploy MongoDB
- [ ] Deploy Backend (with env vars)
- [ ] Deploy Frontend (with API URL)
- [ ] Deploy Admin (with API URL)
- [ ] Deploy Restaurant (with API URL)
- [ ] Update Backend FRONTEND_URL
- [ ] Test all services
- [ ] Create admin account
- [ ] Test ordering flow
- [ ] Setup custom domain (optional)
- [ ] Setup monitoring/alerts

---

## 🎉 Congratulations!

Food Delivery App của bạn đã live trên Railway.app!

### Next Steps:

1. **Test đầy đủ:**
   - Đăng ký customer account
   - Add food items (Admin)
   - Place orders
   - Test payment (Stripe test mode)

2. **Share with team:**
   - Send URLs to teammates
   - Get feedback

3. **Monitor:**
   - Check logs daily
   - Monitor credit usage
   - Optimize if needed

4. **Iterate:**
   - Push updates to GitHub
   - Railway auto deploy
   - Zero downtime!

---

## 📞 Support

### Railway Documentation:
- https://docs.railway.app

### Railway Discord:
- https://discord.gg/railway

### GitHub Issues:
- Create issue trong repo của bạn

---

## 🚀 Deployment Status

```
✅ Backend:     https://backend-production-xxxx.railway.app
✅ Frontend:    https://frontend-production-xxxx.railway.app
✅ Admin:       https://admin-production-xxxx.railway.app
✅ Restaurant:  https://restaurant-production-xxxx.railway.app
✅ MongoDB:     Connected
✅ SSL/HTTPS:   Auto enabled
✅ CI/CD:       Auto deploy from GitHub
```

**Status:** 🟢 All systems operational!

---

**Chúc mừng! App của bạn đã production-ready! 🎊**
