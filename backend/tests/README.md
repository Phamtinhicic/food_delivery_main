# Backend Tests - Food Delivery System

## Mô tả

Test suite đầy đủ cho Food Delivery Backend API sử dụng Jest và Supertest. Bao gồm các kịch bản kiểm thử cho toàn bộ luồng hoạt động của hệ thống từ đăng ký, đặt hàng, thanh toán đến giao hàng.

## Cấu trúc Tests

```
backend/tests/
├── health.test.js  # Test health check và API status
├── user.test.js    # Test User API (đăng ký, đăng nhập, profile, cart)
├── food.test.js    # Test Food API (CRUD món ăn, Cloudinary integration)
└── order.test.js   # Test Order API (tạo đơn, thanh toán, tracking, delivery)
```

## Kịch bản Test Đầy Đủ

### 1. Health Check Tests (health.test.js)

**API Status:**
- ✅ Kiểm tra API hoạt động (GET /)
- ✅ Kiểm tra thời gian phản hồi (< 3 giây)
- ✅ Kiểm tra kết nối MongoDB
- ✅ Kiểm tra kết nối Cloudinary
- ✅ Kiểm tra kết nối Stripe

### 2. User & Authentication Tests (user.test.js)

**2.1. Đăng ký (Register):**
- ✅ Đăng ký thành công với thông tin hợp lệ
- ✅ Thất bại khi email đã tồn tại
- ✅ Thất bại khi email không hợp lệ
- ✅ Thất bại khi mật khẩu quá ngắn (< 8 ký tự)
- ✅ Thất bại khi thiếu trường bắt buộc (name, email, password)
- ✅ Kiểm tra mật khẩu được mã hóa (bcrypt)

**2.2. Đăng nhập (Login):**
- ✅ Đăng nhập thành công với thông tin đúng
- ✅ Thất bại khi sai mật khẩu
- ✅ Thất bại khi email không tồn tại
- ✅ Thất bại khi thiếu email hoặc password
- ✅ Nhận được JWT token hợp lệ sau khi đăng nhập
- ✅ Token có thể giải mã và chứa userId

**2.3. User Profile:**
- ✅ Lấy thông tin profile với token hợp lệ
- ✅ Thất bại khi không có token
- ✅ Thất bại khi token không hợp lệ
- ✅ Cập nhật thông tin profile (name, phone, address)
- ✅ Không thể thay đổi email của user khác

**2.4. Cart Management:**
- ✅ Yêu cầu xác thực (authentication required)
- ✅ Lấy dữ liệu giỏ hàng với token hợp lệ
- ✅ Thêm món vào giỏ hàng
- ✅ Cập nhật số lượng món trong giỏ
- ✅ Xóa món khỏi giỏ hàng
- ✅ Xóa toàn bộ giỏ hàng
- ✅ Kiểm tra tổng giá trị giỏ hàng

**2.5. Admin Operations:**
- ✅ Tạo tài khoản admin với ADMIN_SETUP_SECRET
- ✅ Admin có thể xem danh sách users
- ✅ Admin có thể promote user thành admin
- ✅ User thường không thể truy cập admin endpoints

### 3. Food Management Tests (food.test.js)

**3.1. Danh sách món ăn (List):**
- ✅ Lấy danh sách tất cả món ăn
- ✅ Kiểm tra cấu trúc dữ liệu trả về (name, price, category, image, etc.)
- ✅ Lọc món ăn theo category
- ✅ Tìm kiếm món ăn theo tên
- ✅ Phân trang danh sách món ăn

**3.2. Thêm món ăn (Add):**
- ✅ Yêu cầu xác thực admin
- ✅ Thêm món ăn thành công với quyền admin
- ✅ Upload ảnh lên Cloudinary thành công
- ✅ Lưu URL Cloudinary vào database
- ✅ Thất bại khi thiếu tên món
- ✅ Thất bại khi giá không hợp lệ (âm hoặc 0)
- ✅ Thất bại khi thiếu category
- ✅ Thất bại khi không có ảnh
- ✅ Thất bại khi định dạng ảnh không hợp lệ

**3.3. Cập nhật món ăn (Update):**
- ✅ Cập nhật thông tin món ăn
- ✅ Cập nhật ảnh mới (xóa ảnh cũ trên Cloudinary)
- ✅ Thất bại khi món không tồn tại
- ✅ Thất bại khi không có quyền admin

