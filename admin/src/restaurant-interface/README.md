# 🏪 Restaurant Interface - Giao diện quản lý Nhà hàng

Đây là bộ giao diện quản lý nhà hàng được thiết kế riêng cho hệ thống Food Delivery.

## 📂 Cấu trúc thư mục

```
restaurant-interface/
├── Dashboard/              # Tổng quan - Bảng điều khiển
│   ├── Dashboard.jsx
│   └── Dashboard.css
├── OrderManagement/        # Quản lý Đơn hàng (Kanban board)
│   ├── OrderManagement.jsx
│   └── OrderManagement.css
├── MenuManagement/         # Quản lý Thực đơn
│   ├── MenuManagement.jsx
│   └── MenuManagement.css
├── StoreManagement/        # Quản lý Cửa hàng
│   ├── StoreManagement.jsx
│   └── StoreManagement.css
├── index.js               # Export tất cả components
└── README.md              # Tài liệu này
```

## 🎯 Các màn hình chính

### 1. 📊 Dashboard - Tổng quan
**Mục đích:** Màn hình đầu tiên khi đăng nhập, cung cấp cái nhìn tổng quan
- Doanh thu hôm nay
- Tổng số đơn hàng (Hoàn thành / Bị hủy)
- Biểu đồ doanh thu (theo tuần/tháng)
- Các món bán chạy nhất
- Đơn hàng gần đây

**Route:** `/dashboard`

### 2. 🍽️ Order Management - Quản lý Đơn hàng
**Mục đích:** Màn hình "trái tim" - nhà hàng mở 90% thời gian

**Tính năng quan trọng:**
- ✅ Kanban board với 5 cột trạng thái:
  - 🔔 Đơn mới (Pending) - có âm thanh thông báo lặp lại
  - 👨‍🍳 Đang chuẩn bị (Preparing)
  - 🚚 Đang giao (Delivering)
  - ✅ Hoàn thành (Completed)
  - ❌ Đã hủy (Cancelled)
- 🔊 Âm thanh thông báo đơn mới (lặp cho đến khi xác nhận)
- ✓ Nút xác nhận/hủy đơn rõ ràng
- 📝 Hiển thị đầy đủ: Mã đơn, Tên khách, Danh sách món, Tổng tiền, Ghi chú
- 🔄 Auto-refresh mỗi 10 giây

**Route:** `/order-management`

### 3. 🍴 Menu Management - Quản lý Thực đơn
**Mục đích:** Kiểm soát những gì khách hàng thấy

**Tính năng quan trọng:**
- 📋 Danh sách món ăn theo category
- ➕ Thêm/Sửa/Xóa món
- **⭐ Toggle Bật/Tắt món 1 CLICK** (quan trọng nhất!)
  - Nút ON/OFF rõ ràng
  - Không cần vào trang edit
  - Khi tắt → hiển thị "HẾT HÀNG" overlay
- 🔍 Lọc theo danh mục
- 🖼️ Hiển thị hình ảnh món

**Route:** `/menu-management`

### 4. 🏪 Store Management - Quản lý Cửa hàng
**Mục đích:** Cài đặt cửa hàng và trạng thái hoạt động

**Tính năng:**
- 🔔 Toggle "Tạm đóng cửa" (1 nút lớn)
  - Quan trọng khi quán quá tải/hết nguyên liệu
  - Khách không thể đặt hàng mới khi tắt
- ⏰ Giờ mở cửa trong tuần
- ℹ️ Thông tin cửa hàng: Tên, Địa chỉ, SĐT, Email, Mô tả
- 📊 Thống kê nhanh: Đơn hôm nay, Món đang bán, Doanh thu

**Route:** `/store-management`

## 🚀 Cách sử dụng

### Import trong App.jsx:
```jsx
import {
  Dashboard,
  OrderManagement,
  MenuManagement,
  StoreManagement
} from './restaurant-interface';
```

### Hoặc import riêng lẻ:
```jsx
import Dashboard from './restaurant-interface/Dashboard/Dashboard';
import OrderManagement from './restaurant-interface/OrderManagement/OrderManagement';
```

## 🎨 Thiết kế

- **UI Framework:** React + CSS3
- **Style:** Modern, Clean, Responsive
- **Colors:** 
  - Primary: #2563eb (Blue)
  - Success: #16a34a (Green)
  - Danger: #dc2626 (Red)
  - Warning: #f59e0b (Orange)
- **Layout:** Card-based, Grid system
- **Responsive:** Hoạt động tốt trên mobile/tablet

## 🔧 Yêu cầu kỹ thuật

- React 18+
- React Router DOM (cho navigation)
- Axios (API calls)
- React Toastify (notifications)

## 📝 Lưu ý quan trọng

1. **Order Management** phải có âm thanh thông báo rõ ràng và lớn
2. **Menu Management** nút ON/OFF phải dễ truy cập nhất (1 click)
3. **Store Management** toggle đóng cửa phải ở vị trí nổi bật
4. Tất cả đều cần responsive (mobile-friendly)

## 🔗 API Endpoints cần thiết

Backend cần có các endpoints sau:
- `GET /api/order/list` - Lấy danh sách đơn hàng
- `POST /api/order/status` - Cập nhật trạng thái đơn
- `POST /api/order/cancel` - Hủy đơn hàng
- `GET /api/food/list` - Lấy danh sách món ăn
- `POST /api/food/toggle` - Bật/tắt món (Out of stock)
- `POST /api/food/remove` - Xóa món

## 👨‍💻 Tác giả

Được thiết kế đặc biệt cho hệ thống Food Delivery với focus vào trải nghiệm người dùng thực tế của nhà hàng.

## 📄 License

Part of Food Delivery Main Project
