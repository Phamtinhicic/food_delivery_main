# 🍕 Food Delivery System

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)](https://www.mongodb.com/mern-stack)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Hệ thống giao đồ ăn hoàn chỉnh với **3 giao diện riêng biệt**: Frontend (Khách hàng), Admin Panel và Restaurant Panel.

---

## 🚀 Bắt đầu nhanh

### Với Docker (Khuyến nghị)

**Yêu cầu:** Docker Desktop đã cài đặt và đang chạy

```bash
# Clone project
git clone https://github.com/Phamtinhicic/food_delivery_main.git
cd food_delivery_main

# Tạo file .env
copy .env.example .env

# Chỉnh sửa .env với các giá trị của bạn
# JWT_SECRET, STRIPE_SECRET_KEY, etc.

# Chạy tất cả services
docker-compose up -d

# Đợi ~30 giây để services khởi động
```

**Truy cập:**
- 👥 **Frontend (Khách hàng):** http://localhost:5174
- ⚙️ **Admin Panel:** http://localhost:5175
- 🏪 **Restaurant Panel:** http://localhost:5176
- 🔧 **Backend API:** http://localhost:4000

**Tài khoản Admin mặc định:**
- Email: `admin@example.com`
- Password: `AdminPass123`

---

## 🎬 Screenshots

### 👥 Frontend - Khách hàng

**Trang chủ với danh sách món ăn**

![Trang chủ](frontend/public/screenshots/Screenshot%202025-10-21%20011256.png)

**Lọc món theo danh mục**

![Lọc món](frontend/public/screenshots/Screenshot%202025-10-21%20011319.png)

**Đơn hàng**

![Đơn hàng](frontend/public/screenshots/Screenshot%202025-10-21%20011348.png)

**Giỏ hàng**

![Giỏ hàng](frontend/public/screenshots/Screenshot%202025-10-21%20011412.png)

**Thanh toán**

![Thanh toán](frontend/public/screenshots/Screenshot%202025-10-21%20011437.png)

**Thanh toán bằng Stripe**

![Stripe Payment](frontend/public/screenshots/Screenshot%202025-10-21%20011508.png)

---

### ⚙️ Admin Panel

**Dashboard tổng quan**

![Dashboard](frontend/public/screenshots/Screenshot%202025-10-21%20011630.png)

**Thêm sản phẩm mới**

![Thêm sản phẩm](frontend/public/screenshots/Screenshot%202025-10-21%20011642.png)

**Danh sách sản phẩm**

![Danh sách sản phẩm](frontend/public/screenshots/Screenshot%202025-10-21%20011651.png)

**Quản lý đơn hàng**

![Quản lý đơn hàng](frontend/public/screenshots/Screenshot%202025-10-21%20011702.png)

**Quản lý người dùng**

![Quản lý người dùng](frontend/public/screenshots/Screenshot%202025-10-21%20011713.png)

---

### 🏪 Restaurant Panel

**Quản lý đơn hàng**

![Quản lý đơn hàng](frontend/public/screenshots/Screenshot%202025-10-21%20011755.png)

**Xem thực đơn**

![Thực đơn](frontend/public/screenshots/Screenshot%202025-10-21%20011806.png)

---

## 📋 Tính năng chính

### 👥 Frontend - Giao diện Khách hàng

- 🏠 Trang chủ với danh sách món ăn đa dạng
- 🔍 Lọc món theo 8 danh mục (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles)
- 🍽️ **Nút "All"** nổi bật để xem tất cả món (dễ quay lại sau khi lọc)
- 🛒 Giỏ hàng và quản lý đơn hàng
- 💳 Thanh toán online qua Stripe hoặc COD
- 📦 Theo dõi trạng thái đơn hàng real-time
- 👤 Đăng ký/Đăng nhập với JWT authentication

### ⚙️ Admin Panel - Giao diện Quản trị

- 📊 Dashboard tổng quan (doanh thu, đơn hàng, thống kê)
- ➕ Thêm món ăn mới
- ✏️ Sửa món ăn (tên, giá, mô tả, ảnh, category)
- 🗑️ Xóa món ăn
- 📋 Quản lý danh sách món ăn
- 📦 Quản lý tất cả đơn hàng
- 👥 Quản lý người dùng
- 🔐 Phân quyền Admin

### 🏪 Restaurant Panel - Giao diện Nhà hàng

- 📊 Dashboard thống kê riêng
- 🍽️ Quản lý đơn hàng (Kanban board với 5 trạng thái)
- 🔔 Thông báo đơn mới (có âm thanh lặp lại)
- 🍴 Quản lý thực đơn (chỉ xem, không chỉnh sửa)
- ⚡ **Toggle ON/OFF món ăn 1 CLICK** - Tính năng quan trọng!
- ✕ **Nút "Xóa bộ lọc"** màu đỏ để quay lại tất cả món
- 📋 **Nút "Tất cả món"** với viền xanh lá nổi bật

---

## 🌟 Đặc điểm nổi bật

- ✅ **3 giao diện độc lập:** Frontend, Admin Panel, Restaurant Panel
- ✅ **Real-time updates:** Theo dõi đơn hàng trực tiếp
- ✅ **Thanh toán đa dạng:** Stripe (online) + COD (tiền mặt)
- ✅ **Responsive design:** Hoạt động mượt mà trên mọi thiết bị
- ✅ **Bảo mật cao:** JWT Authentication + Bcrypt password hashing
- ✅ **Containerized:** Docker-ready cho deployment dễ dàng
- ✅ **CI/CD:** GitHub Actions tự động build và test

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                     FOOD DELIVERY SYSTEM                     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   [Frontend]            [Admin Panel]      [Restaurant Panel]
   Port: 5174            Port: 5175          Port: 5176
   React + Vite          React + Vite        React + Vite
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                        [Backend API]
                        Port: 4000
                     Node.js + Express
                              │
                        [MongoDB]
                        Port: 27018
                    NoSQL Database
```

---

## 🔧 Tech Stack

### Frontend
- **Framework:** React 18 với Vite
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Styling:** CSS3 (custom)
- **Notifications:** React Toastify
- **Payment:** Stripe

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB với Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password:** Bcrypt
- **File Upload:** Multer
- **CORS:** Enabled

### DevOps
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Web Server:** Nginx (trong Docker)
- **Database:** MongoDB (Docker volume)

---

## 📊 Ports & Services

| Service | Port | URL |
|---------|------|-----|
| Backend API | 4000 | http://localhost:4000 |
| Frontend | 5174 | http://localhost:5174 |
| Admin Panel | 5175 | http://localhost:5175 |
| Restaurant Panel | 5176 | http://localhost:5176 |
| MongoDB | 27018 | mongodb://localhost:27018 |

---

## 🔐 Biến môi trường (.env)

```env
# MongoDB
MONGO_URI=mongodb://mongodb:27017/FoodDelivery

# JWT
JWT_SECRET=your_secret_key_here
SALT=10

# Backend
PORT=4000

# Stripe (https://stripe.com)
STRIPE_SECRET_KEY=sk_test_your_key_here
```

---

## 📚 Tài liệu

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết, xử lý lỗi, quản lý database
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Tổng quan kiến trúc hệ thống
- **[restaurant/README.md](restaurant/README.md)** - Chi tiết về Restaurant Panel

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi JWT "invalid signature"
```javascript
// Mở Console (F12) và chạy:
localStorage.clear();
location.reload();
// Sau đó đăng nhập lại
```

### Không thấy thay đổi sau khi update
```
Ctrl + Shift + R      // Hard refresh (Windows/Linux)
Cmd + Shift + R       // Hard refresh (Mac)
// Hoặc F12 → Network → tick "Disable cache" → Reload
```

### Port đã được sử dụng
```powershell
# Windows - Tìm process đang dùng port
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Docker không chạy
```bash
# Kiểm tra Docker
docker --version
docker ps

# Restart Docker Desktop
```

**Xem thêm:** [SETUP_GUIDE.md](SETUP_GUIDE.md) phần "Giải quyết lỗi thường gặp"

---

## 🎯 Workflow phát triển

```bash
# 1. Tạo branch mới
git checkout -b feature/new-feature

# 2. Code và test
npm run dev

# 3. Commit changes
git add .
git commit -m "Add new feature"

# 4. Push to GitHub
git push origin feature/new-feature

# 5. Tạo Pull Request
# GitHub Actions sẽ tự động build và test
```

---

## 📦 Docker Commands

```bash
# Chạy tất cả
docker-compose up -d

# Xem logs
docker-compose logs -f
docker-compose logs -f backend

# Dừng tất cả
docker-compose down

# Rebuild một service
docker-compose build admin
docker-compose up -d admin

# Reset database
docker-compose down -v
```

---

## 🏗️ Cấu trúc dự án

```bash
food_delivery_main/
├── frontend/          # React app cho khách hàng (port 5174)
├── admin/             # React app cho admin (port 5175)
├── restaurant/        # React app cho nhà hàng (port 5176)
├── backend/           # Node.js + Express API (port 4000)
├── docs/              # Tài liệu & Screenshots
├── .github/           # CI/CD workflows
├── docker-compose.yml # Docker orchestration
├── README.md          # File này
└── SETUP_GUIDE.md     # Hướng dẫn chi tiết
```

---

## 🆕 Cập nhật mới nhất

### Version 2.1 (October 2025)
- ✅ Cải thiện UX cho Restaurant Panel
- ✅ Thêm tính năng toggle ON/OFF món 1 click
- ✅ Thêm âm thanh thông báo lặp lại cho đơn mới
- ✅ Cải thiện filter menu với nút "Tất cả món" và "Xóa bộ lọc"
- ✅ Cập nhật ERD diagram phù hợp với source code thực tế
- ✅ Làm sạch documentation, loại bỏ thông tin duplicate

---

## 🤝 Contributing

Contributions are welcome! 

1. Fork repo này
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết

---

## 👤 Author

**Phamtinhicic**
- GitHub: [@Phamtinhicic](https://github.com/Phamtinhicic)
- Repository: [food_delivery_main](https://github.com/Phamtinhicic/food_delivery_main)

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Xem [Issues](https://github.com/Phamtinhicic/food_delivery_main/issues)
3. Tạo Issue mới với mô tả chi tiết

---

<div align="center">

**Made with ❤️ using MERN Stack**

⭐ Star this repo if you find it helpful!

</div>
