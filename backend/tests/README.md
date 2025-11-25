# Backend Tests

## 📁 Cấu trúc Tests

```
tests/
├── unit/                    # Unit Tests (71 tests)
│   ├── cartController.unit.test.js
│   ├── foodController.unit.test.js
│   ├── orderController.unit.test.js
│   └── userController.unit.test.js
│
├── integration/             # Integration Tests (29 tests)
│   ├── cart.integration.test.js
│   ├── food.integration.test.js
│   ├── order.integration.test.js
│   └── user.integration.test.js
│
├── setup.js                 # Global test setup
└── jest.setup.enhanced.js   # Enhanced test logging
```

## 🧪 Chạy Tests

### Tất cả tests
```bash
npm test
```

### Chỉ Unit tests
```bash
npm test -- unit
```

### Chỉ Integration tests
```bash
npm test -- integration
```

### Watch mode
```bash
npm test -- --watch
```

### Coverage report
```bash
npm test -- --coverage
```

## 📊 Test Statistics

- **Total**: 100 tests
- **Unit Tests**: 71 tests (test controllers riêng lẻ)
- **Integration Tests**: 29 tests (test API endpoints với database)

## ✅ Test Status

Tất cả 100 tests đang PASS! ✓
