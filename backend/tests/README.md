# Backend Tests

## Mô tả

Test suite cho Food Delivery Backend API sử dụng Jest và Supertest.

## Cấu trúc Tests

```
backend/tests/
├── user.test.js    # Test cho User API (đăng ký, đăng nhập, cart)
└── food.test.js    # Test cho Food API (CRUD món ăn)
```

## Test Cases

### User API Tests (user.test.js)

**Đăng ký (Register):**
- ✅ Đăng ký thành công với thông tin hợp lệ
- ✅ Thất bại khi email đã tồn tại
- ✅ Thất bại khi email không hợp lệ
- ✅ Thất bại khi mật khẩu quá ngắn

**Đăng nhập (Login):**
- ✅ Đăng nhập thành công với thông tin đúng
- ✅ Thất bại khi sai mật khẩu
- ✅ Thất bại khi email không tồn tại
- ✅ Thất bại khi thiếu email

**Cart:**
- ✅ Yêu cầu xác thực (authentication required)
- ✅ Lấy dữ liệu giỏ hàng với token hợp lệ

### Food API Tests (food.test.js)

**Danh sách món ăn (List):**
- ✅ Lấy danh sách tất cả món ăn
- ✅ Kiểm tra cấu trúc dữ liệu trả về

**Thêm món ăn (Add):**
- ✅ Yêu cầu xác thực admin
- ✅ Thêm món ăn thành công với quyền admin
- ✅ Thất bại khi thiếu tên món
- ✅ Thất bại khi giá không hợp lệ (âm)

**Xóa món ăn (Remove):**
- ✅ Yêu cầu xác thực admin
- ✅ Thất bại khi món ăn không tồn tại

**Category:**
- ✅ Chỉ chấp nhận các category hợp lệ

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

### Chạy tests với watch mode (tự động chạy lại khi có thay đổi)

```bash
npm run test:watch
```

### Chạy tests với coverage report

```bash
npm run test:coverage
```

## Cấu hình

### Environment Variables

Tests sử dụng các biến môi trường sau (có thể set trong `.env.test`):

```env
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/FoodDeliveryTest
JWT_SECRET=test_secret_key
SALT=10
```

### MongoDB

Tests yêu cầu MongoDB đang chạy. Sử dụng database riêng cho test (`FoodDeliveryTest`) để tránh ảnh hưởng đến dữ liệu thật.

**Với Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb-test mongo:latest
```

## CI/CD Integration

Tests được tự động chạy trong GitHub Actions workflow khi:
- Push lên branch `main`
- Tạo Pull Request vào `main`

Xem file `.github/workflows/ci-cd.yml` để biết chi tiết.

## Kết quả mẫu

```
PASS  tests/user.test.js
  User API Tests
    POST /api/user/register
      ✓ should register a new user successfully (152ms)
      ✓ should fail to register with existing email (45ms)
      ✓ should fail to register with invalid email (23ms)
      ✓ should fail to register with short password (21ms)
    POST /api/user/login
      ✓ should login successfully with correct credentials (98ms)
      ✓ should fail to login with wrong password (85ms)
      ✓ should fail to login with non-existent email (24ms)
      ✓ should fail to login without email (18ms)
    GET /api/cart/get
      ✓ should require authentication (15ms)
      ✓ should get cart data with valid token (45ms)

PASS  tests/food.test.js
  Food API Tests
    GET /api/food/list
      ✓ should get list of all foods (78ms)
      ✓ should return foods with correct structure (56ms)
    POST /api/food/add
      ✓ should require authentication (25ms)
      ✓ should add new food with admin token (125ms)
      ✓ should fail to add food without name (32ms)
      ✓ should fail to add food with invalid price (28ms)
    POST /api/food/remove
      ✓ should require authentication (18ms)
      ✓ should fail to remove non-existent food (45ms)
    Food Category Tests
      ✓ should only accept valid categories (67ms)

Test Suites: 2 passed, 2 total
Tests:       19 passed, 19 total
Time:        5.234s
```

## Mở rộng

Để thêm test case mới:

1. Tạo file test trong `tests/` với tên `*.test.js`
2. Import dependencies cần thiết
3. Viết test cases sử dụng Jest syntax
4. Chạy `npm test` để kiểm tra

## Troubleshooting

### Lỗi: Cannot find module

Đảm bảo đã cài đặt dependencies:
```bash
npm install
```

### Lỗi: MongoDB connection failed

Kiểm tra MongoDB đang chạy:
```bash
# Với Docker
docker ps | grep mongo

# Hoặc local MongoDB
mongosh
```

### Tests timeout

Tăng timeout trong `jest.config.js`:
```javascript
testTimeout: 30000  // 30 seconds
```

## Tài liệu tham khảo

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) - Alternative cho testing
