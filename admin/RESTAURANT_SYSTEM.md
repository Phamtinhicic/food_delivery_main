# 🏪 Restaurant Management System - Hệ thống Quản lý Nhà hàng

## 📋 Tổng quan dự án

Đây là phần **Admin Panel** của hệ thống Food Delivery, được thiết kế đặc biệt cho nhà hàng với trải nghiệm người dùng thực tế.

## 🎯 Mục tiêu

Tạo ra một hệ thống quản lý nhà hàng **dễ sử dụng**, **nhanh chóng** và **hiệu quả** cho môi trường bếp ồn ào, bận rộn.

## 📂 Cấu trúc thư mục

```
admin/src/
├── restaurant-interface/      # ⭐ Giao diện quản lý nhà hàng (MỚI)
│   ├── Dashboard/            # Tổng quan
│   ├── OrderManagement/      # Quản lý đơn hàng (Kanban)
│   ├── MenuManagement/       # Quản lý thực đơn
│   ├── StoreManagement/      # Quản lý cửa hàng
│   ├── index.js             # Export chung
│   └── README.md            # Tài liệu chi tiết
│
├── pages/                    # Các trang cũ (giữ lại để tham khảo)
│   ├── Add/                 # Thêm món
│   ├── List/                # Danh sách món
│   └── Orders/              # Đơn hàng (cũ)
│
├── components/              # Components dùng chung
│   ├── Navbar/
│   ├── Sidebar/
│   └── Login/
│
├── assets/                  # Hình ảnh, icons
├── context/                 # Context API (nếu có)
├── App.jsx                  # Main app
└── main.jsx                # Entry point
```

## 🌟 Tính năng chính

### 1. 📊 Dashboard - Bảng điều khiển
- Doanh thu hôm nay
- Tổng đơn hàng
- Biểu đồ doanh thu (7/30 ngày)
- Top món bán chạy
- Đơn hàng gần đây

### 2. 🍽️ Order Management - Quản lý Đơn hàng (⭐ QUAN TRỌNG NHẤT)
**Màn hình này nhà hàng sẽ mở 90% thời gian!**

#### Kanban Board với 5 cột:
- 🔔 **Đơn mới (Pending)**
  - ⚠️ Âm thanh thông báo LẶP LẠI cho đến khi xác nhận
  - Môi trường bếp rất ồn → cần âm thanh rõ ràng
  - Hiển thị: Mã đơn, Tên khách, Món, Tổng tiền, Ghi chú
  - Actions: "Xác nhận" và "Hủy đơn"

- 👨‍🍳 **Đang chuẩn bị (Preparing)**
  - Đơn đã xác nhận, bếp đang làm
  - Action: "Sẵn sàng giao"

- 🚚 **Đang giao (Delivering)**
  - Đã giao cho shipper

- ✅ **Hoàn thành (Completed)**
  - Lịch sử đơn thành công

- ❌ **Đã hủy (Cancelled)**
  - Lịch sử đơn bị hủy

#### Tính năng đặc biệt:
- Auto-refresh 10 giây
- Drag & drop (có thể thêm sau)
- Thống kê real-time

### 3. 🍴 Menu Management - Quản lý Thực đơn

#### Tính năng "Bật/Tắt món" 1 CLICK ⭐
**ĐÂY LÀ TÍNH NĂNG QUAN TRỌNG NHẤT!**

Khi bếp hết một món, họ phải tắt được **NGAY LẬP TỨC** chỉ bằng **1 CÚ NHẤP**.

- ✅ Nút ON/OFF rõ ràng trên mỗi card món
- ❌ KHÔNG bắt vào trang "Sửa món" mới tắt được
- 🎨 Khi tắt: overlay "HẾT HÀNG" trên món

#### Các tính năng khác:
- Thêm/Sửa/Xóa món
- Phân loại theo category
- Hiển thị hình ảnh
- Filter theo danh mục