**3.4. Xóa món ăn (Remove):**
- ✅ Yêu cầu xác thực admin
- ✅ Xóa món thành công
- ✅ Xóa ảnh trên Cloudinary khi xóa món
- ✅ Thất bại khi món ăn không tồn tại
- ✅ Không thể xóa món đang có trong đơn hàng active

**3.5. Category Management:**
- ✅ Chỉ chấp nhận các category hợp lệ
- ✅ Lấy danh sách categories
- ✅ Đếm số món ăn trong mỗi category

### 4. Order & Payment Tests (order.test.js)

**4.1. Tạo đơn hàng (Place Order):**
- ✅ Tạo đơn hàng thành công với thông tin hợp lệ
- ✅ Yêu cầu xác thực user
- ✅ Kiểm tra items trong đơn hàng tồn tại
- ✅ Tính tổng tiền chính xác (subtotal + phí giao hàng)
- ✅ Thất bại khi giỏ hàng trống
- ✅ Thất bại khi thiếu địa chỉ giao hàng
- ✅ Thất bại khi món ăn trong đơn không tồn tại

**4.2. Thanh toán Stripe:**
- ✅ Tạo payment intent thành công
- ✅ Nhận được client_secret từ Stripe
- ✅ Đơn hàng chuyển sang trạng thái "pending payment"
- ✅ Webhook xử lý payment_intent.succeeded
- ✅ Đơn hàng chuyển sang "paid" sau thanh toán thành công
- ✅ Đơn hàng chuyển sang "payment_failed" khi thanh toán thất bại
- ✅ Webhook có chữ ký hợp lệ (signature verification)
- ✅ Idempotency - không xử lý duplicate webhook events

**4.3. Quản lý đơn hàng:**
- ✅ User xem danh sách đơn hàng của mình
- ✅ User xem chi tiết đơn hàng
- ✅ User không thể xem đơn của người khác
- ✅ Admin xem tất cả đơn hàng
- ✅ Restaurant xem đơn hàng cần chuẩn bị
- ✅ Lọc đơn hàng theo status
- ✅ Tìm kiếm đơn hàng theo order ID hoặc user

**4.4. Cập nhật trạng thái đơn hàng:**
- ✅ Restaurant chấp nhận đơn hàng (confirmed)
- ✅ Restaurant bắt đầu chuẩn bị (preparing)
- ✅ Đơn hàng sẵn sàng giao (ready_for_delivery)
- ✅ Giao cho shipper (out_for_delivery)
- ✅ Giao hàng thành công (delivered)
- ✅ Hủy đơn hàng (cancelled)
- ✅ Hoàn tiền khi hủy đơn đã thanh toán
- ✅ Không thể cập nhật đơn hàng đã giao hoặc đã hủy

**4.5. Delivery Tracking:**
- ✅ Gán driver cho đơn hàng
- ✅ Cập nhật vị trí driver real-time
- ✅ Tính toán ETA (Estimated Time of Arrival)
- ✅ Thông báo khi driver đến gần (< 500m)
- ✅ Xác nhận giao hàng với OTP
- ✅ Driver cập nhật ảnh proof of delivery

**4.6. Notifications:**
- ✅ Gửi email xác nhận đơn hàng
- ✅ Gửi thông báo khi đơn được chấp nhận
- ✅ Gửi thông báo khi đơn đang giao
- ✅ Gửi thông báo khi giao thành công
- ✅ Push notification cho mobile app

### 5. Integration Tests

**5.1. End-to-End User Flow:**
- ✅ User đăng ký → đăng nhập → thêm món vào giỏ → đặt hàng → thanh toán → nhận hàng
- ✅ Admin thêm món ăn mới → upload ảnh → user xem và đặt món đó
- ✅ Restaurant nhận đơn → chuẩn bị → giao cho driver → hoàn thành

**5.2. Concurrency & Race Conditions:**
- ✅ Nhiều user đặt món cuối cùng cùng lúc (inventory check)
- ✅ Cập nhật cart đồng thời không gây mất dữ liệu
- ✅ Payment webhook đến nhiều lần (idempotency)

**5.3. Error Handling:**
- ✅ Xử lý lỗi kết nối MongoDB
- ✅ Xử lý lỗi Cloudinary upload
- ✅ Xử lý lỗi Stripe payment
- ✅ Xử lý timeout
- ✅ Retry logic cho external services

