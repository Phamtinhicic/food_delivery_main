# 🍕 Food Delivery System - Hệ thống Giao đồ ăn

## 📋 Tổng quan

Đây là hệ thống giao đồ ăn hoàn chỉnh với **3 giao diện riêng biệt**:

1. **👥 Frontend** - Giao diện khách hàng
2. **🏪 Restaurant** - Giao diện nhà hàng  
3. **⚙️ Admin** - Giao diện quản trị viên

## 🎯 Kiến trúc hệ thống

```
food_delivery_main/
├── 📁 .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD Pipeline
│
├── 📁 backend/                # 🔧 Backend API (Port 4000)
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── cartController.js  # Giỏ hàng logic
│   │   ├── foodController.js  # Món ăn logic
│   │   ├── orderController.js # Đơn hàng logic
│   │   └── userController.js  # User authentication
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── foodModel.js       # Food schema
│   │   ├── orderModel.js      # Order schema
│   │   └── userModel.js       # User schema
│   ├── routes/
│   │   ├── cartRoute.js
│   │   ├── foodRoute.js
│   │   ├── orderRoute.js
│   │   └── userRoute.js
│   ├── scripts/
│   │   └── createAdmin.js     # Script tạo admin account
│   ├── tests/                 # ✅ Jest Unit Tests
│   │   ├── user.test.js       # 10 user tests
│   │   ├── food.test.js       # 13 food tests
│   │   └── README.md
│   ├── uploads/               # Ảnh món ăn được upload
│   ├── .env                   # Environment variables
│   ├── Dockerfile             # Docker config
│   ├── jest.config.js         # Jest configuration
│   ├── package.json
│   └── server.js              # Express server
│
├── 📁 frontend/               # 👥 Giao diện khách hàng (Port 5174)
│   ├── public/
│   │   ├── screenshots/       # 📸 App screenshots
│   │   ├── header_img.png
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── frontend_assets/
│   │   │       └── assets.js
│   │   ├── components/
│   │   │   ├── AppDownload/
│   │   │   ├── ExploreMenu/   # Menu categories
│   │   │   ├── FoodDisplay/   # Hiển thị món ăn
│   │   │   ├── FoodItem/      # Card món ăn
│   │   │   ├── Footer/
│   │   │   ├── Header/        # Hero banner
│   │   │   ├── LoginPopup/    # Login modal
│   │   │   └── Navbar/
│   │   ├── context/
│   │   │   └── StoreContext.jsx  # Global state
│   │   ├── pages/
│   │   │   ├── Cart/          # Giỏ hàng
│   │   │   ├── Home/          # Trang chủ
│   │   │   ├── MyOrders/      # Đơn hàng của tôi
│   │   │   ├── PlaceOrder/    # Đặt hàng & thanh toán
│   │   │   └── Verify/        # Xác thực thanh toán Stripe
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .eslintrc.cjs
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf             # Nginx for production
│   ├── package.json
│   └── vite.config.js
│
├── 📁 restaurant/             # 🏪 Giao diện nhà hàng (Port 5176)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── assets.js
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   │   ├── Login/
│   │   │   ├── Navbar/
│   │   │   └── Sidebar/
│   │   ├── context/
│   │   │   └── StoreContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard/         # 📊 Tổng quan doanh thu
│   │   │   ├── MenuManagement/    # 🍽️ Quản lý thực đơn
│   │   │   ├── OrderManagement/   # 📦 Quản lý đơn hàng (Kanban)
│   │   │   ├── StoreManagement/   # 🏪 Quản lý cửa hàng
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── 📁 admin/                  # ⚙️ Giao diện quản trị (Port 5175)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── assets.js
│   │   ├── components/
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.css
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   └── Sidebar/
│   │   │       ├── Sidebar.jsx
│   │   │       └── Sidebar.css
│   │   ├── context/
│   │   │   └── StoreContext.jsx
│   │   ├── pages/
│   │   │   ├── Add/           # ➕ Thêm món mới
│   │   │   │   ├── Add.jsx
│   │   │   │   └── Add.css
│   │   │   ├── Dashboard/     # 📊 Dashboard tổng quan
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Dashboard.css
│   │   │   ├── List/          # 📝 Danh sách món
│   │   │   │   ├── List.jsx
│   │   │   │   └── List.css
│   │   │   ├── Orders/        # 📦 Quản lý đơn hàng
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── Orders.css
│   │   │   └── Users/         # 👥 Quản lý users
│   │   │       ├── Users.jsx
│   │   │       └── Users.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .eslintrc.cjs
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── 📄 .env                    # Local environment variables
├── 📄 .env.example            # Env template
├── � .env.production.example # Production env template
├── 📄 .gitignore
├── 📄 docker-compose.yml      # Docker Compose for local dev
├── 📄 docker-compose-with-ui.yml  # Docker Compose with Mongo Express
├── 📄 docker-compose.production.yml  # Production compose (Docker Hub images)
├── 📄 DEPLOYMENT_GUIDE.md     # 📚 Hướng dẫn deploy
├── 📄 DOCUMENTATION_UPDATE.md
├── 📄 PROJECT_OVERVIEW.md     # 📖 Tài liệu này
├── 📄 README.md               # 📖 README chính
└── 📄 SETUP_GUIDE.md          # 🚀 Hướng dẫn setup
```

