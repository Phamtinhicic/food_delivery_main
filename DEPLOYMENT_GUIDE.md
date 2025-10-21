# Continuous Deployment (CD) Setup Guide

## 🚀 Tổng quan

Workflow CI/CD của dự án bao gồm 3 giai đoạn chính:

1. **Build & Test** - Kiểm tra code và chạy tests
2. **Docker Build & Push** - Build và đẩy images lên Docker Hub
3. **Deploy** - Deploy lên production environment

## 📋 Yêu cầu

### 1. Docker Hub Account

Tạo account tại: https://hub.docker.com/

### 2. GitHub Secrets

Cần thiết lập các secrets sau trong GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

#### Bắt buộc:

- `DOCKERHUB_USERNAME` - Username Docker Hub của bạn
- `DOCKERHUB_TOKEN` - Access token từ Docker Hub

#### Tùy chọn (tùy nền tảng deploy):

- `RAILWAY_TOKEN` - Cho Railway.app
- `RENDER_DEPLOY_HOOK` - Cho Render.com
- `DIGITALOCEAN_ACCESS_TOKEN` - Cho DigitalOcean
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` - Cho AWS

## 🔧 Cấu hình Docker Hub

### Bước 1: Tạo Access Token

1. Đăng nhập vào Docker Hub
2. Vào **Account Settings → Security**
3. Click **New Access Token**
4. Đặt tên: `github-actions-food-delivery`
5. Chọn quyền: **Read, Write, Delete**
6. Copy token (chỉ hiển thị 1 lần!)

### Bước 2: Thêm Secrets vào GitHub

```bash
# Vào repository GitHub
Settings → Secrets and variables → Actions

# Thêm secrets:
DOCKERHUB_USERNAME=your_dockerhub_username
DOCKERHUB_TOKEN=your_access_token_here
```

## 🐳 Docker Images

Sau khi CD chạy thành công, các images sẽ có tại:

```
your_username/food-delivery-backend:latest
your_username/food-delivery-frontend:latest
your_username/food-delivery-admin:latest
your_username/food-delivery-restaurant:latest
```

### Pull và chạy images:

```bash
# Pull images
docker pull your_username/food-delivery-backend:latest
docker pull your_username/food-delivery-frontend:latest
docker pull your_username/food-delivery-admin:latest
docker pull your_username/food-delivery-restaurant:latest

# Hoặc dùng docker-compose (cập nhật image names trong docker-compose.yml)
docker-compose pull
docker-compose up -d
```

## 🌐 Deploy lên các nền tảng

### Option 1: Railway.app (Khuyến nghị - Miễn phí $5/tháng)

1. **Tạo account tại**: https://railway.app/
2. **Link GitHub repository**
3. **Tạo service cho mỗi container**:
   - Backend (port 4000)
   - Frontend (port 80)
   - Admin (port 80)
   - Restaurant (port 80)
   - MongoDB database
4. **Set environment variables** cho mỗi service
5. **Deploy tự động** khi push lên main

**Lấy Railway Token:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Get token
railway whoami
```

**Thêm vào GitHub Secrets:**
```
RAILWAY_TOKEN=your_railway_token
```

**Uncomment trong workflow:**
```yaml
# For Railway.app
- name: Deploy to Railway
  uses: berviantoleo/railway-deploy@main
  with:
    railway_token: ${{ secrets.RAILWAY_TOKEN }}
    service: food-delivery
```

### Option 2: Render.com (Miễn phí với limitations)

1. **Tạo account tại**: https://render.com/
2. **Create Web Services** cho mỗi app:
   - Backend: Node.js, port 4000
   - Frontend/Admin/Restaurant: Static Site hoặc Docker
3. **Create Database**: MongoDB
4. **Set environment variables**
5. **Get Deploy Hook URL**: 
   - Settings → Deploy Hook → Copy URL

**Thêm vào GitHub Secrets:**
```
RENDER_DEPLOY_HOOK=your_render_webhook_url
```

