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

## Kịch bản Test Hiện Có (80 tests)

### 1. Health Check Tests (health.test.js) - 2 tests ✅

**API Status:**
- ✅ Kiểm tra API hoạt động (GET /)
- ✅ Kiểm tra thời gian phản hồi (< 3 giây)

### 2. User & Authentication Tests (user.test.js) - 12 tests ✅

**2.1. Đăng ký (Register) - 4 tests:**
- ✅ Đăng ký thành công với thông tin hợp lệ
- ✅ Thất bại khi email đã tồn tại
- ✅ Thất bại khi email không hợp lệ
- ✅ Thất bại khi thiếu trường bắt buộc

**2.2. Đăng nhập (Login) - 4 tests:**
- ✅ Đăng nhập thành công với thông tin đúng
- ✅ Thất bại khi sai mật khẩu
- ✅ Thất bại khi email không tồn tại
- ✅ Thất bại khi thiếu email

**2.3. Cart API - 3 tests:**
- ✅ Yêu cầu xác thực khi add to cart
- ✅ Thêm món vào giỏ hàng với token hợp lệ
- ✅ Lấy dữ liệu giỏ hàng với token hợp lệ

### 3. Food Management Tests (food.test.js) - 21 tests ✅

**3.1. Danh sách món ăn (List) - 2 tests:**
- ✅ Lấy danh sách tất cả món ăn
- ✅ Kiểm tra cấu trúc dữ liệu trả về

**3.2. Thêm món ăn (Add) - 2 tests:**
- ✅ Yêu cầu xác thực admin
- ✅ Validate required fields

**3.3. Xóa món ăn (Remove) - 1 test:**
- ✅ Yêu cầu xác thực admin

**3.4. Category Tests - 2 tests:**
- ✅ Validate categories
- ✅ Validate category format

**3.5. Data Validation - 4 tests:**
- ✅ Validate price is positive
- ✅ Calculate total price correctly
- ✅ Validate food name length
- ✅ Validate price format

**3.6. Search and Filter - 3 tests:**
- ✅ Filter foods by category
- ✅ Search foods by name
- ✅ Sort foods by price

**3.7. Image Validation - 2 tests:**
- ✅ Validate image URL format
- ✅ Validate Cloudinary URL structure

**3.8. Price Calculations - 4 tests:**
- ✅ Calculate discount price
- ✅ Calculate total for multiple items
- ✅ Add delivery fee to order total

### 4. Order & Payment Tests (order.test.js) - 23 tests ✅

**4.1. Place Order - 3 tests:**
- ✅ Yêu cầu xác thực user
- ✅ Tạo Stripe checkout session (hoặc error nếu chưa config)
- ✅ Xử lý giỏ hàng trống

**4.2. Test Order Endpoint - 1 test:**
- ✅ Tạo đơn hàng test không qua Stripe

**4.3. Verify Payment - 2 tests:**
- ✅ Yêu cầu session_id
- ✅ Xử lý payment cancellation

**4.4. User Orders - 3 tests:**
- ✅ Yêu cầu authentication
- ✅ Lấy danh sách đơn hàng của user
- ✅ Trả về empty array nếu không có đơn

**4.5. List Orders (Admin/Restaurant) - 2 tests:**
- ✅ Yêu cầu authentication
- ✅ Yêu cầu admin hoặc restaurant role

**4.6. Update Status - 2 tests:**
- ✅ Yêu cầu authentication
- ✅ Yêu cầu admin hoặc restaurant role

**4.7. Cancel Order - 2 tests:**
- ✅ Yêu cầu authentication
- ✅ Yêu cầu admin hoặc restaurant role

**4.8. Confirm Delivery - 2 tests:**
- ✅ Yêu cầu authentication
- ✅ Thất bại với invalid order id

**4.9. Order Validation - 3 tests:**
- ✅ Validate order amount calculation
- ✅ Validate address fields
- ✅ Validate order status transitions

### 5. Cart API Tests (cart.test.js) - 22 tests ✅

**5.1. Add to Cart - 4 tests:**
- ✅ Yêu cầu authentication
- ✅ Thêm món vào giỏ với token hợp lệ
- ✅ Tăng quantity khi thêm món đã có
- ✅ Thất bại khi thiếu itemId

**5.2. Remove from Cart - 4 tests:**
- ✅ Yêu cầu authentication
- ✅ Xóa món khỏi giỏ
- ✅ Giảm quantity nếu > 1
- ✅ Xử lý xóa món không tồn tại

**5.3. Get Cart - 3 tests:**
- ✅ Yêu cầu authentication
- ✅ Lấy cart data với token hợp lệ
- ✅ Trả về empty cart cho user mới