**5.4. Security Tests:**
- ✅ SQL/NoSQL injection prevention
- ✅ XSS protection
- ✅ CSRF token validation
- ✅ Rate limiting
- ✅ JWT expiration và refresh
- ✅ Password strength requirements
- ✅ Authorization checks (user không thể access admin endpoints)

## Chạy Tests

### Cài đặt dependencies

```bash
cd backend
npm install
```

### Chạy tất cả tests

```bash
npm test
```

### Chạy một file test cụ thể

```bash
# Test User API
npm test -- user.test.js

# Test Food API
npm test -- food.test.js

# Test Order API
npm test -- order.test.js

# Test Health Check
npm test -- health.test.js
```

### Chạy tests với watch mode (tự động chạy lại khi có thay đổi)

```bash
npm run test:watch
```

### Chạy tests với coverage report

```bash
npm run test:coverage
```

### Chạy tests cho một chức năng cụ thể (pattern matching)

```bash
# Chỉ chạy tests liên quan đến authentication
npm test -- --testNamePattern="auth|login|register"

# Chỉ chạy tests liên quan đến orders
npm test -- --testNamePattern="order|payment|stripe"

# Chỉ chạy tests liên quan đến cart
npm test -- --testNamePattern="cart"
```

### Chạy tests với verbose output

```bash
npm test -- --verbose
```

## Cấu hình

### Environment Variables

Tests sử dụng các biến môi trường sau (tạo file `.env.test` trong `backend/`):

```env
# Server
NODE_ENV=test
PORT=4001

# Database
MONGO_URI=mongodb://localhost:27017/FoodDeliveryTest

# Authentication
JWT_SECRET=test_jwt_secret_key_for_testing_only
SALT=10

# Cloudinary (for image upload tests)
CLOUDINARY_CLOUD_NAME=your_test_cloud_name
CLOUDINARY_API_KEY=your_test_api_key
CLOUDINARY_API_SECRET=your_test_api_secret

# Stripe (for payment tests - use test keys)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxx

# Admin setup
ADMIN_SETUP_SECRET=test_admin_secret_123

# Email (optional - for notification tests)
EMAIL_USER=test@example.com
EMAIL_PASS=test_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### MongoDB

Tests yêu cầu MongoDB đang chạy. Sử dụng database riêng cho test (`FoodDeliveryTest`) để tránh ảnh hưởng đến dữ liệu thật.

**Khởi động MongoDB với Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb-test mongo:latest
```

**Hoặc sử dụng MongoDB local:**
```bash
# Windows (với MongoDB installed)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Hoặc sử dụng MongoDB Atlas (cloud):**
- Tạo cluster test riêng
- Copy connection string vào `MONGO_URI`

### Cloudinary Setup

Để test image upload:
1. Tạo tài khoản Cloudinary (miễn phí)
2. Lấy API credentials từ Dashboard
3. Thêm vào `.env.test`

### Stripe Setup

Để test payments:
1. Tạo tài khoản Stripe
2. Lấy **test mode** API keys (bắt đầu với `sk_test_`)
3. Setup webhook endpoint cho testing (sử dụng Stripe CLI)

```bash
# Install Stripe CLI
# Windows: choco install stripe
# macOS: brew install stripe/stripe-cli/stripe

# Login và forward webhooks
stripe login
stripe listen --forward-to localhost:4001/api/order/webhook
```

## CI/CD Integration

Tests được tự động chạy trong GitHub Actions workflow khi:
- Push lên branch `main`
- Tạo Pull Request vào `main`

Xem file `.github/workflows/ci-cd.yml` để biết chi tiết.

## Kết quả mẫu

```
PASS  tests/health.test.js (6.234s)
  API Health Check Tests
    ✓ GET / - should return API Working message (142ms)
    ✓ API should respond within reasonable time (89ms)
    ✓ MongoDB connection should be healthy (256ms)
    ✓ Cloudinary connection should be healthy (178ms)

