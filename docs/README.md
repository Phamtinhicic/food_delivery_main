# 📊 Food Delivery System - Diagrams

Thư mục này chứa các sơ đồ UML và kiến trúc của hệ thống.

## 📁 Files

### 1. `component-diagram.puml`
**Component Diagram tổng quan** của hệ thống Food Delivery.

**Nội dung:**
- 3 UI Components (Customer, Admin, Restaurant)
- Backend API Gateway với các services
- MongoDB Database
- Stripe Payment Gateway
- Interfaces và Dependencies
- Notes về ports và technology stack

**Cách xem:**
- Sử dụng VS Code extension: [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
- Hoặc online: http://www.plantuml.com/plantuml/uml/

### 2. `component-diagram-detailed.puml`
**Component Diagram chi tiết** theo chuẩn UML với:
- 3 Layers: Presentation, Business Logic, Data Access
- Các Interfaces (IFoodService, IOrderService, etc.)
- Modules và sub-components
- Dependencies và Relationships
- External Services

## 🚀 Cách sử dụng

### Cài đặt PlantUML Extension trong VS Code

1. Mở VS Code
2. Nhấn `Ctrl + P`
3. Gõ: `ext install jebbs.plantuml`
4. Install extension

### Xem diagram

**Cách 1: Preview trong VS Code**
1. Mở file `.puml`
2. Nhấn `Alt + D` để preview
3. Hoặc click chuột phải → "Preview Current Diagram"

**Cách 2: Export ra PNG/SVG**
1. Mở file `.puml`
2. Nhấn `Ctrl + Shift + P`
3. Gõ: "PlantUML: Export Current Diagram"
4. Chọn format (PNG, SVG, PDF)

**Cách 3: Online**
1. Copy toàn bộ nội dung file `.puml`
2. Paste vào: http://www.plantuml.com/plantuml/uml/
3. Xem diagram trực tiếp

### Yêu cầu (cho local rendering)

**Windows:**
```powershell
# Cài Java (nếu chưa có)
choco install openjdk

# Cài Graphviz
choco install graphviz
```

**Linux:**
```bash
sudo apt-get install default-jre graphviz
```

**Mac:**
```bash
brew install openjdk graphviz
```

## 📐 Kí hiệu sử dụng

### Components
- `[Component Name]` - Component box
- `<<component>>` - Stereotype
- `<<UI>>`, `<<Service>>`, `<<Data>>` - Tagged values

### Interfaces
- `() InterfaceName` - Interface (lollipop)
- `--` - Provides interface
- `..>` - Requires interface

### Relationships
- `-->` - Dependency (uses)
- `-down->` - Directional dependency
- `..>` - Dashed dependency
- `-` - Association

### Actors & External
- `actor Name` - External actor
- `cloud "Name"` - External cloud service
- `database "Name"` - Database component

## 🎨 Color Coding

- **Light Blue** - UI Components (Presentation Layer)
- **Light Green** - Service Components (Business Logic)
- **Light Yellow** - Data Components (Data Access Layer)
- **White** - Interfaces
- **Light Gray** - External Services

## 📝 Notes trong Diagram

Mỗi component có notes chứa:
- **Port numbers** (nếu có)
- **Technology stack**
- **Main features/responsibilities**
- **Dependencies**

## 🔄 Cập nhật Diagram

Khi có thay đổi trong kiến trúc:

1. Mở file `.puml` tương ứng
2. Chỉnh sửa theo syntax PlantUML
3. Preview để kiểm tra
4. Export ra PNG/SVG nếu cần
5. Commit cả file `.puml` và `.png`

## 📚 Tham khảo

- [PlantUML Documentation](https://plantuml.com/)
- [PlantUML Component Diagram](https://plantuml.com/component-diagram)
- [UML Component Diagram Guide](https://www.uml-diagrams.org/component-diagrams.html)

## 🎯 Use Cases

### Cho Developers
- Hiểu kiến trúc tổng quan
- Xác định dependencies giữa components
- Planning refactoring

### Cho Documentation
- Export PNG/SVG cho báo cáo
- Thuyết trình project
- Onboarding members mới

### Cho Stakeholders
- Hiểu high-level architecture
- Technology stack overview
- System boundaries

---

**Last Updated:** October 20, 2025  
**Maintained by:** Food Delivery Team