## 🎭 Phân biệt 3 giao diện

### 1. 👥 Frontend - Giao diện Khách hàng

**Mục đích:** Cho khách hàng đặt món, thanh toán, theo dõi đơn hàng

**Port:** `5174` (Docker), `5173` (Local dev)

**Tính năng:**
- 🏠 Trang chủ với menu món ăn
- 🛒 Giỏ hàng và checkout
- 💳 Thanh toán online (Stripe)
- 📦 Theo dõi đơn hàng real-time
- 👤 Đăng nhập/Đăng ký
- 📱 Responsive (mobile-first)

**Đối tượng:** Khách hàng cuối

**Chạy:**
```bash
cd frontend
npm install
npm run dev
# Docker: http://localhost:5174
# Local dev: http://localhost:5173
```

---

### 2. 🏪 Restaurant - Giao diện Nhà hàng

**Mục đích:** Cho nhà hàng nhận đơn, quản lý món, cửa hàng

**Port:** `5176`

**Tính năng chính:**

#### 📊 Dashboard
- Doanh thu hôm nay
- Tổng đơn hàng
- Biểu đồ doanh thu
- Top món bán chạy

#### 🍽️ Order Management (⭐ Quan trọng nhất!)
- **Kanban board** với 5 cột: Pending → Preparing → Delivering → Completed → Cancelled
- **🔊 Âm thanh thông báo** lặp lại khi có đơn mới (cho môi trường bếp ồn)
- Xác nhận/Hủy đơn nhanh
- Auto-refresh 10 giây
- Hiển thị đầy đủ: Mã đơn, Khách, Món, Tổng tiền, Ghi chú

#### 🍴 Menu Management
- **Toggle ON/OFF món 1 CLICK** (quan trọng!)
  - Không cần vào trang edit
  - Khi tắt → hiển thị "HẾT HÀNG"
- Thêm/Sửa/Xóa món
- Lọc theo category

#### 🏪 Store Management
- **Toggle đóng/mở cửa hàng** (1 nút)
  - Khách không đặt được khi đóng
- Giờ mở cửa trong tuần
- Thông tin cửa hàng

**Đối tượng:** Chủ nhà hàng, nhân viên bếp, nhân viên phục vụ

**Chạy:**
```bash
cd restaurant
npm install
npm run dev
# Truy cập: http://localhost:5176
```

---

### 3. ⚙️ Admin - Giao diện Quản trị viên

**Mục đích:** Cho admin tổng quản lý toàn hệ thống

**Port:** `5175`