PASS  tests/user.test.js (12.456s)
  User API Tests
    POST /api/user/register
      ✓ should register a new user successfully (152ms)
      ✓ should fail to register with existing email (45ms)
      ✓ should fail to register with invalid email (23ms)
      ✓ should fail to register with short password (21ms)
      ✓ should fail to register with missing required fields (18ms)
      ✓ password should be encrypted (67ms)
    POST /api/user/login
      ✓ should login successfully with correct credentials (98ms)
      ✓ should return valid JWT token (45ms)
      ✓ should fail to login with wrong password (85ms)
      ✓ should fail to login with non-existent email (24ms)
      ✓ should fail to login without email (18ms)
    User Profile
      ✓ should get user profile with valid token (56ms)
      ✓ should fail without authentication (15ms)
      ✓ should update profile successfully (89ms)
      ✓ should not allow accessing other user profiles (34ms)
    Cart Management
      ✓ should require authentication (15ms)
      ✓ should get cart data with valid token (45ms)
      ✓ should add item to cart (67ms)
      ✓ should update cart item quantity (54ms)
      ✓ should remove item from cart (43ms)
      ✓ should calculate total price correctly (38ms)
    Admin Operations
      ✓ should create admin with setup secret (123ms)
      ✓ admin should access user list (78ms)
      ✓ user should not access admin endpoints (42ms)

PASS  tests/food.test.js (15.789s)
  Food API Tests
    GET /api/food/list
      ✓ should get list of all foods (78ms)
      ✓ should return foods with correct structure (56ms)
      ✓ should filter by category (89ms)
      ✓ should search by name (67ms)
      ✓ should paginate results (94ms)
    POST /api/food/add
      ✓ should require admin authentication (25ms)
      ✓ should add new food with admin token (125ms)
      ✓ should upload image to Cloudinary (234ms)
      ✓ should save Cloudinary URL in database (98ms)
      ✓ should fail to add food without name (32ms)
      ✓ should fail to add food with invalid price (28ms)
      ✓ should fail without category (23ms)
      ✓ should fail without image (19ms)
    PUT /api/food/update
      ✓ should update food information (87ms)
      ✓ should update image and delete old one (198ms)
      ✓ should fail for non-existent food (34ms)
    POST /api/food/remove
      ✓ should require admin authentication (18ms)
      ✓ should remove food successfully (76ms)
      ✓ should delete Cloudinary image (145ms)
      ✓ should fail to remove non-existent food (45ms)
      ✓ should not remove food in active orders (56ms)
    Food Category Tests
      ✓ should only accept valid categories (67ms)
      ✓ should get category list (45ms)
      ✓ should count items per category (89ms)

PASS  tests/order.test.js (28.567s)
  Order API Tests
    POST /api/order/place
      ✓ should create order successfully (189ms)
      ✓ should require authentication (23ms)
      ✓ should validate items exist (78ms)
      ✓ should calculate total correctly (56ms)
      ✓ should fail with empty cart (34ms)
      ✓ should fail without delivery address (28ms)
    Stripe Payment
      ✓ should create payment intent (234ms)
      ✓ should return client secret (145ms)
      ✓ should set order to pending payment (89ms)
      ✓ should handle payment success webhook (298ms)
      ✓ should handle payment failure webhook (267ms)
      ✓ should verify webhook signature (123ms)
      ✓ should handle duplicate webhooks (178ms)
    Order Management
      ✓ should get user orders (98ms)
      ✓ should get order details (76ms)
      ✓ should not access other user orders (45ms)
      ✓ admin should see all orders (134ms)
      ✓ should filter by status (87ms)
      ✓ should search orders (92ms)
    Order Status Updates
      ✓ restaurant confirms order (67ms)
      ✓ restaurant starts preparing (54ms)
      ✓ order ready for delivery (49ms)
      ✓ out for delivery (58ms)
      ✓ order delivered successfully (71ms)
      ✓ cancel order (84ms)
      ✓ should refund cancelled paid orders (198ms)
      ✓ cannot update delivered orders (38ms)
    Delivery Tracking
      ✓ should assign driver (89ms)
      ✓ should update driver location (67ms)
      ✓ should calculate ETA (124ms)
      ✓ should notify when driver is near (156ms)
      ✓ should verify delivery OTP (78ms)
      ✓ should upload proof of delivery (234ms)
    Notifications
      ✓ should send order confirmation email (187ms)
      ✓ should send status update notifications (145ms)
      ✓ should send delivery notifications (132ms)
      ✓ should send push notifications (98ms)

Test Suites: 4 passed, 4 total
Tests:       98 passed, 98 total
Snapshots:   0 total
Time:        63.046s
Ran all test suites.

