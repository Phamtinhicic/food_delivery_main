# 🏗️ KIẾN TRÚC HỆ THỐNG 3 TẦNG (3-TIER ARCHITECTURE)

## ✅ HỆ THỐNG ĐÚNG CHUẨN 3 TẦNG!

```
┌─────────────────────────────────────────────────────────┐
│  TẦNG 1: PRESENTATION LAYER (Giao diện người dùng)    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📱 frontend/      → Khách hàng (React + Vite)         │
│  🏪 restaurant/    → Nhà hàng (React + Vite)           │
│  ⚙️  admin/         → Quản trị (React + Vite)           │
│                                                          │
│  - Port: 5173, 5174, 5175                              │
│  - Chỉ xử lý UI/UX                                     │
│  - Gọi API từ Backend qua HTTP                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│  TẦNG 2: BUSINESS LOGIC LAYER (Xử lý nghiệp vụ)      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔧 backend/                                            │
│     ├── server.js           → Express server           │
│     ├── routes/             → API endpoints            │
│     │   ├── userRoute.js    → /api/user/*             │
│     │   ├── foodRoute.js    → /api/food/*             │
│     │   ├── cartRoute.js    → /api/cart/*             │
│     │   └── orderRoute.js   → /api/order/*            │
│     │                                                   │
│     ├── controllers/        → Business logic           │
│     │   ├── userController.js    → Auth, user mgmt    │
│     │   ├── foodController.js    → Food operations    │
│     │   ├── cartController.js    → Cart logic         │
│     │   └── orderController.js   → Order processing   │
│     │                                                   │
│     └── middleware/         → Authentication           │
│         └── auth.js         → JWT verification         │
│                                                          │
│  - Port: 4000                                           │
│  - Xử lý logic nghiệp vụ                               │
│  - Validate dữ liệu                                     │
│  - Authorization/Authentication                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────┐
│  TẦNG 3: DATA ACCESS LAYER (Truy cập dữ liệu)        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  💾 backend/                                            │
│     ├── config/                                         │
│     │   └── db.js          → MongoDB connection        │
│     │                                                   │
│     └── models/             → Database schemas         │
│         ├── userModel.js    → User schema              │
│         ├── foodModel.js    → Food schema              │
│         └── orderModel.js   → Order schema             │
│                                                          │
│  🗄️  MongoDB Database                                   │
│     - Connection: mongoose.connect()                    │
│     - Collections: users, foods, orders                 │
│     - CRUD operations through Mongoose                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 CHI TIẾT TỪNG TẦNG

### TẦNG 1: PRESENTATION (3 ứng dụng React)

**Nhiệm vụ**: Hiển thị giao diện, nhận input người dùng

| App | Mô tả | Người dùng |
|-----|-------|-----------|
| `frontend/` | Đặt món, xem menu, thanh toán | Khách hàng |
| `restaurant/` | Quản lý món ăn, xem đơn hàng | Nhà hàng |
| `admin/` | Quản trị toàn hệ thống | Admin |

**Đặc điểm**:
- ✅ Không chứa business logic
- ✅ Không kết nối trực tiếp database
- ✅ Gọi API qua `fetch()` hoặc `axios`
- ✅ Handle UI state (React state management)

---

### TẦNG 2: BUSINESS LOGIC (Express.js Backend)

**Nhiệm vụ**: Xử lý nghiệp vụ, validate, authorization

#### A. Routes (API Endpoints)
```javascript
// routes/userRoute.js
POST   /api/user/register    → Đăng ký
POST   /api/user/login       → Đăng nhập
POST   /api/user/admin       → Tạo admin

// routes/foodRoute.js
POST   /api/food/add         → Thêm món (admin)
GET    /api/food/list        → Danh sách món
DELETE /api/food/remove      → Xóa món (admin)

// routes/cartRoute.js
POST   /api/cart/add         → Thêm vào giỏ
POST   /api/cart/remove      → Xóa khỏi giỏ
GET    /api/cart/get         → Lấy giỏ hàng

// routes/orderRoute.js
POST   /api/order/place      → Đặt hàng
GET    /api/order/userorders → Đơn hàng user
GET    /api/order/list       → Tất cả đơn (admin)
POST   /api/order/status     → Cập nhật status
```

#### B. Controllers (Business Logic)
```javascript
// controllers/userController.js
- Validate email, password
- Hash password (bcrypt)
- Generate JWT token
- Check admin role