**Uncomment trong workflow:**
```yaml
# For Render.com
- name: Deploy to Render
  run: |
    curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### Option 3: DigitalOcean App Platform

1. **Tạo account tại**: https://digitalocean.com/
2. **Create App** từ Docker Hub images
3. **Configure services** (Backend, Frontend, Admin, Restaurant)
4. **Add MongoDB database**
5. **Get API Token**: API → Tokens → Generate New Token

**Thêm vào GitHub Secrets:**
```
DIGITALOCEAN_ACCESS_TOKEN=your_do_token
```

**Uncomment trong workflow:**
```yaml
# For DigitalOcean
- name: Deploy to DigitalOcean
  uses: digitalocean/app_action@v1.1.4
  with:
    app_name: food-delivery
    token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
```

### Option 4: AWS ECS (Production-grade)

**Setup AWS ECS:**

1. Create ECR repositories
2. Create ECS Cluster
3. Create Task Definitions
4. Create Services
5. Setup Load Balancer
6. Configure Auto Scaling

**Get credentials:**
```bash
AWS Console → IAM → Users → Create User
Attach Policy: AmazonECS_FullAccess
Create Access Key
```

**Thêm vào GitHub Secrets:**
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

**Uncomment trong workflow:**
```yaml
# For AWS ECS
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy to ECS
  run: |
    aws ecs update-service --cluster food-delivery --service backend --force-new-deployment
```

## 📊 Workflow Triggers

### Tự động chạy khi:

- ✅ Push code lên branch `main`
- ✅ Tạo Pull Request vào `main`

### Các job sẽ chạy:

1. **build** - Build và test 4 services (backend, frontend, admin, restaurant)
2. **docker-build-push** - Build Docker images và push lên Docker Hub (chỉ khi push vào main)
3. **deploy** - Deploy lên production (chỉ khi push vào main)

## 🔍 Monitoring

### Xem logs:

```bash
# GitHub Actions
Repository → Actions → Click vào workflow run

# Docker Hub
hub.docker.com → Repositories → food-delivery-* → Tags

# Railway
railway.app → Project → Service → Logs

# Render
render.com → Dashboard → Service → Logs
```

## 🛠️ Troubleshooting

### Lỗi: Docker login failed

**Nguyên nhân:** Token không đúng hoặc đã hết hạn

**Giải pháp:**
```bash
# Tạo token mới tại Docker Hub
# Cập nhật DOCKERHUB_TOKEN trong GitHub Secrets
```

### Lỗi: Image push denied

**Nguyên nhân:** Không có quyền write trên Docker Hub

**Giải pháp:**
```bash
# Kiểm tra token có quyền Write
# Hoặc tạo repository trước trên Docker Hub
```

### Lỗi: Deployment failed

**Nguyên nhân:** Thiếu secrets hoặc cấu hình sai

**Giải pháp:**
```bash
# Kiểm tra tất cả secrets đã được set
# Kiểm tra logs trong GitHub Actions
# Verify credentials của platform
```

## 📝 Environment Variables cần thiết

### Backend (.env)

```env
PORT=4000
MONGO_URI=mongodb://mongodb:27017/FoodDelivery
JWT_SECRET=your_secret_key_here
SALT=10
STRIPE_SECRET_KEY=your_stripe_key
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend/Admin/Restaurant

```env
VITE_API_URL=https://your-backend-url.com
```

## 🔐 Security Best Practices

1. ✅ **Không commit secrets** vào code
2. ✅ **Sử dụng GitHub Secrets** cho sensitive data
3. ✅ **Rotate tokens định kỳ** (3-6 tháng)
4. ✅ **Limit token permissions** (chỉ những gì cần thiết)
5. ✅ **Enable 2FA** trên Docker Hub và hosting platforms
6. ✅ **Review logs thường xuyên**

## 📈 Optimization

### Giảm build time:

1. **Docker layer caching**: Đã enabled trong workflow
2. **npm cache**: Đã enabled trong workflow
3. **Parallel builds**: Matrix strategy cho 4 services

### Giảm image size:

1. Sử dụng multi-stage builds
2. Optimize dependencies (production only)
3. Remove dev files

## 🎯 Next Steps

1. ✅ Setup Docker Hub secrets
2. ✅ Push code để trigger CD pipeline
3. ✅ Verify images on Docker Hub
4. ⬜ Chọn hosting platform
5. ⬜ Setup platform secrets
6. ⬜ Uncomment deploy section trong workflow
7. ⬜ Deploy to production!

## 📞 Support

Nếu gặp vấn đề:

1. Check GitHub Actions logs
2. Check Docker Hub for images
3. Review platform-specific logs
4. Open issue on GitHub

---

**Happy Deploying! 🚀**
