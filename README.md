# 🍕 Food Delivery System - Hệ thống Giao đồ ăn trực tuyến# TOMATO - Food Ordering Website



Hệ thống giao đồ ăn hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React, Node.js), bao gồm **3 giao diện riêng biệt** cho khách hàng, admin và nhà hàng.This repository hosts the source code for TOMATO, a dynamic food ordering website built with the MERN Stack. It offers a user-friendly platform for seamless online food ordering.



## 📋 Tính năng chính## Demo



### 👥 Frontend - Giao diện Khách hàng- User Panel: [https://food-delivery-frontend-s2l9.onrender.com/](https://food-delivery-frontend-s2l9.onrender.com/)

- 🏠 Trang chủ với danh sách món ăn- Admin Panel: [https://food-delivery-admin-wrme.onrender.com/](https://food-delivery-admin-wrme.onrender.com/)

- 🔍 Tìm kiếm và lọc món theo danh mục

- 🛒 Giỏ hàng và quản lý đơn hàng## Features

- 💳 Thanh toán online qua Stripe

- 📦 Theo dõi trạng thái đơn hàng real-time- User Panel

- 👤 Đăng ký/Đăng nhập với JWT authentication- Admin Panel

- JWT Authentication

### ⚙️ Admin Panel - Giao diện Quản trị- Password Hashing with Bcrypt

- 📊 Dashboard tổng quan (doanh thu, đơn hàng, thống kê)- Stripe Payment Integration

- ➕ Thêm/Sửa/Xóa món ăn- Login/Signup

- 📋 Quản lý danh sách món ăn- Logout

- 📦 Quản lý tất cả đơn hàng- Add to Cart

- 👥 Quản lý người dùng- Place Order

- 🔐 Phân quyền Admin- Order Management

- Products Management

### 🏪 Restaurant Panel - Giao diện Nhà hàng- Filter Food Products

- 📊 Dashboard thống kê riêng- Login/Signup

- 🍽️ Quản lý đơn hàng (Kanban board với 5 trạng thái)- Authenticated APIs

- 🔔 Thông báo đơn mới (có âm thanh)- REST APIs

- 🍴 Quản lý thực đơn (chỉ xem, không chỉnh sửa)- Role-Based Identification

- 🏪 Quản lý cửa hàng (bật/tắt nhận đơn)- Beautiful Alerts



## 🚀 Bắt đầu nhanh## Screenshots



### Cài đặt với Docker (Khuyến nghị)![Hero](https://i.ibb.co/59cwY75/food-hero.png)

- Hero Section

**Yêu cầu:** Docker Desktop đã cài đặt và đang chạy

![Products](https://i.ibb.co/JnNQPyQ/food-products.png)

```bash- Products Section

# Clone project

git clone https://github.com/Phamtinhicic/food_delivery_main.git![Cart](https://i.ibb.co/t2LrQ8p/food-cart.png)

cd food_delivery_main- Cart Page



# Tạo file .env![Login](https://i.ibb.co/s6PgwkZ/food-login.png)

copy .env.example .env- Login Popup



# Chỉnh sửa .env với các giá trị của bạn## Run Locally

# JWT_SECRET, STRIPE_SECRET_KEY, etc.

Clone the project

# Chạy tất cả services

docker-compose up -d```bash

    git clone https://github.com/Mshandev/Food-Delivery

# Đợi ~30 giây để services khởi động```

```Go to the project directory



**Truy cập:**```bash

- 👥 **Frontend (Khách hàng):** http://localhost:5174    cd Food-Delivery

- ⚙️ **Admin Panel:** http://localhost:5175  ```

- 🏪 **Restaurant Panel:** http://localhost:5176Install dependencies (frontend)

- 🔧 **Backend API:** http://localhost:4000

```bash

**Tài khoản Admin mặc định:**    cd frontend

- Email: `admin@example.com`    npm install

- Password: `AdminPass123````

Install dependencies (admin)

### Cài đặt thủ công (Không dùng Docker)

```bash

**Yêu cầu:** Node.js 18+, MongoDB 6.0+    cd admin

    npm install

```bash```

# BackendInstall dependencies (backend)

cd backend

npm install```bash

npm start    cd backend

    npm install

# Frontend (terminal mới)```

cd frontendSetup Environment Vaiables

npm install

npm run dev```Make .env file in "backend" folder and store environment Variables

  JWT_SECRET=YOUR_SECRET_TEXT

# Admin (terminal mới)  SALT=YOUR_SALT_VALUE

cd admin  MONGO_URL=YOUR_DATABASE_URL

npm install  STRIPE_SECRET_KEY=YOUR_KEY

npm run dev ```



# Restaurant (terminal mới)Setup the Frontend and Backend URL

cd restaurant   - App.jsx in Admin folder

npm install      const url = YOUR_BACKEND_URL

npm run dev     

```  - StoreContext.js in Frontend folder

      const url = YOUR_BACKEND_URL

**Chi tiết hướng dẫn:** Xem [SETUP_GUIDE.md](SETUP_GUIDE.md)

  - orderController in Backend folder

## 🏗️ Cấu trúc dự án      const frontend_url = YOUR_FRONTEND_URL 



```Start the Backend server

food_delivery_main/

├── frontend/          # React app cho khách hàng (port 5174)```bash

├── admin/             # React app cho admin (port 5175)    nodemon server.js

├── restaurant/        # React app cho nhà hàng (port 5176)```

├── backend/           # Node.js + Express API (port 4000)

├── .github/           # CI/CD workflowsStart the Frontend server

├── docker-compose.yml # Docker orchestration

├── README.md          # File này```bash

└── SETUP_GUIDE.md     # Hướng dẫn chi tiết    npm start

``````



## 🔧 Tech StackStart the Backend server



### Frontend```bash

- **Framework:** React 18 với Vite    npm start

- **Routing:** React Router DOM v6```

- **HTTP Client:** Axios## Tech Stack

- **Styling:** CSS3 (custom)* [React](https://reactjs.org/)

- **Notifications:** React Toastify* [Node.js](https://nodejs.org/en)

- **Payment:** Stripe* [Express.js](https://expressjs.com/)

* [Mongodb](https://www.mongodb.com/)

### Backend* [Stripe](https://stripe.com/)

- **Runtime:** Node.js 18+* [JWT-Authentication](https://jwt.io/introduction)

- **Framework:** Express.js* [Multer](https://www.npmjs.com/package/multer)

- **Database:** MongoDB với Mongoose

- **Authentication:** JWT (jsonwebtoken)## Deployment

- **Password:** Bcrypt

- **File Upload:** MulterThe application is deployed on Render.

- **CORS:** Enabled

## Contributing

### DevOps

- **Containerization:** Docker + Docker ComposeContributions are always welcome!

- **CI/CD:** GitHub ActionsJust raise an issue, and we will discuss it.

- **Web Server:** Nginx (trong Docker)

- **Database:** MongoDB (Docker volume)## Feedback



## 📊 Ports & ServicesIf you have any feedback, please reach out to me [here](https://www.linkedin.com/in/muhammad-shan-full-stack-developer/)


| Service | Port | URL |
|---------|------|-----|
| Backend API | 4000 | http://localhost:4000 |
| Frontend | 5174 | http://localhost:5174 |
| Admin Panel | 5175 | http://localhost:5175 |
| Restaurant Panel | 5176 | http://localhost:5176 |
| MongoDB | 27018 | mongodb://localhost:27018 |

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
