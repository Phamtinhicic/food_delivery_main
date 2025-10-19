# 🏪 Restaurant Panel - Giao diện Nhà hàng# 🏪 Restaurant Panel - Giao diện Nhà hàng



Giao diện quản lý dành riêng cho nhà hàng, tối ưu cho môi trường bếp bận rộn.Giao diện quản lý dành riêng cho nhà hàng trong hệ thống Food Delivery.



## 🎯 Mục đích## 🎯 Mục đích



Hệ thống được thiết kế đặc biệt cho **nhà hàng/quán ăn** với focus:Được thiết kế đặc biệt cho **nhà hàng** với focus vào:

- ✅ Nhận và xử lý đơn hàng nhanh chóng- ✅ Nhận đơn hàng nhanh chóng

- ✅ Quản lý món ăn đơn giản (chỉ xem)- ✅ Quản lý món ăn dễ dàng  

- ✅ Thao tác ít click, dễ sử dụng trong môi trường bếp- ✅ Kiểm soát trạng thái cửa hàng

- ✅ Thông báo âm thanh rõ ràng- ✅ Môi trường bếp ồn ào, bận rộn



## 🚀 Chạy ứng dụng## 🚀 Chạy ứng dụng



```bash```bash

# Cài đặt dependencies# Cài đặt dependencies

npm installnpm install



# Chạy dev server# Chạy dev server

npm run devnpm run dev



# Build production# Build production

npm run buildnpm run build

``````



**URL:** http://localhost:5176Ứng dụng sẽ chạy tại: **http://localhost:5176**



## 📂 Cấu trúc## 📂 Cấu trúc thư mục



``````

restaurant/restaurant/

├── src/├── src/

│   ├── pages/│   ├── pages/                    # Các màn hình chính

│   │   ├── Orders/           # 🍽️ Quản lý đơn hàng (Kanban)│   │   ├── Dashboard/           # 📊 Tổng quan

│   │   ├── MenuManagement/   # 🍴 Xem thực đơn (read-only)│   │   ├── OrderManagement/     # 🍽️ Quản lý đơn hàng

│   │   └── StoreManagement/  # 🏪 Quản lý cửa hàng│   │   ├── MenuManagement/      # 🍴 Quản lý thực đơn

│   ├── components/│   │   └── StoreManagement/     # 🏪 Quản lý cửa hàng

│   │   ├── Navbar/│   ├── components/              # Components dùng chung

│   │   └── Sidebar/│   │   ├── Navbar/

│   ├── assets/│   │   └── Sidebar/

│   ├── App.jsx│   ├── assets/                  # Hình ảnh, icons

│   └── main.jsx│   ├── App.jsx                  # Main app

├── public/│   ├── main.jsx                 # Entry point

├── package.json│   └── index.css                # Global styles

└── README.md (file này)├── public/

```├── index.html

├── package.json

## 🌟 Tính năng├── vite.config.js

└── README.md (file này)

### 1. 🍽️ Quản lý Đơn hàng (Orders)```



**Route:** `/orders`## 🌟 Các màn hình chính



**Kanban Board với 4 cột trạng thái:**### 1. 📊 Dashboard - Tổng quan

- 🔔 **Đơn mới (Food Processing)** - Chờ xác nhận**Route:** `/dashboard`

- 👨‍🍳 **Đang chuẩn bị (Out for delivery)** - Đang làm

- ✅ **Hoàn thành (Delivered)** - Đã giaoMàn hình đầu tiên khi đăng nhập.

- ❌ **Đã hủy (Cancelled)** - Đã hủy

**Hiển thị:**

**Tính năng nổi bật:**- 💰 Doanh thu hôm nay

- 🔄 Auto-refresh mỗi 10 giây- 📦 Tổng đơn hàng

- 📊 Hiển thị đầy đủ: Mã đơn, Khách hàng, Món ăn, Tổng tiền- ✅ Đơn hoàn thành

- ⚡ Cập nhật trạng thái nhanh- ❌ Đơn bị hủy

- 🎨 Color-coded theo trạng thái- 📈 Biểu đồ doanh thu (7/30 ngày)

- 🏆 Top món bán chạy

### 2. 🍴 Quản lý Thực đơn (Menu Management)- 🕒 Đơn hàng gần đây



**Route:** `/menu`---



**Chức năng:**### 2. 🍽️ Order Management - Quản lý Đơn hàng ⭐

- 👀 **Chỉ XEM** danh sách món ăn

- ✅ Hiển thị trạng thái (Đang bán / Hết hàng)**Route:** `/orders`

- 🔍 Lọc theo category

- ❌ KHÔNG thể thêm/sửa/xóa (chỉ Admin mới được)**Đây là màn hình QUAN TRỌNG NHẤT - Nhà hàng sẽ mở 90% thời gian!**



**Lý do:** Nhân viên nhà hàng chỉ cần biết món nào còn bán, không được phép chỉnh sửa menu.#### Kanban Board với 5 cột:



### 3. 🏪 Quản lý Cửa hàng (Store Management)**🔔 Đơn mới (Pending)**

- Âm thanh thông báo **LẶP LẠI** cho đến khi xác nhận

**Route:** `/store`- Môi trường bếp rất ồn → cần âm thanh rõ ràng

- Hiển thị: Mã đơn, Tên khách, Món, Tổng tiền, Ghi chú

**Chức năng:**- Actions: **"Xác nhận"** và **"Hủy đơn"**

- 📊 Thống kê nhanh (đơn hàng, doanh thu)

