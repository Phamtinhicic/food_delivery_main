# 🍕 Food Delivery System - Hệ thống Giao đồ ăn trực tuyến# 🍕 Food Delivery System - Hệ thống Giao đồ ăn trực tuyến# TOMATO - Food Ordering Website



Hệ thống giao đồ ăn hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React, Node.js), bao gồm **3 giao diện riêng biệt** cho khách hàng, admin và nhà hàng.



## 📋 Tính năng chínhHệ thống giao đồ ăn hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React, Node.js), bao gồm **3 giao diện riêng biệt** cho khách hàng, admin và nhà hàng.This repository hosts the source code for TOMATO, a dynamic food ordering website built with the MERN Stack. It offers a user-friendly platform for seamless online food ordering.



### 👥 Frontend - Giao diện Khách hàng

- 🏠 Trang chủ với danh sách món ăn

- 🍽️ **Nút "All"** nổi bật để xem tất cả món (dễ quay lại sau khi lọc)## 📋 Tính năng chính## Demo

- 🔍 Lọc món theo 8 danh mục (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles)

- 🛒 Giỏ hàng và quản lý đơn hàng

- 💳 Thanh toán online qua Stripe

- 📦 Theo dõi trạng thái đơn hàng real-time### 👥 Frontend - Giao diện Khách hàng- User Panel: [https://food-delivery-frontend-s2l9.onrender.com/](https://food-delivery-frontend-s2l9.onrender.com/)

- 👤 Đăng ký/Đăng nhập với JWT authentication