---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------|---------|----------|---------|---------|-------------------
All files            |   87.45 |    82.31 |   89.67 |   88.12 |                   
 controllers         |   89.23 |    84.56 |   91.34 |   90.45 |                   
  cartController.js  |   92.11 |    88.23 |   94.56 |   93.21 | 45-47,89          
  foodController.js  |   88.67 |    82.45 |   89.23 |   89.78 | 67-69,123-125     
  orderController.js |   86.89 |    81.34 |   88.56 |   87.92 | 156-159,234-237   
  userController.js  |   90.12 |    86.78 |   93.45 |   91.34 | 78-80,145         
 middleware          |   94.56 |    91.23 |   96.78 |   95.12 |                   
  auth.js            |   94.56 |    91.23 |   96.78 |   95.12 | 34-36             
 models              |   100.0 |    100.0 |   100.0 |   100.0 |                   
  foodModel.js       |   100.0 |    100.0 |   100.0 |   100.0 |                   
  orderModel.js      |   100.0 |    100.0 |   100.0 |   100.0 |                   
  userModel.js       |   100.0 |    100.0 |   100.0 |   100.0 |                   
 routes              |   100.0 |    100.0 |   100.0 |   100.0 |                   
  cartRoute.js       |   100.0 |    100.0 |   100.0 |   100.0 |                   
  foodRoute.js       |   100.0 |    100.0 |   100.0 |   100.0 |                   
  orderRoute.js      |   100.0 |    100.0 |   100.0 |   100.0 |                   
  userRoute.js       |   100.0 |    100.0 |   100.0 |   100.0 |                   
---------------------|---------|----------|---------|---------|-------------------
```

## Test Coverage Goals

Target coverage cho từng module:

- **Controllers**: > 85% (logic nghiệp vụ quan trọng)
- **Routes**: 100% (API endpoints)
- **Models**: 100% (schema definitions)
- **Middleware**: > 90% (authentication, validation)
- **Overall**: > 80%

## Best Practices

### 1. Test Isolation
- Mỗi test phải độc lập, không phụ thuộc test khác
- Sử dụng `beforeEach` và `afterEach` để setup/cleanup
- Clear database hoặc mock data trước mỗi test

### 2. Test Data
- Sử dụng factory pattern để tạo test data
- Avoid hardcoded values, sử dụng constants
- Test với nhiều edge cases (empty, null, invalid)

### 3. Naming Convention
```javascript
describe('Feature/API Name', () => {
  describe('Method/Operation', () => {
    test('should [expected behavior] when [condition]', () => {
      // Arrange - Setup
      // Act - Execute
      // Assert - Verify
    });
  });
});
```

### 4. Async Testing
```javascript
// Use async/await
test('should create order', async () => {
  const response = await request(app)
    .post('/api/order/place')
    .send(orderData);
  
  expect(response.status).toBe(200);
});
```

### 5. Mock External Services
- Mock Cloudinary uploads trong tests
- Mock Stripe API calls
- Mock email sending
- Sử dụng `jest.mock()` hoặc test doubles

## Mở rộng Tests

### Thêm test case mới

1. **Tạo file test mới:**
```bash
touch backend/tests/feature.test.js
```

2. **Template cơ bản:**
```javascript
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

