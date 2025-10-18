# 🏪 Restaurant Panel - Giao diện Nhà hàng

Giao diện quản lý dành riêng cho nhà hàng trong hệ thống Food Delivery.

## 🎯 Mục đích

Được thiết kế đặc biệt cho **nhà hàng** với focus vào:
- ✅ Nhận đơn hàng nhanh chóng
- ✅ Quản lý món ăn dễ dàng  
- ✅ Kiểm soát trạng thái cửa hàng
- ✅ Môi trường bếp ồn ào, bận rộn

## 🚀 Chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build
```

Ứng dụng sẽ chạy tại: **http://localhost:5176**

## 📂 Cấu trúc thư mục

```
restaurant/
├── src/
│   ├── pages/                    # Các màn hình chính
│   │   ├── Dashboard/           # 📊 Tổng quan
│   │   ├── OrderManagement/     # 🍽️ Quản lý đơn hàng
│   │   ├── MenuManagement/      # 🍴 Quản lý thực đơn
│   │   └── StoreManagement/     # 🏪 Quản lý cửa hàng
│   ├── components/              # Components dùng chung
│   │   ├── Navbar/
│   │   └── Sidebar/
│   ├── assets/                  # Hình ảnh, icons
│   ├── App.jsx                  # Main app
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md (file này)
```

## 🌟 Các màn hình chính

### 1. 📊 Dashboard - Tổng quan
**Route:** `/dashboard`

Màn hình đầu tiên khi đăng nhập.

**Hiển thị:**
- 💰 Doanh thu hôm nay
- 📦 Tổng đơn hàng
- ✅ Đơn hoàn thành
- ❌ Đơn bị hủy
- 📈 Biểu đồ doanh thu (7/30 ngày)
- 🏆 Top món bán chạy
- 🕒 Đơn hàng gần đây

---

### 2. 🍽️ Order Management - Quản lý Đơn hàng ⭐

**Route:** `/orders`

**Đây là màn hình QUAN TRỌNG NHẤT - Nhà hàng sẽ mở 90% thời gian!**

#### Kanban Board với 5 cột:

**🔔 Đơn mới (Pending)**
- Âm thanh thông báo **LẶP LẠI** cho đến khi xác nhận
- Môi trường bếp rất ồn → cần âm thanh rõ ràng
- Hiển thị: Mã đơn, Tên khách, Món, Tổng tiền, Ghi chú
- Actions: **"Xác nhận"** và **"Hủy đơn"**

**👨‍🍳 Đang chuẩn bị (Preparing)**
- Đơn đã xác nhận, bếp đang làm
- Action: **"Sẵn sàng giao"**

**🚚 Đang giao (Delivering)**
- Đã giao cho shipper
- Chỉ theo dõi

**✅ Hoàn thành (Completed)**
- Lịch sử đơn thành công

**❌ Đã hủy (Cancelled)**
- Lịch sử đơn bị hủy (kèm lý do)

#### Tính năng đặc biệt:
- 🔄 Auto-refresh mỗi 10 giây
- 🔊 Audio notification (lặp cho đến khi confirm)
- 📊 Thống kê real-time
- 🎨 Color-coded status

---

### 3. 🍴 Menu Management - Quản lý Thực đơn

**Route:** `/menu`

#### ⭐ Tính năng "Bật/Tắt món" 1 CLICK

**ĐÂY LÀ TÍNH NĂNG QUAN TRỌNG NHẤT CỦA MÀN HÌNH NÀY!**

Khi bếp hết một món, họ phải tắt được **NGAY LẬP TỨC** chỉ bằng **1 CÚ NHẤP**.

- ✅ Nút **ON/OFF** rõ ràng trên mỗi card món
- ❌ **KHÔNG** bắt vào trang "Sửa món" mới tắt được
- 🎨 Khi tắt: overlay **"HẾT HÀNG"** màu đỏ trên món
- ⚡ Cập nhật ngay lập tức

#### Các tính năng khác:
- ➕ Thêm món mới
- ✏️ Sửa món (giá, tên, mô tả, ảnh)
- 🗑️ Xóa món
- 🔍 Filter theo category
- 📋 Hiển thị theo danh mục

---

### 4. 🏪 Store Management - Quản lý Cửa hàng

**Route:** `/store`

#### ⭐ Toggle "Tạm đóng cửa"

**Rất quan trọng** khi:
- Quán quá tải
- Hết nguyên liệu
- Có việc đột xuất
- Nghỉ giữa giờ

**Khi tắt:**
- ❌ Khách KHÔNG thể đặt hàng mới
- 🔴 Hiển thị "Đã đóng cửa" trên frontend
- ✅ Toggle lại để mở cửa

#### Các phần khác:
- ⏰ **Giờ mở cửa** trong tuần (Thứ 2-CN)
- ℹ️ **Thông tin cửa hàng:**
  - Tên nhà hàng
  - Địa chỉ
  - Số điện thoại
  - Email
  - Mô tả
- 📊 **Thống kê nhanh:**
  - Đơn hôm nay
  - Món đang bán
  - Doanh thu

---

## 🎨 Thiết kế UX/UI

### Nguyên tắc thiết kế:

1. **Dễ nhìn**
   - Font lớn, rõ ràng
   - Màu sắc phân biệt trạng thái
   - Icon trực quan

2. **Nhanh chóng**
   - Actions quan trọng nhất dễ truy cập nhất
   - Ít bước thao tác
   - Shortcuts keyboard (có thể thêm)

3. **Ít click**
   - Toggle ON/OFF món: 1 click
   - Xác nhận đơn: 1 click
   - Đóng cửa hàng: 1 click

4. **Responsive**
   - Desktop: Full features
   - Tablet: Touch-friendly (nhân viên cầm đi)
   - Mobile: Essential features only

### Color Scheme:
- 🔵 Primary: `#2563eb` - Actions chính
- 🟢 Success: `#16a34a` - Confirm, Completed
- 🔴 Danger: `#dc2626` - Cancel, Alert, Out of stock
- 🟠 Warning: `#f59e0b` - Preparing, Processing
- ⚪ Gray: `#6b7280` - Secondary, Disabled

