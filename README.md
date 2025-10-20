# 🍕 Food Delivery System# 🍕 Food Delivery System - Hệ thống Giao đồ ăn trực tuyến# 🍕 Food Delivery System - Hệ thống Giao đồ ăn trực tuyến#  TOMATO - Food Ordering Website



[![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)](https://www.mongodb.com/mern-stack)

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)[![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)](https://www.mongodb.com/mern-stack)



Hệ thống giao đồ ăn hoàn chỉnh với **3 giao diện riêng biệt**: Khách hàng, Admin và Nhà hàng.[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)



---[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)Hệ thống giao đồ ăn hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React, Node.js), bao gồm **3 giao diện riêng biệt** cho khách hàng, quản trị viên và nhà hàng.



## 🚀 Bắt đầu nhanh



### Với Docker (Khuyến nghị)Hệ thống giao đồ ăn hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React, Node.js), bao gồm **3 giao diện riêng biệt** được thiết kế chuyên nghiệp cho khách hàng, quản trị viên và nhà hàng.



```bash

# Clone project

git clone https://github.com/Phamtinhicic/food_delivery_main.git------Hệ thống giao đồ ăn hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React, Node.js), bao gồm **3 giao diện riêng biệt** cho khách hàng, admin và nhà hàng.

cd food_delivery_main



# Tạo file .env

copy .env.example .env## 📖 Giới thiệu Dự án



# Chạy

docker-compose up -d

```### 🎯 Mục tiêu## 📋 Tính năng chính



**Truy cập:**Xây dựng một nền tảng giao đồ ăn trực tuyến toàn diện, cho phép:

- 👥 Frontend: http://localhost:5174

- ⚙️ Admin: http://localhost:5175- **Khách hàng:** Dễ dàng đặt món, thanh toán online và theo dõi đơn hàng real-time

- 🏪 Restaurant: http://localhost:5176

- **Nhà hàng:** Quản lý đơn hàng hiệu quả với giao diện Kanban, bật/tắt món nhanh chóng

**Đăng nhập Admin:**

- Email: `admin@example.com`- **Quản trị viên:** Kiểm soát toàn bộ hệ thống, quản lý món ăn, đơn hàng và người dùng### 👥 Frontend - Giao diện Khách hàng## 📋 Tính năng chínhHệ thống giao đồ ăn hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React, Node.js), bao gồm **3 giao diện riêng biệt** cho khách hàng, admin và nhà hàng.This repository hosts the source code for TOMATO, a dynamic food ordering website built with the MERN Stack. It offers a user-friendly platform for seamless online food ordering.

- Password: `AdminPass123`



---

### 🌟 Đặc điểm nổi bật- 🏠 Trang chủ với danh sách món ăn đa dạng

## 📋 Tính năng chính

- ✅ **3 giao diện độc lập:** Frontend, Admin Panel, Restaurant Panel

### 👥 Frontend (Khách hàng)

- 🛒 Đặt món, giỏ hàng- ✅ **Real-time updates:** Theo dõi đơn hàng trực tiếp- 🔍 Lọc món theo 8 danh mục (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles)

- 💳 Thanh toán Stripe + COD

- 📦 Theo dõi đơn hàng real-time- ✅ **Thanh toán đa dạng:** Stripe (online) + COD (tiền mặt)

- 🔐 Đăng ký/Đăng nhập

- ✅ **Responsive design:** Hoạt động mượt mà trên mọi thiết bị- 🛒 Giỏ hàng và quản lý đơn hàng

### ⚙️ Admin Panel

- 📊 Dashboard tổng quan- ✅ **Bảo mật cao:** JWT Authentication + Bcrypt password hashing

- 🍽️ Quản lý món ăn (CRUD)

- 📦 Quản lý đơn hàng- ✅ **Containerized:** Docker-ready cho deployment dễ dàng- 💳 Thanh toán online qua Stripe hoặc COD### 👥 Frontend - Giao diện Khách hàng

- 👥 Quản lý người dùng

- ✅ **CI/CD:** GitHub Actions tự động build và test

### 🏪 Restaurant Panel

- 🍽️ Quản lý đơn hàng (Kanban board)- 📦 Theo dõi trạng thái đơn hàng real-time

- 🔔 Thông báo đơn mới (có âm thanh)

- 🔄 Toggle bật/tắt món 1 click### 🏗️ Kiến trúc hệ thống

- 🏪 Quản lý cửa hàng

```- 👤 Đăng ký/Đăng nhập với JWT authentication- 🏠 Trang chủ với danh sách món ăn

---

┌─────────────────────────────────────────────────────────────┐

## 🔧 Tech Stack

│                     FOOD DELIVERY SYSTEM                     │

| Layer | Tech |

|-------|------|└─────────────────────────────────────────────────────────────┘

| Frontend | React 18, Vite, React Router v6 |

| Backend | Node.js 18+, Express.js |                              │### ⚙️ Admin Panel - Giao diện Quản trị- 🍽️ **Nút "All"** nổi bật để xem tất cả món (dễ quay lại sau khi lọc)## 📋 Tính năng chính## Demo

| Database | MongoDB, Mongoose |

| Auth | JWT, Bcrypt |        ┌─────────────────────┼─────────────────────┐

| Payment | Stripe |

| DevOps | Docker, GitHub Actions |        │                     │                     │- 📊 Dashboard tổng quan (doanh thu, đơn hàng, thống kê)



---   [Frontend]            [Admin Panel]      [Restaurant Panel]



## 📦 Cài đặt thủ công   Port: 5174            Port: 5175          Port: 5176- ➕ Thêm món ăn mới- 🔍 Lọc món theo 8 danh mục (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles)



Xem hướng dẫn chi tiết tại **[SETUP_GUIDE.md](SETUP_GUIDE.md)**   React + Vite          React + Vite        React + Vite



---        │                     │                     │- ✏️ Sửa món ăn (tên, giá, mô tả, ảnh, category)



## 📚 Tài liệu        └─────────────────────┴─────────────────────┘



- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Cài đặt chi tiết & troubleshooting                              │- 🗑️ Xóa món ăn- 🛒 Giỏ hàng và quản lý đơn hàng

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Kiến trúc hệ thống

- **[restaurant/README.md](restaurant/README.md)** - Chi tiết Restaurant Panel                        [Backend API]



---                        Port: 4000- 📋 Quản lý danh sách món ăn



## 🐛 Lỗi thường gặp                     Node.js + Express



**JWT invalid signature:**                              │- 📦 Quản lý tất cả đơn hàng- 💳 Thanh toán online qua Stripe

```javascript