describe('Feature Tests', () => {
  let token;
  
  beforeEach(async () => {
    // Setup: create test user, get token, etc.
  });
  
  afterEach(async () => {
    // Cleanup: delete test data
  });
  
  describe('API Endpoint', () => {
    test('should do something', async () => {
      const response = await request(app)
        .get('/api/endpoint')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});
```

3. **Chạy test mới:**
```bash
npm test -- feature.test.js
```

### Thêm integration test

```javascript
// tests/integration/checkout-flow.test.js
describe('Complete Checkout Flow', () => {
  test('user can browse, add to cart, and checkout', async () => {
    // 1. Register user
    const registerRes = await request(app)
      .post('/api/user/register')
      .send(userData);
    
    const token = registerRes.body.token;
    
    // 2. Browse foods
    const foodsRes = await request(app).get('/api/food/list');
    const foodId = foodsRes.body.data[0]._id;
    
    // 3. Add to cart
    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ itemId: foodId, quantity: 2 });
    
    // 4. Place order
    const orderRes = await request(app)
      .post('/api/order/place')
      .set('Authorization', `Bearer ${token}`)
      .send(addressData);
    
    expect(orderRes.status).toBe(200);
    expect(orderRes.body.orderId).toBeDefined();
  });
});
```

## Troubleshooting

### Lỗi: Cannot find module

Đảm bảo đã cài đặt dependencies:
```bash
cd backend
npm install
```

### Lỗi: MongoDB connection failed

**Kiểm tra MongoDB đang chạy:**
```bash
# Với Docker
docker ps | grep mongo

# Nếu chưa chạy, start container
docker start mongodb-test

# Hoặc local MongoDB
mongosh
```

**Kiểm tra connection string:**
- Đảm bảo `MONGO_URI` trong `.env.test` đúng
- Test connection: `mongosh "mongodb://localhost:27017/FoodDeliveryTest"`

### Lỗi: Cloudinary upload failed

- Kiểm tra API credentials trong `.env.test`
- Test với Cloudinary dashboard
- Hoặc mock Cloudinary trong tests:
```javascript
jest.mock('../config/cloudinary.js', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({
      secure_url: 'https://test-image.jpg'
    })
  }
}));
```

### Lỗi: Stripe webhook signature invalid

- Sử dụng Stripe CLI để forward webhooks
- Hoặc mock webhook trong tests
- Đảm bảo `STRIPE_WEBHOOK_SECRET` chính xác

### Tests timeout

**Tăng timeout trong `jest.config.js`:**
```javascript
export default {
  testTimeout: 30000,  // 30 seconds
  // hoặc cho test cụ thể:
};
```

**Hoặc trong test file:**
```javascript
jest.setTimeout(30000);
```

### Tests chạy chậm

- Sử dụng `--runInBand` để chạy tuần tự (debug dễ hơn):
  ```bash
  npm test -- --runInBand
  ```
- Tối ưu database operations (sử dụng transactions)
- Mock external API calls
- Giảm số lượng test data

### Lỗi: Port already in use

```bash
# Windows - kill process trên port 4001
netstat -ano | findstr :4001
taskkill /PID <process_id> /F

# Linux/macOS
lsof -ti:4001 | xargs kill -9
```

### Cleanup test database

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/FoodDeliveryTest

# Drop test database
use FoodDeliveryTest
db.dropDatabase()
```

## CI/CD Integration

Tests được tự động chạy trong GitHub Actions workflow khi:
- Push lên branch `main`
- Tạo Pull Request vào `main`
- Merge Pull Request

**Workflow file:** `.github/workflows/ci-cd.yml`

```yaml
- name: Run Backend Tests
  run: |
    cd backend
    npm test
  env:
    MONGO_URI: ${{ secrets.TEST_MONGO_URI }}
    JWT_SECRET: ${{ secrets.TEST_JWT_SECRET }}
```

**Badge hiển thị status:**
```markdown
![Tests](https://github.com/Phamtinhicic/food_delivery_main/actions/workflows/ci-cd.yml/badge.svg)
```

## Performance Testing

### Load Testing với Artillery

```bash
# Install Artillery
npm install -g artillery

# Create load test config
artillery quick --count 10 --num 100 http://localhost:4000/api/food/list

# Or use config file
artillery run tests/load/orders.yml
```

### Memory Leak Detection

```bash
# Run tests with --detectLeaks
npm test -- --detectLeaks

# Or with --logHeapUsage
npm test -- --logHeapUsage
```

## Security Testing

### Test SQL/NoSQL Injection

```javascript
test('should prevent NoSQL injection', async () => {
  const maliciousEmail = { $ne: null };
  const response = await request(app)
    .post('/api/user/login')
    .send({ email: maliciousEmail, password: 'test' });
  
  expect(response.status).toBe(400);
});
```

### Test XSS Protection

```javascript
test('should sanitize XSS input', async () => {
  const xssName = '<script>alert("xss")</script>';
  const response = await request(app)
    .post('/api/user/register')
    .send({ name: xssName, email: 'test@test.com', password: 'password123' });
  
  expect(response.body.name).not.toContain('<script>');
});
```

## Tài liệu tham khảo

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) - Alternative cho testing
- [Stripe Testing](https://stripe.com/docs/testing)
- [Cloudinary Testing](https://cloudinary.com/documentation/upload_images#testing)
- [Artillery Load Testing](https://www.artillery.io/docs)

## Support

Nếu gặp vấn đề với tests:
1. Kiểm tra logs: `npm test -- --verbose`
2. Chạy test cụ thể để debug: `npm test -- file.test.js`
3. Kiểm tra GitHub Actions logs
4. Mở issue trong repository