**Tính năng:**
- 📝 Quản lý tất cả món ăn (CRUD)
- 📦 Quản lý tất cả đơn hàng từ mọi nhà hàng
- 👥 Quản lý người dùng
- 🏪 Quản lý nhà hàng/đối tác
- 📊 Báo cáo tổng hợp
- ⚙️ Cài đặt hệ thống

**Đối tượng:** Super Admin, Quản trị viên hệ thống

**Chạy:**
```bash
cd admin
npm install
npm run dev
# Truy cập: http://localhost:5175
```

---

## 🔧 Backend API

**Port:** `4000`

**Tech Stack:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Stripe Payment
- Multer (Upload ảnh)

**Chạy:**
```bash
cd backend
npm install
npm start
# API: http://localhost:4000
```

**Env Variables (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 🚀 Hướng dẫn chạy toàn bộ hệ thống

### 1. Cài đặt dependencies cho tất cả

```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Restaurant
cd ../restaurant
npm install

# Admin
cd ../admin
npm install
```

### 2. Cấu hình Backend

Tạo file `.env` trong folder `backend`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/food_delivery
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Chạy tất cả (4 terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Restaurant:**
```bash
cd restaurant
npm run dev
```

**Terminal 4 - Admin:**
```bash
cd admin
npm run dev
```

### 4. Truy cập

- 👥 Frontend (Khách hàng): http://localhost:5173
- 🏪 Restaurant (Nhà hàng): http://localhost:5176
- ⚙️ Admin (Quản trị): http://localhost:5175
- 🔧 Backend API: http://localhost:4000

---

## 📱 Ports Summary

| Service | Port (Docker) | Port (Local) | URL |
|---------|---------------|--------------|-----|
| Backend | 4000 | 4000 | http://localhost:4000 |
| Frontend | 5174 | 5173 | http://localhost:5174 (Docker) |
| Admin | 5175 | 5173 | http://localhost:5175 |
| Restaurant | 5176 | 5173 | http://localhost:5176 |

**Lưu ý:** Khi chạy local dev (không Docker), tất cả frontend apps đều mặc định dùng port 5173 của Vite. Chỉ chạy 1 app tại 1 thời điểm, hoặc config port khác trong `vite.config.js`.

---

## 🎨 Design System

### Colors
- 🔵 Primary: `#2563eb` (Blue)
- 🟢 Success: `#16a34a` (Green)
- 🔴 Danger: `#dc2626` (Red)
- 🟠 Warning: `#f59e0b` (Orange)
- ⚪ Gray: `#6b7280` (Secondary)

### Typography
- Font: System fonts (san-serif)
- Heading: 24-32px, weight 600-700
- Body: 14-16px, weight 400-500

---

## 🔐 Authentication Flow

1. **Khách hàng** → Đăng ký/Đăng nhập → JWT Token → Đặt hàng
2. **Nhà hàng** → Login riêng → Nhận đơn, quản lý
3. **Admin** → Login riêng → Quản lý toàn hệ thống

---

## 📦 Deployment

### Frontend, Restaurant, Admin
- Deploy to: Vercel, Netlify, or GitHub Pages
- Build command: `npm run build`
- Output: `dist/`

### Backend
- Deploy to: Heroku, Railway, Render, or AWS
- Start command: `npm start`
- Env variables: Set trong dashboard

---

## 🐛 Troubleshooting

### Port đã được sử dụng?
```bash
# Thay đổi port trong vite.config.js
server: {
  port: 5177  # Đổi sang port khác
}
```

### CORS Error?
- Check backend CORS settings
- Đảm bảo `cors` được enable trong `server.js`

### MongoDB Connection Error?
- Check connection string
- Đảm bảo MongoDB đang chạy

---

## 📝 Notes

- **Restaurant Panel** là phần MỚI được thiết kế đặc biệt cho nhà hàng
- **Admin** giữ lại cho quản trị viên tổng
- **Frontend** giữ nguyên cho khách hàng
- Mỗi giao diện chạy độc lập, có thể deploy riêng

---

## 🤝 Contributing

Nếu muốn contribute:
1. Fork repo
2. Create branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License

---

**Made with ❤️ for Food Delivery Business**