---

## 🔧 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Styling:** Pure CSS3 (custom, không framework)

---

## 🔗 API Integration

Backend URL mặc định: `http://localhost:4000`

Có thể thay đổi bằng biến môi trường:
```bash
VITE_API_URL=http://your-backend-url
```

### API Endpoints cần thiết:

```javascript
// Orders
GET  /api/order/list          // Lấy danh sách đơn
POST /api/order/status        // Cập nhật trạng thái đơn
POST /api/order/cancel        // Hủy đơn (kèm reason)

// Foods (Menu)
GET  /api/food/list           // Lấy danh sách món
POST /api/food/toggle         // Bật/tắt món (available: true/false)
POST /api/food/remove         // Xóa món
POST /api/food/add            // Thêm món mới
POST /api/food/update         // Cập nhật món

// Store (nếu có)
GET  /api/store/status        // Lấy trạng thái cửa hàng
POST /api/store/toggle        // Đóng/mở cửa hàng
```

---

## 💡 Best Practices

### Cho Order Management:
1. ✅ Âm thanh thông báo PHẢI lớn và rõ ràng
2. ✅ Không làm gián đoạn user khi auto-refresh
3. ✅ Confirm actions quan trọng (hủy đơn)
4. ✅ Hiển thị thời gian đơn đặt (để biết đơn nào cũ)

### Cho Menu Management:
1. ✅ Nút ON/OFF luôn visible, không ẩn
2. ✅ Visual feedback rõ ràng (HẾT HÀNG overlay)
3. ✅ Không require nhiều bước để tắt món
4. ✅ Xác nhận trước khi xóa món

### Cho Store Management:
1. ✅ Toggle đóng cửa ở vị trí nổi bật
2. ✅ Hiển thị trạng thái rõ ràng (màu sắc)
3. ✅ Lưu trạng thái persistent (localStorage hoặc backend)

---

## 📱 Responsive Breakpoints

- **Desktop:** > 1024px - Full features, 2-3 columns
- **Tablet:** 768px - 1024px - 2 columns, touch-friendly buttons
- **Mobile:** < 768px - 1 column, priority features only

---

## 🐛 Known Issues & Solutions

### Issue 1: Âm thanh không phát
**Nguyên nhân:** Browser block autoplay audio

**Giải pháp:**
- Cần user interaction trước
- Thêm nút "Enable Sound" lần đầu
- Hoặc chờ user click vào trang

### Issue 2: Auto-refresh gây flicker
**Giải pháp:**
- Dùng polling thay vì full refresh
- Chỉ update data, không re-render toàn bộ
- Optimistic UI updates

### Issue 3: CORS Error
**Giải pháp:**
- Enable CORS trong backend
- Set correct headers
- Check API URL

---

## 🚀 Future Enhancements

- [ ] Drag & drop trong Kanban board
- [ ] WebSocket cho real-time updates (thay auto-refresh)
- [ ] Print receipt từ đơn hàng
- [ ] Keyboard shortcuts (Space = Confirm, Esc = Cancel, etc.)
- [ ] Dark mode cho làm việc ban đêm
- [ ] Multi-language support
- [ ] Voice commands ("Xác nhận đơn", "Tắt món X")
- [ ] Báo cáo chi tiết (Excel/PDF export)
- [ ] Push notifications (browser/mobile)
- [ ] Offline mode với sync

---

## 📞 Support & Feedback

Nếu có vấn đề hoặc góp ý:

1. **Check Console Log** (F12 → Console)
2. **Check Network Tab** (API calls có success không?)
3. **Verify Backend** đang chạy (http://localhost:4000)
4. **Check CORS** enabled trong backend

---

## 📄 Related Documentation

- [Project Overview](../PROJECT_OVERVIEW.md) - Tổng quan toàn hệ thống
- [Backend API](../backend/README.md) - API documentation
- [Frontend](../frontend/README.md) - Giao diện khách hàng
- [Admin](../admin/README.md) - Giao diện quản trị

---

## 👥 Target Users

- 👨‍🍳 **Bếp trưởng** - Nhận đơn, quản lý món
- 👨‍💼 **Chủ nhà hàng** - Xem báo cáo, đóng/mở cửa
- 👩‍🍳 **Nhân viên bếp** - Check đơn, tắt món hết
- 🙋 **Nhân viên phục vụ** - Theo dõi đơn, giao shipper

---

**Made with ❤️ for Restaurant Owners and Kitchen Staff**

*Được thiết kế dựa trên feedback thực tế từ các chủ nhà hàng và nhân viên bếp.*
