# Hướng dẫn sử dụng Docker sau khi CI/CD thành công

## Cách 1: Chạy tất cả với Docker Compose (Khuyên dùng)

### Bước 1: Chuẩn bị môi trường

```powershell
# Di chuyển vào thư mục dự án
cd c:\Users\Beetinh\food_delivery_main

# Tạo file .env từ template (nếu chưa có)
copy .env.example .env

# Mở .env và sửa các giá trị:
notepad .env
```

**Trong file `.env`, sửa:**
```env
JWT_SECRET=random-secret-key-change-this-in-production
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
```

### Bước 2: Khởi động Docker Desktop

**QUAN TRỌNG:** Phải bật Docker Desktop trước!
- Tìm "Docker Desktop" trong Start Menu
- Chạy và đợi cho đến khi thấy icon Docker Desktop màu xanh

### Bước 3: Chạy tất cả services

```powershell
# Build và chạy tất cả (lần đầu sẽ lâu ~5-10 phút)
docker-compose up --build

# HOẶC chạy ở chế độ background (không block terminal)
docker-compose up -d --build
```

### Bước 4: Truy cập ứng dụng

Sau khi khởi động thành công, mở trình duyệt:

- 🛒 **Customer (Khách hàng):** http://localhost:5174
- 🛠️ **Admin (Quản trị):** http://localhost:5175
- 🍽️ **Restaurant (Nhà hàng):** http://localhost:5176
- 🔧 **Backend API:** http://localhost:4000

### Bước 5: Xem logs

```powershell
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của 1 service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Bước 6: Dừng services

```powershell
# Dừng tất cả (giữ data)
docker-compose down

# Dừng và XÓA data (reset database)
docker-compose down -v
```

---

## Cách 2: Chạy từng service riêng lẻ

Nếu chỉ muốn test 1 service:

### Backend
```powershell
cd backend
docker build -t food_delivery_backend .
docker run -p 4000:4000 --env-file ../.env food_delivery_backend
```

### Frontend (Customer)
```powershell
cd frontend
docker build -t food_delivery_frontend .
docker run -p 5174:80 food_delivery_frontend
```

### Admin
```powershell
cd admin
docker build -t food_delivery_admin .
docker run -p 5175:80 food_delivery_admin
```

### Restaurant
```powershell
cd restaurant
docker build -t food_delivery_restaurant .
docker run -p 5176:80 food_delivery_restaurant
```

---

## Troubleshooting

### Lỗi "Cannot connect to Docker daemon"
- ✅ Mở Docker Desktop và đợi nó khởi động hoàn toàn
- ✅ Kiểm tra: `docker --version`

### Lỗi "port already allocated"
- ✅ Port đang được dùng bởi process khác
- ✅ Dừng backend/frontend đang chạy bằng npm
- ✅ Hoặc đổi port trong `docker-compose.yml`

### Lỗi "npm ci failed"
- ✅ Xóa `node_modules` trong các thư mục
- ✅ Rebuild: `docker-compose build --no-cache`

### Reset hoàn toàn
```powershell
# Dừng tất cả
docker-compose down -v

# Xóa images cũ
docker image prune -a

# Build lại từ đầu
docker-compose up --build
```

---

## CI/CD Flow (Tự động)

Khi bạn push code lên GitHub:

1. ✅ GitHub Actions tự động build Docker images
2. ✅ Nếu build thành công → images sẵn sàng deploy
3. 🔄 (Tương lai) Auto-deploy lên server production

**Để enable auto-deploy:**
- Thêm Docker Hub credentials vào GitHub Secrets
- Enable job `publish` trong workflow
- Mỗi lần push → images được push lên Docker Hub
- Server production pull images mới và restart

---

## Khuyến nghị

**Để development:**
```powershell
# Chạy backend + MongoDB bằng Docker
docker-compose up -d mongodb backend

# Chạy frontend bằng npm (hot reload)
cd frontend
npm run dev
```

**Để production:**
```powershell
# Chạy tất cả bằng Docker
docker-compose up -d
```