### 4. 🏪 Store Management - Quản lý Cửa hàng

#### Toggle "Tạm đóng cửa" ⭐
**Rất quan trọng** khi:
- Quán quá tải
- Hết nguyên liệu
- Có việc đột xuất

Khi tắt → Khách không thể đặt hàng mới

#### Các tính năng khác:
- Giờ mở cửa trong tuần
- Thông tin cửa hàng: Tên, Địa chỉ, SĐT, Email
- Thống kê nhanh

## 🎨 Thiết kế UX/UI

### Nguyên tắc thiết kế:
1. **Dễ nhìn** - Font lớn, màu sắc rõ ràng
2. **Nhanh chóng** - Actions quan trọng nhất dễ truy cập nhất
3. **Ít click** - Giảm thiểu số lần nhấp chuột
4. **Responsive** - Hoạt động tốt trên tablet (nhân viên có thể cầm đi)

### Color scheme:
- 🔵 Primary: `#2563eb` (Blue) - Actions chính
- 🟢 Success: `#16a34a` (Green) - Confirm, Complete
- 🔴 Danger: `#dc2626` (Red) - Cancel, Alert
- 🟠 Warning: `#f59e0b` (Orange) - Processing
- ⚪ Gray: `#6b7280` - Secondary text

## 🔧 Tech Stack

- **Frontend:** React 18
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Styling:** CSS3 (custom, không dùng framework để tối ưu)
- **Build Tool:** Vite

## 🚀 Cách chạy

```bash
# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build
```

## 📡 API Integration

Backend URL mặc định: `http://localhost:4000`

Có thể thay đổi bằng biến môi trường:
```bash
VITE_API_URL=http://your-backend-url
```

### API Endpoints cần thiết:

```
# Orders
GET  /api/order/list          # Lấy danh sách đơn
POST /api/order/status        # Cập nhật trạng thái
POST /api/order/cancel        # Hủy đơn

# Foods
GET  /api/food/list           # Lấy danh sách món
POST /api/food/toggle         # Bật/tắt món (Out of stock)
POST /api/food/remove         # Xóa món
POST /api/food/add            # Thêm món
POST /api/food/update         # Sửa món
```

## 💡 Best Practices

### Cho Order Management:
1. Âm thanh thông báo PHẢI lớn và rõ
2. Auto-refresh nhưng không làm gián đoạn người dùng
3. Confirm actions quan trọng (hủy đơn)

### Cho Menu Management:
1. Nút ON/OFF luôn visible
2. Không ẩn dưới menu dropdown
3. Visual feedback rõ ràng (HẾT HÀNG overlay)

### Cho Store Management:
1. Toggle đóng cửa ở vị trí nổi bật
2. Confirm trước khi đóng cửa
3. Show trạng thái hiện tại rõ ràng

## 📱 Responsive Design

- **Desktop:** Grid layout, full features
- **Tablet:** 2-column layout, touch-friendly buttons
- **Mobile:** Single column, prioritize actions

## 🔐 Security

- Authentication qua Login component
- Token-based (nếu backend hỗ trợ)
- Role-based access (admin/staff)

## 📈 Future Enhancements

- [ ] Drag & drop trong Kanban board
- [ ] Real-time updates qua WebSocket
- [ ] Print receipt từ đơn hàng
- [ ] Export báo cáo Excel/PDF
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Push notifications
- [ ] Offline mode

## 🐛 Known Issues

- Âm thanh có thể bị browser block (cần user interaction)
- Cần refresh sau khi đăng nhập lần đầu (có thể fix bằng context)

## 👥 Team

Được thiết kế dựa trên feedback thực tế từ các chủ nhà hàng và nhân viên bếp.

## 📞 Support

Nếu có vấn đề, check:
1. Console log (F12)
2. Network tab (API calls)
3. Backend running?
4. CORS enabled?

---

**Made with ❤️ for Restaurant Owners**
