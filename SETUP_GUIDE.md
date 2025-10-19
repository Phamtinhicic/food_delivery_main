# 🚀 Hướng dẫn Cài đặt và Chạy Food Delivery System

## 📋 Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt với Docker (Khuyến nghị)](#cài-đặt-với-docker)
3. [Cài đặt thủ công](#cài-đặt-thủ-công)
4. [Giải quyết lỗi thường gặp](#giải-quyết-lỗi-thường-gặp)
5. [Quản lý Database](#quản-lý-database)

---

## 🔧 Yêu cầu hệ thống

### Phần mềm cần thiết:
- **Docker Desktop** (Khuyến nghị - dễ nhất)
  - Windows: Docker Desktop for Windows
  - Mac: Docker Desktop for Mac
  - Linux: Docker Engine + Docker Compose
  
- **HOẶC chạy thủ công:**
  - Node.js 18+ (LTS)
  - MongoDB 6.0+
  - npm hoặc yarn

### Ports cần mở:
- `4000` - Backend API
- `5174` - Frontend (Customer)
- `5175` - Admin Panel
- `5176` - Restaurant Panel
- `27018` - MongoDB (external)

---

## 🐳 Cài đặt với Docker (Khuyến nghị)

### Bước 1: Cài đặt Docker Desktop

**Windows:**
1. Tải Docker Desktop: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động
3. Đợi icon Docker Desktop màu xanh (running)

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Bước 2: Clone và chuẩn bị môi trường

```bash
# Clone project
git clone https://github.com/Phamtinhicic/food_delivery_main.git
cd food_delivery_main

# Tạo file .env từ template
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Mở và chỉnh sửa .env
notepad .env  # Windows
# nano .env   # Linux/Mac
```

### Bước 3: Cấu hình .env

Mở file `.env` và điền các giá trị:

```env
# MongoDB
MONGO_URI=mongodb://mongodb:27017/FoodDelivery

# JWT Secret (Quan trọng! Thay đổi trong production)
JWT_SECRET=FoodDelivery2025_SecretKey_4Hs9Kp2Lm7Nq8Rt6Uw3Vx1Yz5

# Bcrypt Salt
SALT=10

# Backend Port
PORT=4000

# Stripe Payment (Đăng ký tại stripe.com)
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
```

### Bước 4: Chạy Docker Compose

```powershell
# Build và chạy tất cả services (lần đầu sẽ mất 5-10 phút)
docker-compose up --build

# HOẶC chạy ở background (không block terminal)
docker-compose up -d --build
```

### Bước 5: Truy cập ứng dụng

Đợi khoảng 30 giây để services khởi động hoàn tất, sau đó mở trình duyệt:

- 👥 **Frontend (Khách hàng):** http://localhost:5174
- ⚙️ **Admin Panel:** http://localhost:5175
- 🏪 **Restaurant Panel:** http://localhost:5176
- 🔧 **Backend API:** http://localhost:4000

### Bước 6: Tạo tài khoản Admin đầu tiên

Tài khoản admin mặc định đã được tạo sẵn:
- **Email:** admin@example.com
- **Password:** AdminPass123

Đăng nhập vào Admin Panel và Restaurant Panel bằng tài khoản này.

### Các lệnh Docker hữu ích

```powershell
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của một service cụ thể
docker-compose logs -f backend
docker-compose logs -f admin

# Kiểm tra trạng thái containers
docker ps

# Dừng tất cả services (giữ data)
docker-compose down

# Dừng và XÓA tất cả data (reset database)
docker-compose down -v

# Rebuild một service cụ thể
docker-compose build backend
docker-compose up -d backend

# Vào terminal của container
docker exec -it food_delivery_backend sh
docker exec -it food_delivery_mongodb mongosh
```

---

## 🛠️ Cài đặt thủ công (Không dùng Docker)

### Bước 1: Cài đặt MongoDB

**Windows:**
1. Tải MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Cài đặt và chạy MongoDB service
3. Mặc định chạy trên port 27017

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Bước 2: Cài đặt dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Admin
cd ../admin
npm install

# Restaurant
cd ../restaurant
npm install
```

### Bước 3: Cấu hình Backend

Tạo file `.env` trong folder `backend`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/FoodDelivery
JWT_SECRET=FoodDelivery2025_SecretKey_4Hs9Kp2Lm7Nq8Rt6Uw3Vx1Yz5
SALT=10
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
```

### Bước 4: Chạy tất cả services

**Cần 4 terminals riêng biệt:**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Hoặc: nodemon server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin:**
```bash
cd admin
npm run dev
```

**Terminal 4 - Restaurant:**
```bash
cd restaurant
npm run dev
```

---

## 🐛 Giải quyết lỗi thường gặp

### ❌ Lỗi: "JWT invalid signature"

**Nguyên nhân:** Token cũ trong localStorage không hợp lệ với JWT_SECRET mới.

**Giải pháp:**

**Cách 1: Xóa localStorage (Nhanh nhất)**
1. Mở trang bị lỗi (Admin hoặc Restaurant)
2. Nhấn **F12** → Tab **Console**
3. Chạy lệnh:
```javascript
localStorage.clear();
location.reload();
```
4. Đăng nhập lại với `admin@example.com` / `AdminPass123`

**Cách 2: Xóa thủ công**
1. Nhấn **F12** → Tab **Application**
2. **Local Storage** → URL của trang
3. Xóa các key: `token`, `admin`, `restaurant`
4. Reload trang (F5)

**Cách 3: Sync JWT_SECRET**
1. Kiểm tra JWT_SECRET trong `.env`:
```bash
docker exec food_delivery_backend env | grep JWT_SECRET
```
2. Nếu khác nhau, sửa `.env` và rebuild:
```bash
docker-compose down
docker-compose build backend
docker-compose up -d
```

### ❌ Lỗi: "Cannot connect to Docker daemon"

**Giải pháp:**
1. Mở Docker Desktop và đợi khởi động hoàn toàn
2. Kiểm tra: `docker --version`
3. Nếu vẫn lỗi, restart Docker Desktop

### ❌ Lỗi: "Port already allocated"

**Nguyên nhân:** Port đang được sử dụng bởi process khác.

**Giải pháp:**

**Windows:**
```powershell
# Tìm process đang dùng port 4000
netstat -ano | findstr :4000

# Kill process (thay PID bằng số ở cột cuối)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Tìm process
lsof -i :4000

# Kill process
kill -9 <PID>
```

**Hoặc đổi port trong docker-compose.yml:**
```yaml
services:
  backend:
    ports:
      - "4001:4000"  # Đổi port external sang 4001
```

### ❌ Lỗi: "npm ci failed" khi build Docker

**Giải pháp:**
```bash
# Xóa node_modules trong các thư mục
rm -rf frontend/node_modules admin/node_modules restaurant/node_modules backend/node_modules

# Rebuild không dùng cache
docker-compose build --no-cache
```

### ❌ Dashboard không hiển thị data

**Nguyên nhân:** Token không hợp lệ hoặc API endpoint sai.

**Giải pháp:**
1. Xóa localStorage và đăng nhập lại
2. Kiểm tra backend có chạy không: http://localhost:4000/api/food/list
3. Check console (F12) xem có lỗi API không

### ❌ React SPA 404 khi reload trang

**Nguyên nhân:** Nginx chưa cấu hình cho client-side routing.

**Giải pháp:** Đã fix sẵn trong `nginx.conf`:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Nếu vẫn lỗi, rebuild container:
```bash
docker-compose build admin
docker-compose up -d admin
```

---

## 💾 Quản lý Database

### Vị trí lưu trữ

Database được lưu trong **Docker Volume**, KHÔNG phải file trong project folder.

**Vị trí thực tế:**
- Windows (WSL2): `\\wsl$\docker-desktop-data\data\docker\volumes\food_delivery_main_mongodb_data\_data`
- Linux: `/var/lib/docker/volumes/food_delivery_main_mongodb_data/_data`
- Mac: `~/Library/Containers/com.docker.docker/Data/vms/0/data/docker/volumes/`

### Kiểm tra Volume

```powershell
# Xem danh sách volumes
docker volume ls

# Kết quả:
# local     food_delivery_main_mongodb_data  <-- Database ở đây

# Xem chi tiết volume
docker volume inspect food_delivery_main_mongodb_data
```

### Kết nối vào MongoDB

```bash
# Vào MongoDB shell
docker exec -it food_delivery_mongodb mongosh

# Trong mongosh:
use FoodDelivery
show collections
db.foods.find().pretty()
db.users.find().pretty()
db.orders.find().pretty()
exit
```

### Backup Database

**Cách 1: Sử dụng mongodump**
```bash
# Tạo backup
docker exec food_delivery_mongodb mongodump --db FoodDelivery --out /tmp/backup

# Copy backup ra máy local
docker cp food_delivery_mongodb:/tmp/backup ./mongodb_backup
```

**Cách 2: Export volume**
```bash
# Backup volume thành file tar
docker run --rm -v food_delivery_main_mongodb_data:/data -v ${PWD}:/backup alpine tar czf /backup/mongodb_backup.tar.gz -C /data .
```

### Restore Database

**Từ mongodump:**
```bash
# Copy backup vào container
docker cp ./mongodb_backup food_delivery_mongodb:/tmp/restore

# Restore
docker exec food_delivery_mongodb mongorestore --db FoodDelivery /tmp/restore/FoodDelivery
```

**Từ volume tar:**
```bash
# Restore từ file tar
docker run --rm -v food_delivery_main_mongodb_data:/data -v ${PWD}:/backup alpine tar xzf /backup/mongodb_backup.tar.gz -C /data
```

### Reset Database (Xóa tất cả data)

```bash
# Dừng containers
docker-compose down

# Xóa volume (XÓA HẾT DATA!)
docker volume rm food_delivery_main_mongodb_data

# Hoặc xóa luôn khi down
docker-compose down -v

# Chạy lại từ đầu
docker-compose up -d
```

### Xóa collections cụ thể

```bash
# Vào MongoDB shell
docker exec -it food_delivery_mongodb mongosh

# Trong mongosh:
use FoodDelivery
db.orders.drop()      # Xóa collection orders
db.foods.drop()       # Xóa collection foods
db.users.drop()       # Xóa collection users
```

---

## 🎯 Checklist trước khi sử dụng

- [ ] Docker Desktop đã cài và đang chạy (icon màu xanh)
- [ ] File `.env` đã được cấu hình đúng
- [ ] Đã chạy `docker-compose up -d`
- [ ] Tất cả containers đang running: `docker ps`
- [ ] Đã xóa localStorage cũ: `localStorage.clear()`
- [ ] Đã đăng nhập với `admin@example.com`
- [ ] Test 3 trang đều hoạt động (Customer, Admin, Restaurant)

---

## 🔗 Tài liệu liên quan

- [README.md](README.md) - Tổng quan dự án
- [restaurant/README.md](restaurant/README.md) - Chi tiết Restaurant Panel
- [.github/workflows/README.md](.github/workflows/README.md) - CI/CD Pipeline

---

## 📞 Support

Nếu vẫn gặp vấn đề:

1. **Check logs:**
```bash
docker-compose logs backend
docker-compose logs mongodb
```

2. **Restart tất cả:**
```bash
docker-compose restart
```

3. **Reset hoàn toàn:**
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

**Good luck! 🚀**