localStorage.clear();                        [MongoDB]

location.reload();

```                        Port: 27018- 👥 Quản lý người dùng



**Port đã sử dụng:**                    NoSQL Database

```powershell

netstat -ano | findstr :4000```- 🔐 Phân quyền Admin- 📦 Theo dõi trạng thái đơn hàng real-time### 👥 Frontend - Giao diện Khách hàng- User Panel: [https://food-delivery-frontend-s2l9.onrender.com/](https://food-delivery-frontend-s2l9.onrender.com/)

taskkill /PID <PID> /F

```



Xem thêm tại [SETUP_GUIDE.md](SETUP_GUIDE.md)---



---



## 📞 Liên hệ## 🎬 Demo & Screenshots### 🏪 Restaurant Panel - Giao diện Nhà hàng- 👤 Đăng ký/Đăng nhập với JWT authentication



**Phamtinhicic**

- GitHub: [@Phamtinhicic](https://github.com/Phamtinhicic)

- Repo: [food_delivery_main](https://github.com/Phamtinhicic/food_delivery_main)### 👥 Frontend - Giao diện Khách hàng- 📊 Dashboard thống kê riêng



---



**Made with ❤️ using MERN Stack**#### 🏠 Trang chủ (Home Page)- 🍽️ Quản lý đơn hàng (Kanban board với 5 trạng thái)- 🏠 Trang chủ với danh sách món ăn- Admin Panel: [https://food-delivery-admin-wrme.onrender.com/](https://food-delivery-admin-wrme.onrender.com/)


Hiển thị danh sách món ăn đa dạng với giao diện hiện đại, dễ sử dụng.

- 🔔 Thông báo đơn mới (có âm thanh lặp lại)

**Chức năng:**

- Xem tất cả món ăn với hình ảnh, mô tả, giá cả- 🍴 Quản lý thực đơn (thêm/sửa/xóa món, toggle ON/OFF)### ⚙️ Admin Panel - Giao diện Quản trị

- Filter nhanh theo 8 danh mục: Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles

- Nút "All" nổi bật để quay lại xem tất cả món- 🏪 Quản lý cửa hàng (bật/tắt nhận đơn, giờ mở cửa)

- Thêm món vào giỏ hàng chỉ với 1 click

- Header với menu điều hướng và icon giỏ hàng- 📊 Dashboard tổng quan (doanh thu, đơn hàng, thống kê)- 🔍 Tìm kiếm và lọc món theo danh mục



#### 🛒 Giỏ hàng (Cart)---

Quản lý các món đã chọn trước khi thanh toán.

- ➕ Thêm món ăn mới

**Chức năng:**

- Hiển thị danh sách món trong giỏ với ảnh, tên, giá, số lượng## 🚀 Bắt đầu nhanh

- Tăng/giảm số lượng món

- Xóa món khỏi giỏ- ✏️ Sửa món ăn (tên, giá, mô tả, ảnh, category)- 🛒 Giỏ hàng và quản lý đơn hàng## Features

- Tính tổng tiền tự động (subtotal + delivery fee)

- Mã khuyến mãi (Promo code)### Cài đặt với Docker (Khuyến nghị)

- Nút "Proceed to Checkout" chuyển sang trang đặt hàng

- 🗑️ Xóa món ăn

#### 💳 Thanh toán (Checkout)

Nhập thông tin giao hàng và chọn phương thức thanh toán.**Yêu cầu:** Docker Desktop đã cài đặt và đang chạy



**Chức năng:**- 📋 Quản lý danh sách món ăn- 💳 Thanh toán online qua Stripe

- Form nhập địa chỉ giao hàng (họ tên, email, SĐT, địa chỉ chi tiết)

- Chọn phương thức thanh toán:```bash

  - **COD:** Thanh toán khi nhận hàng

  - **Stripe:** Thanh toán online qua thẻ tín dụng# Clone project- 📦 Quản lý tất cả đơn hàng

- Hiển thị tóm tắt đơn hàng

- Xác nhận và đặt hànggit clone https://github.com/Phamtinhicic/food_delivery_main.git



#### 📦 Đơn hàng của tôi (My Orders)cd food_delivery_main- 👥 Quản lý người dùng- 📦 Theo dõi trạng thái đơn hàng real-time- User Panel

Theo dõi lịch sử và trạng thái đơn hàng.



**Chức năng:**

- Danh sách tất cả đơn hàng đã đặt# Tạo file .env (hoặc copy từ .env.example)- 🔐 Phân quyền Admin

- Trạng thái real-time:

  - 🔄 Food Processing (Đang xử lý)copy .env.example .env

  - 🚚 Out for Delivery (Đang giao)

  - ✅ Delivered (Đã giao)- 👤 Đăng ký/Đăng nhập với JWT authentication- Admin Panel

- Chi tiết từng đơn: món ăn, số lượng, tổng tiền, địa chỉ giao

- Nút "Track Order" để theo dõi# Chỉnh sửa .env với các giá trị của bạn



#### 🔐 Đăng nhập/Đăng ký# JWT_SECRET, STRIPE_SECRET_KEY, etc.### 🏪 Restaurant Panel - Giao diện Nhà hàng

Quản lý tài khoản người dùng.



**Chức năng:**

- Đăng ký tài khoản mới (tên, email, password)# Chạy tất cả services- 🍽️ Quản lý đơn hàng (Kanban board với 4 trạng thái)- JWT Authentication

- Đăng nhập (email + password)

- JWT token lưu trong localStoragedocker-compose up -d

- Tự động redirect sau khi login thành công

- 🔔 Thông báo đơn mới (có âm thanh)

---

# Đợi ~30 giây để services khởi động

### ⚙️ Admin Panel - Giao diện Quản trị

```- 🍴 **Quản lý thực đơn** (chỉ xem, không chỉnh sửa)### ⚙️ Admin Panel - Giao diện Quản trị- Password Hashing with Bcrypt

#### 📊 Dashboard

Tổng quan toàn hệ thống với biểu đồ và thống kê.



**Chức năng:****Truy cập:**- ✕ **Nút "Xóa bộ lọc"** màu đỏ để quay lại tất cả món

- 💰 Tổng doanh thu (total revenue)

- 📦 Số lượng đơn hàng (total orders)- 👥 **Frontend (Khách hàng):** http://localhost:5174

- 👥 Số lượng người dùng (total users)

- 🍽️ Số lượng món ăn (total foods)- ⚙️ **Admin Panel:** http://localhost:5175  - 📋 **Nút "Tất cả món"** với viền xanh lá nổi bật- 📊 Dashboard tổng quan (doanh thu, đơn hàng, thống kê)- Stripe Payment Integration

- 📈 Biểu đồ doanh thu theo thời gian

- 🏆 Top món bán chạy nhất- 🏪 **Restaurant Panel:** http://localhost:5176

- 📋 Đơn hàng gần đây

- 🔧 **Backend API:** http://localhost:4000

#### ➕ Thêm món ăn (Add Items)

Thêm món ăn mới vào hệ thống.



**Chức năng:****Tài khoản Admin mặc định:**## 🚀 Bắt đầu nhanh- ➕ Thêm/Sửa/Xóa món ăn- Login/Signup

- Upload ảnh món ăn (drag & drop hoặc click)

- Nhập tên món- Email: `admin@example.com`

- Nhập mô tả chi tiết

- Chọn danh mục (category dropdown)- Password: `AdminPass123`

- Nhập giá tiền

- Nút "Add" để lưu món mới

- Validation form đầy đủ

- Thông báo thành công/lỗi (toast notification)### Cài đặt thủ công (Không dùng Docker)### Cài đặt với Docker (Khuyến nghị)- 📋 Quản lý danh sách món ăn- Logout



#### 📋 Danh sách món (List Items)

Quản lý tất cả món ăn trong hệ thống.

**Yêu cầu:** Node.js 18+, MongoDB 6.0+

**Chức năng:**

- Bảng hiển thị tất cả món với: ảnh, tên, category, giá

- Tìm kiếm món ăn (search bar)

- Lọc theo danh mục```bash**Yêu cầu:** Docker Desktop đã cài đặt và đang chạy- 📦 Quản lý tất cả đơn hàng- Add to Cart

- Nút ✏️ **Edit** để sửa món:

  - Sửa tên, giá, mô tả# Backend

  - Thay đổi ảnh

  - Đổi categorycd backend

- Nút 🗑️ **Delete** để xóa món (có confirm dialog)

- Pagination nếu nhiều mónnpm install



#### 📦 Quản lý đơn hàng (Orders)npm start```bash- 👥 Quản lý người dùng- Place Order

Xem và xử lý tất cả đơn hàng từ khách.



**Chức năng:**

- Danh sách tất cả đơn hàng (mới nhất trước)# Frontend (terminal mới)# Clone project

- Mỗi đơn hiển thị:

  - Mã đơn hàng (Order ID)cd frontend

  - Tên khách hàng

  - Danh sách món + số lượngnpm installgit clone https://github.com/Phamtinhicic/food_delivery_main.git- 🔐 Phân quyền Admin- Order Management

  - Tổng tiền

  - Địa chỉ giao hàngnpm run dev

  - Trạng thái hiện tại

  - Phương thức thanh toáncd food_delivery_main

- Dropdown **thay đổi trạng thái:**

  - Food Processing → Out for Delivery → Delivered# Admin (terminal mới)

- Filter theo trạng thái

- Tìm kiếm đơn hàngcd admin- Products Management



#### 👥 Quản lý người dùng (Users)npm install

Quản lý tất cả tài khoản trong hệ thống.

npm run dev# Tạo file .env

**Chức năng:**

- Danh sách users với: tên, email, role, ngày tạo

- Phân quyền (role):

  - `user` - Khách hàng# Restaurant (terminal mới)copy .env.example .env### 🏪 Restaurant Panel - Giao diện Nhà hàng- Filter Food Products

  - `admin` - Quản trị viên

  - `restaurant` - Nhà hàngcd restaurant

- Thay đổi role của user

- Xóa tài khoản (nếu cần)npm install

- Xem lịch sử đặt hàng của user

npm run dev

---

```# Chỉnh sửa .env với các giá trị của bạn- 📊 Dashboard thống kê riêng- Login/Signup

### 🏪 Restaurant Panel - Giao diện Nhà hàng



#### 📊 Dashboard Nhà hàng

Thống kê riêng cho từng nhà hàng.**Chi tiết hướng dẫn:** Xem [SETUP_GUIDE.md](SETUP_GUIDE.md)# JWT_SECRET, STRIPE_SECRET_KEY, etc.



**Chức năng:**

- 💰 Doanh thu hôm nay

- 📦 Số đơn hàng hôm nay---- 🍽️ Quản lý đơn hàng (Kanban board với 5 trạng thái)- Authenticated APIs

- ✅ Đơn hoàn thành

- ❌ Đơn bị hủy

- 📈 Biểu đồ doanh thu 7 ngày

- 🏆 Món bán chạy của nhà hàng## 🏗️ Cấu trúc dự án# Chạy tất cả services

- 🕒 Đơn hàng gần đây



#### 🍽️ Quản lý đơn hàng - Kanban Board ⭐

```bashdocker-compose up -d- 🔔 Thông báo đơn mới (có âm thanh)- REST APIs

**Đây là màn hình QUAN TRỌNG NHẤT của Restaurant Panel!**

food_delivery_main/

Giao diện Kanban board với **5 cột trạng thái:**

├── frontend/          # React app cho khách hàng (port 5174)

1. **🔔 Pending (Đơn mới)**

   - Đơn vừa đặt, chờ xác nhận├── admin/             # React app cho admin (port 5175)

   - 🔊 **Âm thanh thông báo lặp lại** khi có đơn mới (cho môi trường bếp ồn)

   - Nút **"Xác nhận"** (màu xanh) → chuyển sang Preparing├── restaurant/        # React app cho nhà hàng (port 5176)# Đợi ~30 giây để services khởi động- 🍴 Quản lý thực đơn (chỉ xem, không chỉnh sửa)- Role-Based Identification

   - Nút **"Hủy đơn"** (màu đỏ) → chuyển sang Cancelled

├── backend/           # Node.js + Express API (port 4000)

2. **👨‍🍳 Preparing (Đang chuẩn bị)**

   - Bếp đang làm món├── docs/              # Tài liệu (ERD, component diagrams)```

   - Nút **"Sẵn sàng giao"** → chuyển sang Delivering

├── .github/           # CI/CD workflows

3. **🚚 Delivering (Đang giao)**

   - Shipper đã nhận và đang giao├── docker-compose.yml # Docker orchestration- 🏪 Quản lý cửa hàng (bật/tắt nhận đơn)- Beautiful Alerts

   - Chỉ theo dõi, không action

├── README.md          # File này

4. **✅ Completed (Hoàn thành)**

   - Đơn đã giao thành công└── SETUP_GUIDE.md     # Hướng dẫn chi tiết**Truy cập:**

   - Lịch sử tham khảo

```

5. **❌ Cancelled (Đã hủy)**

   - Đơn bị hủy (kèm lý do)- 👥 **Frontend (Khách hàng):** http://localhost:5174

   - Lịch sử tham khảo

---

**Mỗi card đơn hàng hiển thị:**

- 🆔 Mã đơn hàng- ⚙️ **Admin Panel:** http://localhost:5175  

- 👤 Tên khách hàng

- 📞 Số điện thoại## 🔧 Tech Stack

- 📍 Địa chỉ giao hàng

- 🍽️ Danh sách món + số lượng- 🏪 **Restaurant Panel:** http://localhost:5176## 🚀 Bắt đầu nhanh## Screenshots

- 💰 Tổng tiền

- 💳 Phương thức thanh toán### Frontend

- 🕐 Thời gian đặt

- 📝 Ghi chú (nếu có)- **Framework:** React 18 với Vite- 🔧 **Backend API:** http://localhost:4000



**Tính năng đặc biệt:**- **Routing:** React Router DOM v6

- 🔄 Auto-refresh 10 giây (cập nhật đơn mới tự động)

- 🎨 Color-coded theo trạng thái- **HTTP Client:** Axios

- 📱 Responsive cho tablet (nhân viên cầm đi)

- ⚡ Drag & drop giữa các cột (optional)- **Styling:** CSS3 (custom)



#### 🍴 Quản lý Thực đơn- **Notifications:** React Toastify**Tài khoản Admin mặc định:**



**⭐ Toggle ON/OFF món ăn 1 CLICK - Tính năng QUAN TRỌNG!**- **Payment:** Stripe



**Chức năng:**- Email: `admin@example.com`### Cài đặt với Docker (Khuyến nghị)![Hero](https://i.ibb.co/59cwY75/food-hero.png)

- Hiển thị tất cả món của nhà hàng (grid layout với ảnh)

- Mỗi card món có:### Backend

  - Ảnh món ăn

  - Tên món- **Runtime:** Node.js 18+- Password: `AdminPass123`

  - Giá tiền

  - Category- **Framework:** Express.js

  - **Toggle button ON/OFF** (nổi bật, luôn visible)

- **Database:** MongoDB với Mongoose- Hero Section

**Toggle ON/OFF:**

- ✅ **ON (màu xanh):** Món đang bán, khách thấy được- **Authentication:** JWT (jsonwebtoken)

- ❌ **OFF (màu đỏ):** Món tạm hết, khách không thấy

- Overlay **"HẾT HÀNG"** màu đỏ khi tắt- **Password:** Bcrypt### Cài đặt thủ công (Không dùng Docker)

- **1 click** để bật/tắt, không cần vào trang edit

- Update ngay lập tức- **File Upload:** Multer



**Lý do quan trọng:**- **CORS:** Enabled**Yêu cầu:** Docker Desktop đã cài đặt và đang chạy

Khi bếp hết nguyên liệu của 1 món, họ cần tắt ngay **KHÔNG** chờ được!



**Các chức năng khác:**

- 🔍 Lọc theo category### DevOps**Yêu cầu:** Node.js 18+, MongoDB 6.0+

- Nút "Tất cả món" với viền xanh lá nổi bật

- Nút "✕ Xóa bộ lọc" màu đỏ (khi đang filter)- **Containerization:** Docker + Docker Compose

- ➕ Thêm món mới

- ✏️ Sửa món (giá, tên, mô tả, ảnh)- **CI/CD:** GitHub Actions![Products](https://i.ibb.co/JnNQPyQ/food-products.png)

- 🗑️ Xóa món (confirm trước)

- **Web Server:** Nginx (trong Docker)

#### 🏪 Quản lý Cửa hàng

- **Database:** MongoDB (Docker volume)```bash

**Toggle "Đóng cửa hàng" - Tính năng quan trọng!**



**Chức năng chính:**

- 🔴/🟢 **Nút toggle lớn "MỞ CỬA / ĐÓNG CỬA"**---# Backend```bash- Products Section

  - Khi đóng → khách KHÔNG đặt được hàng

  - Hiển thị "Cửa hàng tạm đóng" trên frontend

  - Dùng khi: quá tải, hết nguyên liệu, nghỉ giữa giờ

## 📊 Ports & Servicescd backend

**Thông tin cửa hàng:**

- 🏪 Tên nhà hàng

- 📍 Địa chỉ

- 📞 Số điện thoại| Service | Port | URL |npm install# Clone project

- 📧 Email

- 📝 Mô tả|---------|------|-----|



**Giờ mở cửa:**| Backend API | 4000 | http://localhost:4000 |npm start

- ⏰ Cài đặt giờ mở/đóng cho từng ngày trong tuần:

  - Thứ 2: 8:00 - 22:00| Frontend | 5174 | http://localhost:5174 |

  - Thứ 3: 8:00 - 22:00

  - ...| Admin Panel | 5175 | http://localhost:5175 |git clone https://github.com/Phamtinhicic/food_delivery_main.git![Cart](https://i.ibb.co/t2LrQ8p/food-cart.png)

  - Chủ nhật: Nghỉ / Custom

| Restaurant Panel | 5176 | http://localhost:5176 |

**Thống kê nhanh:**

- 📦 Đơn hôm nay| MongoDB | 27018 | mongodb://localhost:27018 |# Frontend (terminal mới)

- 🍽️ Món đang bán

- 💰 Doanh thu



------cd frontendcd food_delivery_main- Cart Page



## 📋 Tính năng chi tiết



### 🔐 Authentication & Authorization## 🔐 Biến môi trường (.env)npm install



**JWT Token Based:**

- Token được tạo khi login

- Lưu trong localStorage```envnpm run dev

- Gửi kèm mỗi API request (Authorization header)

- Expire sau X giờ (config trong .env)# MongoDB



**Password Security:**MONGO_URI=mongodb://mongodb:27017/FoodDelivery

- Hash với Bcrypt

- SALT từ .env

- Không lưu plain text password

# JWT# Admin (terminal mới)# Tạo file .env![Login](https://i.ibb.co/s6PgwkZ/food-login.png)

**Role-Based Access:**

- `user` → Chỉ FrontendJWT_SECRET=your_secret_key_here

- `admin` → Admin Panel (full quyền)

- `restaurant` → Restaurant PanelSALT=10cd admin



### 💳 Payment Integration



**Stripe Payment:**# Backendnpm installcopy .env.example .env- Login Popup

- Tích hợp Stripe Checkout

- Flow:PORT=4000

  1. User chọn "Pay with Stripe"

  2. Redirect đến Stripe Checkout pagenpm run dev

  3. Nhập thông tin thẻ

  4. Stripe xử lý payment# Stripe (https://stripe.com)

  5. Redirect về `/verify?success=true`

  6. Backend verify paymentSTRIPE_SECRET_KEY=sk_test_your_key_here

  7. Update order status

- Secure: Secret key lưu trong .env```



**Cash on Delivery (COD):**# Restaurant (terminal mới)

- Thanh toán khi nhận hàng

- Không cần xử lý payment trước---

- Order status: payment = false

cd restaurant# Chỉnh sửa .env với các giá trị của bạn## Run Locally

### 📤 File Upload

## 📚 Tài liệu

**Multer Middleware:**

- Upload ảnh món ănnpm install

- Lưu tại `/uploads` folder

- Access qua `/images/<filename>`- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết, xử lý lỗi, quản lý database

- Validation: file type, size

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Tổng quan kiến trúc hệ thốngnpm run dev# JWT_SECRET, STRIPE_SECRET_KEY, etc.

### 🔄 Real-time Updates

- **[restaurant/README.md](restaurant/README.md)** - Chi tiết về Restaurant Panel

**Polling Strategy:**

- Frontend auto-fetch orders mỗi 10 giây- **[docs/food-delivery-erd-updated.puml](docs/food-delivery-erd-updated.puml)** - ERD diagram```

- Restaurant Panel auto-refresh 10 giây

- User thấy status update ngay



**Future:** Có thể nâng cấp lên WebSocket---Clone the project



---



## 🚀 Bắt đầu nhanh## 🐛 Xử lý lỗi thường gặp**Chi tiết hướng dẫn:** Xem [SETUP_GUIDE.md](SETUP_GUIDE.md)



### Yêu cầu hệ thống



- **Docker Desktop** (Khuyến nghị - dễ nhất)### Lỗi JWT "invalid signature"# Chạy tất cả services

- HOẶC **Node.js 18+** và **MongoDB 6.0+** (chạy manual)

```javascript

### Cài đặt với Docker (Khuyến nghị)

// Mở Console (F12) và chạy:## 🏗️ Cấu trúc dự án

```bash

# 1. Clone projectlocalStorage.clear();

git clone https://github.com/Phamtinhicic/food_delivery_main.git

cd food_delivery_mainlocation.reload();docker-compose up -d```bash



# 2. Tạo file .env// Sau đó đăng nhập lại

copy .env.example .env

``````

# 3. Sửa .env với thông tin của bạn

# JWT_SECRET, STRIPE_SECRET_KEY, etc.



# 4. Chạy tất cả services### Không thấy thay đổi sau khi updatefood_delivery_main/    git clone https://github.com/Mshandev/Food-Delivery

docker-compose up -d

```

# 5. Đợi ~30 giây để services khởi động

```Ctrl + Shift + R      // Hard refresh (Windows/Linux)├── frontend/          # React app cho khách hàng (port 5174)



**Truy cập:**Cmd + Shift + R       // Hard refresh (Mac)

- 👥 **Frontend:** http://localhost:5174

- ⚙️ **Admin:** http://localhost:5175  // Hoặc F12 → Network → tick "Disable cache" → Reload├── admin/             # React app cho admin (port 5175)# Đợi ~30 giây để services khởi động```

- 🏪 **Restaurant:** http://localhost:5176

- 🔧 **API:** http://localhost:4000```



**Tài khoản Admin mặc định:**├── restaurant/        # React app cho nhà hàng (port 5176)

- Email: `admin@example.com`

- Password: `AdminPass123`### Port đã được sử dụng



### Cài đặt thủ công```powershell├── backend/           # Node.js + Express API (port 4000)```Go to the project directory



Xem hướng dẫn chi tiết tại [SETUP_GUIDE.md](SETUP_GUIDE.md)# Windows - Tìm process đang dùng port



---netstat -ano | findstr :4000├── .github/           # CI/CD workflows



## 🏗️ Cấu trúc dự ántaskkill /PID <PID> /F



``````├── docker-compose.yml # Docker orchestration

food_delivery_main/

├── frontend/          # React app - Giao diện Khách hàng

│   ├── src/

│   │   ├── pages/     # Home, Cart, PlaceOrder, MyOrders, Verify### Docker không chạy├── README.md          # File này

│   │   ├── components/# Navbar, Header, FoodDisplay, FoodItem, etc.

│   │   └── context/   # StoreContext (global state)```bash

│   └── package.json

│# Kiểm tra Docker└── SETUP_GUIDE.md     # Hướng dẫn chi tiết**Truy cập:**```bash

├── admin/             # React app - Giao diện Admin

│   ├── src/docker --version

│   │   ├── pages/     # Add, List, Orders, Users, Dashboard

│   │   ├── components/# Navbar, Sidebar, Logindocker ps```

│   │   └── context/   # StoreContext

│   └── package.json

│

├── restaurant/        # React app - Giao diện Nhà hàng# Restart Docker Desktop- 👥 **Frontend (Khách hàng):** http://localhost:5174    cd Food-Delivery

│   ├── src/

│   │   ├── pages/     # Dashboard, OrderManagement, MenuManagement, StoreManagement```

│   │   ├── components/# Navbar, Sidebar, ProtectedRoute

│   │   └── context/   # StoreContext## 🔧 Tech Stack

│   └── package.json

│**Xem thêm:** [SETUP_GUIDE.md](SETUP_GUIDE.md) phần "Giải quyết lỗi thường gặp"

├── backend/           # Node.js + Express API

│   ├── controllers/   # Business logic- ⚙️ **Admin Panel:** http://localhost:5175  ```

│   ├── models/        # Mongoose schemas (User, Food, Order)

│   ├── routes/        # API routes---

│   ├── middleware/    # auth.js (JWT verification)

│   ├── uploads/       # Uploaded images### Frontend

│   └── server.js      # Entry point

│## 🎯 Workflow phát triển

├── docs/              # Documentation

│   ├── food-delivery-erd-updated.puml  # ERD diagram- **Framework:** React 18 với Vite- 🏪 **Restaurant Panel:** http://localhost:5176Install dependencies (frontend)

│   └── README.md      # Docs index

│```bash

├── .github/workflows/ # CI/CD (GitHub Actions)

├── docker-compose.yml # Docker orchestration# 1. Tạo branch mới- **Routing:** React Router DOM v6

├── README.md          # File này

└── SETUP_GUIDE.md     # Hướng dẫn cài đặt chi tiếtgit checkout -b feature/new-feature

```

- **HTTP Client:** Axios- 🔧 **Backend API:** http://localhost:4000

---

# 2. Code và test

## 🔧 Tech Stack

npm run dev- **Styling:** CSS3 (custom)

### Frontend (3 Apps)

| Tech | Purpose |

|------|---------|

| React 18 | UI Library |# 3. Commit changes- **Notifications:** React Toastify```bash

| Vite | Build tool (fast!) |

| React Router DOM v6 | Client-side routing |git add .

| Axios | HTTP requests |

| CSS3 | Styling (custom) |git commit -m "Add new feature"- **Payment:** Stripe

| React Toastify | Notifications |

| Stripe.js | Payment |



### Backend# 4. Push to GitHub**Tài khoản Admin mặc định:**    cd frontend

| Tech | Purpose |

|------|---------|git push origin feature/new-feature

| Node.js 18+ | Runtime |

| Express.js | Web framework |### Backend

| MongoDB | NoSQL Database |

| Mongoose | ODM (Object Data Modeling) |# 5. Tạo Pull Request

| JWT | Authentication |

| Bcrypt | Password hashing |# GitHub Actions sẽ tự động build và test- **Runtime:** Node.js 18+- Email: `admin@example.com`    npm install

| Multer | File upload |

| Stripe SDK | Payment processing |```

| Dotenv | Environment variables |

- **Framework:** Express.js

### DevOps

| Tech | Purpose |---

|------|---------|

| Docker | Containerization |- **Database:** MongoDB với Mongoose- Password: `AdminPass123````

| Docker Compose | Multi-container orchestration |

| Nginx | Web server (in containers) |## 📦 Docker Commands

| GitHub Actions | CI/CD pipeline |

- **Authentication:** JWT (jsonwebtoken)

---

```bash

## 📊 Database Schema (ERD)

# Chạy tất cả- **Password:** BcryptInstall dependencies (admin)

Xem chi tiết tại [docs/food-delivery-erd-updated.puml](docs/food-delivery-erd-updated.puml)

docker-compose up -d

**3 Collections chính:**

- **File Upload:** Multer

### 1. Users

```javascript# Xem logs

{

  _id: ObjectId,docker-compose logs -f- **CORS:** Enabled### Cài đặt thủ công (Không dùng Docker)

  name: String,

  email: String (unique),docker-compose logs -f backend

  password: String (bcrypt hashed),

  role: String ("user" | "admin" | "restaurant"),

  cartData: Object, // { foodId: quantity }

  createdAt: Date,# Dừng tất cả

  updatedAt: Date

}docker-compose down### DevOps```bash

```



### 2. Foods

```javascript# Rebuild một service- **Containerization:** Docker + Docker Compose

{

  _id: ObjectId,docker-compose build admin

  name: String,

  description: String,docker-compose up -d admin- **CI/CD:** GitHub Actions**Yêu cầu:** Node.js 18+, MongoDB 6.0+    cd admin

  price: Number,

  image: String,

  category: String, // Salad, Rolls, etc.

  createdAt: Date,# Reset database- **Web Server:** Nginx (trong Docker)

  updatedAt: Date

}docker-compose down -v

```

```- **Database:** MongoDB (Docker volume)    npm install

### 3. Orders

```javascript

{

  _id: ObjectId,---

  userId: String,

  items: Array[{ foodId, quantity, name, price }],

  amount: Number,

  address: Object,## 🆕 Cập nhật mới nhất## 📊 Ports & Services```bash```

  status: String, // "Food Processing" | "Out for delivery" | "Delivered"

  date: Date,

  payment: Boolean,

  paymentMethod: String, // "cod" | "stripe"### Version 2.1 (October 2025)

  stripeSessionId: String

}- ✅ Cải thiện UX cho Restaurant Panel

```

- ✅ Thêm tính năng toggle ON/OFF món 1 click| Service | Port | URL |# BackendInstall dependencies (backend)

---

- ✅ Thêm âm thanh thông báo lặp lại cho đơn mới

## 📦 API Endpoints

- ✅ Cải thiện filter menu với nút "Tất cả món" và "Xóa bộ lọc"|---------|------|-----|

### 🔐 Authentication

```- ✅ Thêm quản lý cửa hàng (đóng/mở, giờ hoạt động)

POST /api/user/register  - Đăng ký

POST /api/user/login     - Đăng nhập- ✅ Cập nhật ERD diagram phù hợp với source code thực tế| Backend API | 4000 | http://localhost:4000 |cd backend

```

- ✅ Làm sạch documentation, loại bỏ thông tin duplicate

### 🍽️ Foods

```| Frontend | 5174 | http://localhost:5174 |

GET    /api/food/list    - Lấy danh sách món

POST   /api/food/add     - Thêm món (Admin)---

POST   /api/food/remove  - Xóa món (Admin)

```| Admin Panel | 5175 | http://localhost:5175 |npm install```bash



### 🛒 Cart## 🤝 Contributing

```

POST /api/cart/add    - Thêm vào giỏ| Restaurant Panel | 5176 | http://localhost:5176 |

POST /api/cart/remove - Xóa khỏi giỏ

GET  /api/cart/get    - Lấy giỏ hàngContributions are welcome! 

```

| MongoDB | 27018 | mongodb://localhost:27018 |npm start    cd backend

### 📦 Orders

```1. Fork repo này

POST /api/order/place       - Đặt hàng

POST /api/order/verify      - Verify Stripe payment2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)

GET  /api/order/userorders  - Đơn của user

GET  /api/order/list        - Tất cả đơn (Admin/Restaurant)3. Commit changes (`git commit -m 'Add some AmazingFeature'`)

POST /api/order/status      - Cập nhật trạng thái

```4. Push to branch (`git push origin feature/AmazingFeature`)## 🔐 Biến môi trường (.env)    npm install



---5. Mở Pull Request



## 🐛 Troubleshooting



### Lỗi JWT "invalid signature"---

```javascript

// F12 Console:```env# Frontend (terminal mới)```

localStorage.clear();

location.reload();## 📄 License

// Đăng nhập lại

```# MongoDB



### Port đã được sử dụngMIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết

```powershell

netstat -ano | findstr :4000MONGO_URI=mongodb://mongodb:27017/FoodDeliverycd frontendSetup Environment Vaiables

taskkill /PID <PID> /F

```---



### Docker không chạy

```bash

docker --version## 👤 Author

docker ps

# Restart Docker Desktop# JWTnpm install

```

**Phamtinhicic**

Xem thêm: [SETUP_GUIDE.md](SETUP_GUIDE.md)

- GitHub: [@Phamtinhicic](https://github.com/Phamtinhicic)JWT_SECRET=your_secret_key_here

---

- Repository: [food_delivery_main](https://github.com/Phamtinhicic/food_delivery_main)

## 📚 Tài liệu

SALT=10npm run dev```Make .env file in "backend" folder and store environment Variables

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Cài đặt chi tiết, troubleshooting

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Kiến trúc 3 panels---

- **[restaurant/README.md](restaurant/README.md)** - Chi tiết Restaurant Panel

- **[docs/](docs/)** - ERD, Component diagrams, CI/CD analysis



---## 📞 Support



## 🆕 Version History# Backend  JWT_SECRET=YOUR_SECRET_TEXT



### Version 2.1 (October 2025)Nếu gặp vấn đề:

- ✅ Restaurant Panel: Toggle ON/OFF món 1 click

- ✅ Restaurant Panel: Kanban board với âm thanh thông báo1. Kiểm tra [SETUP_GUIDE.md](SETUP_GUIDE.md)PORT=4000

- ✅ Restaurant Panel: Quản lý cửa hàng (đóng/mở)

- ✅ Filter menu: Nút "Tất cả món" và "Xóa bộ lọc"2. Xem [Issues](https://github.com/Phamtinhicic/food_delivery_main/issues)

- ✅ Cập nhật ERD phù hợp source code

- ✅ Làm sạch documentation3. Tạo Issue mới với mô tả chi tiết# Admin (terminal mới)  SALT=YOUR_SALT_VALUE



### Version 2.0

- 3 giao diện hoàn chỉnh

- Stripe payment integration---# Stripe (https://stripe.com)

- JWT authentication

- Docker support



---**Made with ❤️ using MERN Stack**STRIPE_SECRET_KEY=sk_test_your_key_herecd admin  MONGO_URL=YOUR_DATABASE_URL



## 🤝 Contributing

```

Contributions are welcome!

npm install  STRIPE_SECRET_KEY=YOUR_KEY

1. Fork repo

2. Create branch (`git checkout -b feature/AmazingFeature`)## 📚 Tài liệu

3. Commit (`git commit -m 'Add AmazingFeature'`)

4. Push (`git push origin feature/AmazingFeature`)npm run dev ```

5. Open Pull Request

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết, xử lý lỗi, quản lý database

---

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Tổng quan kiến trúc hệ thống

## 📄 License

- **[restaurant/README.md](restaurant/README.md)** - Chi tiết về Restaurant Panel

MIT License - See [LICENSE](LICENSE)

- **[DOCS_CLEANUP.md](DOCS_CLEANUP.md)** - Lịch sử cleanup documentation# Restaurant (terminal mới)Setup the Frontend and Backend URL

---



## 👤 Author

## 🐛 Xử lý lỗi thường gặpcd restaurant   - App.jsx in Admin folder

**Phamtinhicic**

- GitHub: [@Phamtinhicic](https://github.com/Phamtinhicic)

- Repository: [food_delivery_main](https://github.com/Phamtinhicic/food_delivery_main)

### Lỗi JWT "invalid signature"npm install      const url = YOUR_BACKEND_URL

---

```javascript

## 📞 Support

// Mở Console (F12) và chạy:npm run dev     

Gặp vấn đề?

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)localStorage.clear();

2. Search [Issues](https://github.com/Phamtinhicic/food_delivery_main/issues)

3. Create new Issuelocation.reload();```  - StoreContext.js in Frontend folder



---// Sau đó đăng nhập lại



<div align="center">```      const url = YOUR_BACKEND_URL



**Made with ❤️ using MERN Stack**



⭐ Star this repo if you find it helpful!### Không thấy thay đổi sau khi update**Chi tiết hướng dẫn:** Xem [SETUP_GUIDE.md](SETUP_GUIDE.md)



</div>```


Ctrl + Shift + R      // Hard refresh (Windows/Linux)  - orderController in Backend folder

Cmd + Shift + R       // Hard refresh (Mac)

## 🏗️ Cấu trúc dự án      const frontend_url = YOUR_FRONTEND_URL 

// Hoặc F12 → Network → tick "Disable cache" → Reload

```



### Port đã được sử dụng```Start the Backend server

```powershell

# Windows - Tìm process đang dùng portfood_delivery_main/

netstat -ano | findstr :4000

taskkill /PID <PID> /F├── frontend/          # React app cho khách hàng (port 5174)```bash

```

├── admin/             # React app cho admin (port 5175)    nodemon server.js

### Docker không chạy

```bash├── restaurant/        # React app cho nhà hàng (port 5176)```

# Kiểm tra Docker

docker --version├── backend/           # Node.js + Express API (port 4000)

docker ps

├── .github/           # CI/CD workflowsStart the Frontend server

# Restart Docker Desktop

```├── docker-compose.yml # Docker orchestration



**Xem thêm:** [SETUP_GUIDE.md](SETUP_GUIDE.md) phần "Giải quyết lỗi thường gặp"├── README.md          # File này```bash



## 🎯 Workflow phát triển└── SETUP_GUIDE.md     # Hướng dẫn chi tiết    npm start



```bash``````

# 1. Tạo branch mới

git checkout -b feature/new-feature



# 2. Code và test## 🔧 Tech StackStart the Backend server

npm run dev



# 3. Commit changes

git add .### Frontend```bash

git commit -m "Add new feature"

- **Framework:** React 18 với Vite    npm start

# 4. Push to GitHub

git push origin feature/new-feature- **Routing:** React Router DOM v6```



# 5. Tạo Pull Request- **HTTP Client:** Axios## Tech Stack

# GitHub Actions sẽ tự động build và test

```- **Styling:** CSS3 (custom)* [React](https://reactjs.org/)



## 📦 Docker Commands- **Notifications:** React Toastify* [Node.js](https://nodejs.org/en)



```bash- **Payment:** Stripe* [Express.js](https://expressjs.com/)

# Chạy tất cả

docker-compose up -d* [Mongodb](https://www.mongodb.com/)



# Xem logs### Backend* [Stripe](https://stripe.com/)

docker-compose logs -f

docker-compose logs -f backend- **Runtime:** Node.js 18+* [JWT-Authentication](https://jwt.io/introduction)



# Dừng tất cả- **Framework:** Express.js* [Multer](https://www.npmjs.com/package/multer)

docker-compose down

- **Database:** MongoDB với Mongoose

# Rebuild một service

docker-compose build admin- **Authentication:** JWT (jsonwebtoken)## Deployment

docker-compose up -d admin

- **Password:** Bcrypt

# Reset database

docker-compose down -v- **File Upload:** MulterThe application is deployed on Render.

```

- **CORS:** Enabled

## 🆕 Cập nhật mới nhất

## Contributing

### Version 2.1 (October 20, 2025)

- ✅ Thêm nút "🍽️ All" gradient đẹp vào Frontend để dễ quay lại tất cả món### DevOps

- ✅ Thêm nút "✕ Xóa bộ lọc" màu đỏ vào Restaurant Panel

- ✅ Làm nổi bật nút "Tất cả món" với viền xanh lá trong Restaurant- **Containerization:** Docker + Docker ComposeContributions are always welcome!

- ✅ Xóa tính năng "Quản lý Cửa hàng" khỏi Restaurant Panel

- ✅ Xóa tính năng Toggle Status khỏi Admin Panel- **CI/CD:** GitHub ActionsJust raise an issue, and we will discuss it.

- ✅ Cải thiện UX: Dễ dàng quay lại xem tất cả món sau khi lọc

- ✅ Dọn dẹp documentation: Giảm từ 13 files xuống 5 files .md- **Web Server:** Nginx (trong Docker)

- ✅ Merge 3 guides (Docker, Database, Fix) thành SETUP_GUIDE.md duy nhất

- **Database:** MongoDB (Docker volume)## Feedback

## 🤝 Contributing



Contributions are welcome! 

## 📊 Ports & ServicesIf you have any feedback, please reach out to me [here](https://www.linkedin.com/in/muhammad-shan-full-stack-developer/)

1. Fork repo này

2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)

3. Commit changes (`git commit -m 'Add some AmazingFeature'`)| Service | Port | URL |

4. Push to branch (`git push origin feature/AmazingFeature`)|---------|------|-----|

5. Mở Pull Request| Backend API | 4000 | http://localhost:4000 |

| Frontend | 5174 | http://localhost:5174 |

## 📄 License| Admin Panel | 5175 | http://localhost:5175 |

| Restaurant Panel | 5176 | http://localhost:5176 |

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết| MongoDB | 27018 | mongodb://localhost:27018 |



## 👤 Author## 🔐 Biến môi trường (.env)



**Phamtinhicic**```env

- GitHub: [@Phamtinhicic](https://github.com/Phamtinhicic)# MongoDB

- Repository: [food_delivery_main](https://github.com/Phamtinhicic/food_delivery_main)MONGO_URI=mongodb://mongodb:27017/FoodDelivery



## 📞 Support# JWT

JWT_SECRET=your_secret_key_here

Nếu gặp vấn đề:SALT=10

1. Kiểm tra [SETUP_GUIDE.md](SETUP_GUIDE.md)

2. Xem [Issues](https://github.com/Phamtinhicic/food_delivery_main/issues)# Backend

3. Tạo Issue mới với mô tả chi tiếtPORT=4000



---# Stripe (https://stripe.com)

STRIPE_SECRET_KEY=sk_test_your_key_here

**Made with ❤️ using MERN Stack**```


## 📚 Tài liệu

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết, xử lý lỗi, quản lý database
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Tổng quan kiến trúc hệ thống
- **[restaurant/README.md](restaurant/README.md)** - Chi tiết về Restaurant Panel

## 🐛 Xử lý lỗi thường gặp

### Lỗi JWT "invalid signature"
```javascript
// Mở Console (F12) và chạy:
localStorage.clear();
location.reload();
// Sau đó đăng nhập lại
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

## 🤝 Contributing

Contributions are welcome! 

1. Fork repo này
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết

## 👤 Author

**Phamtinhicic**
- GitHub: [@Phamtinhicic](https://github.com/Phamtinhicic)
- Repository: [food_delivery_main](https://github.com/Phamtinhicic/food_delivery_main)

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Xem [Issues](https://github.com/Phamtinhicic/food_delivery_main/issues)
3. Tạo Issue mới với mô tả chi tiết

---

**Made with ❤️ using MERN Stack**