- ℹ️ Thông tin cửa hàng**👨‍🍳 Đang chuẩn bị (Preparing)**

- Đơn đã xác nhận, bếp đang làm

## 🔐 Đăng nhập- Action: **"Sẵn sàng giao"**



**Tài khoản Admin mặc định:****🚚 Đang giao (Delivering)**

- Email: `admin@example.com`- Đã giao cho shipper

- Password: `AdminPass123`- Chỉ theo dõi



Sử dụng tài khoản này để đăng nhập vào Restaurant Panel.**✅ Hoàn thành (Completed)**

- Lịch sử đơn thành công

## 🎨 Thiết kế

**❌ Đã hủy (Cancelled)**

### Nguyên tắc UX:- Lịch sử đơn bị hủy (kèm lý do)

1. **Dễ nhìn** - Font lớn, màu sắc rõ ràng

2. **Nhanh chóng** - Ít bước thao tác#### Tính năng đặc biệt:

3. **Responsive** - Hoạt động tốt trên tablet- 🔄 Auto-refresh mỗi 10 giây

- 🔊 Audio notification (lặp cho đến khi confirm)

### Color Scheme:- 📊 Thống kê real-time

- 🔵 Primary: `#2563eb`- 🎨 Color-coded status

- 🟢 Success: `#16a34a` 

- 🔴 Danger: `#dc2626`---

- 🟠 Warning: `#f59e0b`

### 3. 🍴 Menu Management - Quản lý Thực đơn

## 🔧 Tech Stack

**Route:** `/menu`

- **Framework:** React 18

- **Build:** Vite#### ⭐ Tính năng "Bật/Tắt món" 1 CLICK

- **Routing:** React Router DOM v6

- **HTTP:** Axios**ĐÂY LÀ TÍNH NĂNG QUAN TRỌNG NHẤT CỦA MÀN HÌNH NÀY!**

- **Notifications:** React Toastify

- **Styling:** CSS3 (custom)Khi bếp hết một món, họ phải tắt được **NGAY LẬP TỨC** chỉ bằng **1 CÚ NHẤP**.



## 🔗 API Integration- ✅ Nút **ON/OFF** rõ ràng trên mỗi card món

- ❌ **KHÔNG** bắt vào trang "Sửa món" mới tắt được

Backend URL: `http://localhost:4000`- 🎨 Khi tắt: overlay **"HẾT HÀNG"** màu đỏ trên món

- ⚡ Cập nhật ngay lập tức

**Endpoints sử dụng:**

```javascript#### Các tính năng khác:

GET  /api/order/list        // Lấy danh sách đơn- ➕ Thêm món mới

POST /api/order/status      // Cập nhật trạng thái đơn- ✏️ Sửa món (giá, tên, mô tả, ảnh)

GET  /api/food/list         // Lấy danh sách món- 🗑️ Xóa món

```- 🔍 Filter theo category

- 📋 Hiển thị theo danh mục

## 🐛 Xử lý lỗi

---

### Lỗi JWT "invalid signature"

```javascript### 4. 🏪 Store Management - Quản lý Cửa hàng

// Mở Console (F12) và chạy:

localStorage.clear();**Route:** `/store`

location.reload();

// Đăng nhập lại#### ⭐ Toggle "Tạm đóng cửa"

```

**Rất quan trọng** khi:

### Orders không hiển thị- Quán quá tải

1. Kiểm tra backend đang chạy: http://localhost:4000- Hết nguyên liệu

2. Check token hợp lệ (xóa localStorage và login lại)- Có việc đột xuất

3. Xem Console (F12) có lỗi API không- Nghỉ giữa giờ



## 📊 Quyền hạn**Khi tắt:**

- ❌ Khách KHÔNG thể đặt hàng mới

| Chức năng | Restaurant | Admin |- 🔴 Hiển thị "Đã đóng cửa" trên frontend

|-----------|------------|-------|- ✅ Toggle lại để mở cửa

| Xem đơn hàng | ✅ | ✅ |

| Cập nhật trạng thái đơn | ✅ | ✅ |#### Các phần khác:

| Xem menu | ✅ | ✅ |- ⏰ **Giờ mở cửa** trong tuần (Thứ 2-CN)

| Thêm/Sửa/Xóa món | ❌ | ✅ |- ℹ️ **Thông tin cửa hàng:**

| Quản lý Dashboard | ❌ | ✅ |  - Tên nhà hàng

| Quản lý Users | ❌ | ✅ |  - Địa chỉ

  - Số điện thoại

## 📚 Tài liệu liên quan  - Email

  - Mô tả

- [README.md](../README.md) - Tổng quan dự án- 📊 **Thống kê nhanh:**

- [SETUP_GUIDE.md](../SETUP_GUIDE.md) - Hướng dẫn cài đặt chi tiết  - Đơn hôm nay

- [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) - Kiến trúc hệ thống  - Món đang bán

  - Doanh thu

## 👥 Target Users

---

- 👨‍🍳 **Nhân viên bếp** - Xem đơn mới, chuẩn bị món

- 👨‍💼 **Quản lý nhà hàng** - Theo dõi đơn hàng, doanh thu## 🎨 Thiết kế UX/UI

- 🙋 **Nhân viên phục vụ** - Check status đơn hàng

### Nguyên tắc thiết kế:

---

1. **Dễ nhìn**

**Được thiết kế cho trải nghiệm thực tế của nhà hàng** 🍽️   - Font lớn, rõ ràng

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