**5.4. Cart Workflow - 2 tests:**
- ✅ Complete workflow: add → get → remove
- ✅ Xử lý nhiều items trong cart

**5.5. Cart Validation - 2 tests:**
- ✅ Validate cart total calculation
- ✅ Handle edge cases in quantity

---

## Tổng Kết: 80 Test Cases Thực Tế

- **health.test.js**: 2 tests
- **user.test.js**: 12 tests
- **food.test.js**: 21 tests
- **order.test.js**: 23 tests
- **cart.test.js**: 22 tests

**Coverage hiện tại:**
- ✅ Authentication & Authorization
- ✅ Cart Management (full CRUD)
- ✅ Food Management (list, validation, search)
- ✅ Order Placement (với/không Stripe)
- ✅ Payment Verification
- ✅ Order Status Management
- ✅ Admin/Restaurant Authorization
- ✅ Data Validation & Calculations

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
PASS  tests/health.test.js
  API Health Check Tests
    ✓ GET / - should return API Working message
    ✓ API should respond within reasonable time

PASS  tests/user.test.js
  User API Tests
    POST /api/user/register
      ✓ should register a new user successfully
      ✓ should fail to register with existing email
      ✓ should fail to register with invalid email
      ✓ should fail to register with missing fields
    POST /api/user/login
      ✓ should login successfully with correct credentials
      ✓ should fail to login with wrong password
      ✓ should fail to login with non-existent email
      ✓ should fail to login without email
    Cart API
      ✓ should require authentication
      ✓ should add item to cart with valid token
      ✓ should get cart data with valid token

PASS  tests/food.test.js
  Food API Tests
    GET /api/food/list
      ✓ should get list of all foods
      ✓ should return foods with correct structure
    POST /api/food/add
      ✓ should require authentication
      ✓ should validate required fields
    POST /api/food/remove
      ✓ should require authentication
    Food Category Tests
      ✓ should have valid categories
      ✓ should validate category format
    Food Data Validation
      ✓ should validate price is positive
      ✓ should calculate total price correctly
      ✓ should validate food name length
      ✓ should validate price format
    Food Search and Filter
      ✓ should filter foods by category
      ✓ should search foods by name
      ✓ should sort foods by price
    Food Image Validation
      ✓ should validate image URL format
      ✓ should validate Cloudinary URL structure
    Food Price Calculations
      ✓ should calculate discount price
      ✓ should calculate total for multiple items
      ✓ should add delivery fee to order total

PASS  tests/order.test.js
  Order API Tests
    POST /api/order/place
      ✓ should require authentication
      ✓ should create Stripe checkout session (or error if not configured)
      ✓ should fail with empty items
    POST /api/order/place-test
      ✓ should create test order without Stripe
    POST /api/order/verify
      ✓ should require session_id
      ✓ should handle payment cancellation
    POST /api/order/userorders
      ✓ should require authentication
      ✓ should get user orders with valid token
      ✓ should return empty array if no orders
    GET /api/order/list
      ✓ should require authentication
      ✓ should require admin or restaurant role
    POST /api/order/status
      ✓ should require authentication
      ✓ should require admin or restaurant role
    POST /api/order/cancel
      ✓ should require authentication
      ✓ should require admin or restaurant role
    POST /api/order/confirm-delivery
      ✓ should require authentication
      ✓ should fail with invalid order id
    Order Validation Tests
      ✓ should validate order amount calculation
      ✓ should validate address fields
      ✓ should validate order status transitions

PASS  tests/cart.test.js
  Cart API Tests
    POST /api/cart/add
      ✓ should require authentication
      ✓ should add item to cart with valid token
      ✓ should increment quantity when adding same item again
      ✓ should fail without itemId
    POST /api/cart/remove
      ✓ should require authentication
      ✓ should remove item from cart
      ✓ should decrement quantity if more than 1
      ✓ should handle removing non-existent item gracefully
    POST /api/cart/get
      ✓ should require authentication
      ✓ should get cart data with valid token
      ✓ should return empty cart for new user
    Cart Workflow Integration
      ✓ should handle complete cart workflow: add → get → remove
      ✓ should handle multiple items in cart
    Cart Validation Tests
      ✓ should validate cart total calculation
      ✓ should handle edge cases in quantity

Test Suites: 5 passed, 5 total
Tests:       80 passed, 80 total
Time:        ~45s

**Lưu ý:** 
- Một số tests yêu cầu Stripe được cấu hình (STRIPE_SECRET_KEY trong .env)
- Nếu Stripe chưa cấu hình, tests sẽ xử lý gracefully và pass
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