// controllers/foodController.js
- Upload image (Cloudinary)
- Validate food data
- Check admin permission

// controllers/orderController.js
- Calculate total amount
- Verify payment (Stripe)
- Update order status
- Send notifications
```

#### C. Middleware
```javascript
// middleware/auth.js
- Verify JWT token
- Check user authentication
- Attach user to request
```

**Đặc điểm**:
- ✅ Xử lý toàn bộ business logic
- ✅ Validate input data
- ✅ Authorization (ai được làm gì)
- ✅ Gọi Models để CRUD database
- ❌ Không chứa SQL/MongoDB queries trực tiếp

---

### TẦNG 3: DATA ACCESS (MongoDB + Mongoose)

**Nhiệm vụ**: Quản lý database, định nghĩa schema

#### A. Database Connection
```javascript
// config/db.js
export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
}
```

#### B. Models (Database Schemas)

**userModel.js**:
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  cartData: Object
}
```

**foodModel.js**:
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String
}
```

**orderModel.js**:
```javascript
{
  userId: ObjectId,
  items: Array,
  amount: Number,
  address: Object,
  status: String,
  date: Date,
  payment: Boolean
}
```

**Đặc điểm**:
- ✅ Định nghĩa cấu trúc dữ liệu (schema)
- ✅ Cung cấp methods để CRUD
- ✅ Validate data types
- ✅ Relationships (populate, references)
- ❌ Không chứa business logic

---

## 🎯 PHÂN TÁCH TRÁCH NHIỆM (Separation of Concerns)

| Tầng | Trách nhiệm | Không làm |
|------|------------|-----------|
| **Presentation** | UI/UX, hiển thị | ❌ Business logic<br>❌ Database access |
| **Business Logic** | Xử lý nghiệp vụ, validate | ❌ Render UI<br>❌ Direct database queries |
| **Data Access** | CRUD, schema | ❌ Business rules<br>❌ Authentication |

---

## ✅ LỢI ÍCH KIẾN TRÚC 3 TẦNG

### 1. **Maintainability** (Dễ bảo trì)
- Thay đổi UI không ảnh hưởng backend
- Đổi database không ảnh hưởng business logic

### 2. **Scalability** (Dễ mở rộng)
- Frontend và Backend deploy riêng
- Có thể thêm nhiều frontend (mobile app, desktop)
- Backend có thể scale horizontal

### 3. **Testability** (Dễ test)
- Test unit cho controllers (không cần database)
- Test integration cho API endpoints
- Mock database layer khi test business logic

### 4. **Reusability** (Tái sử dụng)
- API backend dùng chung cho 3 frontend
- Models dùng chung cho tất cả controllers

### 5. **Security** (Bảo mật)
- Frontend không kết nối trực tiếp database
- Business logic validate mọi request
- Middleware xác thực trước khi vào controller

---

## 🧪 TEST STRUCTURE (Theo 3 tầng)

```
tests/
├── unit/                    # Test tầng Business Logic
│   ├── userController.unit.test.js
│   ├── foodController.unit.test.js
│   ├── cartController.unit.test.js
│   └── orderController.unit.test.js
│
├── integration/             # Test tầng Presentation ↔ Business
│   ├── user.integration.test.js
│   ├── food.integration.test.js
│   ├── cart.integration.test.js
│   └── order.integration.test.js
│
└── e2e/                     # Test cả 3 tầng (future)
    └── checkout-flow.e2e.test.js
```

---

## 🎓 KẾT LUẬN

✅ **Hệ thống food_delivery_main ĐÚNG CHUẨN 3 TẦNG!**

- **Tầng 1 (Presentation)**: 3 React apps riêng biệt
- **Tầng 2 (Business Logic)**: Express.js với routes + controllers
- **Tầng 3 (Data Access)**: MongoDB + Mongoose models

**Database Layer CẦN THIẾT**:
- ✅ Tách biệt data structure khỏi business logic
- ✅ Models provide clean API để CRUD
- ✅ Mongoose ODM giúp validate, relationships
- ✅ Dễ test và maintain

---

## 📚 Tham khảo

- [3-Tier Architecture Pattern](https://www.geeksforgeeks.org/three-tier-architecture-in-software-development/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Mongoose Best Practices](https://mongoosejs.com/docs/guide.html)