- 🏠 Trang chủ với danh sách món ăn- Admin Panel: [https://food-delivery-admin-wrme.onrender.com/](https://food-delivery-admin-wrme.onrender.com/)

### ⚙️ Admin Panel - Giao diện Quản trị

- 📊 Dashboard tổng quan (doanh thu, đơn hàng, thống kê)- 🔍 Tìm kiếm và lọc món theo danh mục

- ➕ Thêm món ăn mới

- ✏️ Sửa món ăn (tên, giá, mô tả, ảnh, category)- 🛒 Giỏ hàng và quản lý đơn hàng## Features

- 🗑️ Xóa món ăn

- 📋 Quản lý danh sách món ăn- 💳 Thanh toán online qua Stripe

- 📦 Quản lý tất cả đơn hàng

- 👥 Quản lý người dùng- 📦 Theo dõi trạng thái đơn hàng real-time- User Panel

- 🔐 Phân quyền Admin

- 👤 Đăng ký/Đăng nhập với JWT authentication- Admin Panel

### 🏪 Restaurant Panel - Giao diện Nhà hàng

- 🍽️ Quản lý đơn hàng (Kanban board với 4 trạng thái)- JWT Authentication

- 🔔 Thông báo đơn mới (có âm thanh)

- 🍴 **Quản lý thực đơn** (chỉ xem, không chỉnh sửa)### ⚙️ Admin Panel - Giao diện Quản trị- Password Hashing with Bcrypt

- ✕ **Nút "Xóa bộ lọc"** màu đỏ để quay lại tất cả món

- 📋 **Nút "Tất cả món"** với viền xanh lá nổi bật- 📊 Dashboard tổng quan (doanh thu, đơn hàng, thống kê)- Stripe Payment Integration



## 🚀 Bắt đầu nhanh- ➕ Thêm/Sửa/Xóa món ăn- Login/Signup



### Cài đặt với Docker (Khuyến nghị)- 📋 Quản lý danh sách món ăn- Logout



**Yêu cầu:** Docker Desktop đã cài đặt và đang chạy- 📦 Quản lý tất cả đơn hàng- Add to Cart



```bash- 👥 Quản lý người dùng- Place Order

# Clone project

git clone https://github.com/Phamtinhicic/food_delivery_main.git- 🔐 Phân quyền Admin- Order Management

cd food_delivery_main

- Products Management

# Tạo file .env

copy .env.example .env### 🏪 Restaurant Panel - Giao diện Nhà hàng- Filter Food Products



# Chỉnh sửa .env với các giá trị của bạn- 📊 Dashboard thống kê riêng- Login/Signup

# JWT_SECRET, STRIPE_SECRET_KEY, etc.

- 🍽️ Quản lý đơn hàng (Kanban board với 5 trạng thái)- Authenticated APIs

# Chạy tất cả services

docker-compose up -d- 🔔 Thông báo đơn mới (có âm thanh)- REST APIs



# Đợi ~30 giây để services khởi động- 🍴 Quản lý thực đơn (chỉ xem, không chỉnh sửa)- Role-Based Identification

```

- 🏪 Quản lý cửa hàng (bật/tắt nhận đơn)- Beautiful Alerts

**Truy cập:**

- 👥 **Frontend (Khách hàng):** http://localhost:5174

- ⚙️ **Admin Panel:** http://localhost:5175  

- 🏪 **Restaurant Panel:** http://localhost:5176## 🚀 Bắt đầu nhanh## Screenshots

- 🔧 **Backend API:** http://localhost:4000



**Tài khoản Admin mặc định:**

- Email: `admin@example.com`### Cài đặt với Docker (Khuyến nghị)![Hero](https://i.ibb.co/59cwY75/food-hero.png)

- Password: `AdminPass123`

- Hero Section

### Cài đặt thủ công (Không dùng Docker)

**Yêu cầu:** Docker Desktop đã cài đặt và đang chạy

**Yêu cầu:** Node.js 18+, MongoDB 6.0+

![Products](https://i.ibb.co/JnNQPyQ/food-products.png)

```bash

# Backend```bash- Products Section

cd backend

npm install# Clone project

npm start

git clone https://github.com/Phamtinhicic/food_delivery_main.git![Cart](https://i.ibb.co/t2LrQ8p/food-cart.png)

# Frontend (terminal mới)

cd frontendcd food_delivery_main- Cart Page

npm install

npm run dev



# Admin (terminal mới)# Tạo file .env![Login](https://i.ibb.co/s6PgwkZ/food-login.png)

cd admin

npm installcopy .env.example .env- Login Popup

npm run dev



# Restaurant (terminal mới)

cd restaurant# Chỉnh sửa .env với các giá trị của bạn## Run Locally

npm install

npm run dev# JWT_SECRET, STRIPE_SECRET_KEY, etc.

```

Clone the project

**Chi tiết hướng dẫn:** Xem [SETUP_GUIDE.md](SETUP_GUIDE.md)

# Chạy tất cả services

## 🏗️ Cấu trúc dự án

docker-compose up -d```bash

```

food_delivery_main/    git clone https://github.com/Mshandev/Food-Delivery

├── frontend/          # React app cho khách hàng (port 5174)

├── admin/             # React app cho admin (port 5175)# Đợi ~30 giây để services khởi động```

├── restaurant/        # React app cho nhà hàng (port 5176)

├── backend/           # Node.js + Express API (port 4000)```Go to the project directory

├── .github/           # CI/CD workflows

├── docker-compose.yml # Docker orchestration

├── README.md          # File này

└── SETUP_GUIDE.md     # Hướng dẫn chi tiết**Truy cập:**```bash

```

- 👥 **Frontend (Khách hàng):** http://localhost:5174    cd Food-Delivery

## 🔧 Tech Stack

- ⚙️ **Admin Panel:** http://localhost:5175  ```

### Frontend

- **Framework:** React 18 với Vite- 🏪 **Restaurant Panel:** http://localhost:5176Install dependencies (frontend)

- **Routing:** React Router DOM v6

- **HTTP Client:** Axios- 🔧 **Backend API:** http://localhost:4000

- **Styling:** CSS3 (custom)

- **Notifications:** React Toastify```bash

- **Payment:** Stripe

**Tài khoản Admin mặc định:**    cd frontend

### Backend

- **Runtime:** Node.js 18+- Email: `admin@example.com`    npm install

- **Framework:** Express.js

- **Database:** MongoDB với Mongoose- Password: `AdminPass123````

- **Authentication:** JWT (jsonwebtoken)

- **Password:** BcryptInstall dependencies (admin)

- **File Upload:** Multer

- **CORS:** Enabled### Cài đặt thủ công (Không dùng Docker)



### DevOps```bash

- **Containerization:** Docker + Docker Compose

- **CI/CD:** GitHub Actions**Yêu cầu:** Node.js 18+, MongoDB 6.0+    cd admin

- **Web Server:** Nginx (trong Docker)

- **Database:** MongoDB (Docker volume)    npm install



## 📊 Ports & Services```bash```



| Service | Port | URL |# BackendInstall dependencies (backend)

|---------|------|-----|

| Backend API | 4000 | http://localhost:4000 |cd backend

| Frontend | 5174 | http://localhost:5174 |

| Admin Panel | 5175 | http://localhost:5175 |npm install```bash

| Restaurant Panel | 5176 | http://localhost:5176 |

| MongoDB | 27018 | mongodb://localhost:27018 |npm start    cd backend



## 🔐 Biến môi trường (.env)    npm install



```env# Frontend (terminal mới)```

# MongoDB

MONGO_URI=mongodb://mongodb:27017/FoodDeliverycd frontendSetup Environment Vaiables



# JWTnpm install

JWT_SECRET=your_secret_key_here

SALT=10npm run dev```Make .env file in "backend" folder and store environment Variables



# Backend  JWT_SECRET=YOUR_SECRET_TEXT

PORT=4000

# Admin (terminal mới)  SALT=YOUR_SALT_VALUE

# Stripe (https://stripe.com)

STRIPE_SECRET_KEY=sk_test_your_key_herecd admin  MONGO_URL=YOUR_DATABASE_URL

```

npm install  STRIPE_SECRET_KEY=YOUR_KEY

## 📚 Tài liệu

npm run dev ```

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết, xử lý lỗi, quản lý database

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Tổng quan kiến trúc hệ thống

- **[restaurant/README.md](restaurant/README.md)** - Chi tiết về Restaurant Panel

- **[DOCS_CLEANUP.md](DOCS_CLEANUP.md)** - Lịch sử cleanup documentation# Restaurant (terminal mới)Setup the Frontend and Backend URL



## 🐛 Xử lý lỗi thường gặpcd restaurant   - App.jsx in Admin folder



### Lỗi JWT "invalid signature"npm install      const url = YOUR_BACKEND_URL

```javascript

// Mở Console (F12) và chạy:npm run dev     

localStorage.clear();

location.reload();```  - StoreContext.js in Frontend folder

// Sau đó đăng nhập lại

```      const url = YOUR_BACKEND_URL



### Không thấy thay đổi sau khi update**Chi tiết hướng dẫn:** Xem [SETUP_GUIDE.md](SETUP_GUIDE.md)

```

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
