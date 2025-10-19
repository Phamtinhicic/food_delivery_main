# Giải thích về Database trong Docker

## ❓ Tại sao không thấy file database?

**Câu trả lời ngắn:** Database **KHÔNG CẦN** file vật lý trong thư mục project của bạn. Docker quản lý nó tự động!

---

## 🗄️ Database được lưu ở đâu?

### 1. **Docker Volume** (Khuyên dùng - đang sử dụng)

Khi chạy `docker-compose up`, MongoDB lưu data vào một **Docker Volume**:

```yaml
volumes:
  mongodb_data:  # Tên volume trong docker-compose.yml
    driver: local
```

**Vị trí thực tế:**
- **Windows (WSL2):** `\\wsl$\docker-desktop-data\data\docker\volumes\food_delivery_main_mongodb_data\_data`
- **Linux:** `/var/lib/docker/volumes/food_delivery_main_mongodb_data/_data`
- **Mac:** `~/Library/Containers/com.docker.docker/Data/vms/0/data/docker/volumes/`

### 2. **Kiểm tra Volume**

```powershell
# Xem danh sách volumes
docker volume ls

# Kết quả:
# DRIVER    VOLUME NAME
# local     food_delivery_main_mongodb_data  <-- Database của bạn ở đây

# Xem chi tiết volume
docker volume inspect food_delivery_main_mongodb_data
```

### 3. **Ưu điểm của Docker Volume**

✅ **Tự động quản lý** - Không cần tạo file thủ công  
✅ **Bền vững** - Data không mất khi restart container  
✅ **Hiệu suất cao** - Tối ưu cho Docker  
✅ **Dễ backup** - Có thể export/import volume  
✅ **Cô lập** - Mỗi project có volume riêng  

---

## 🔍 Kiểm tra Database có hoạt động không?

### Cách 1: Kết nối vào MongoDB container

```powershell
# Vào MongoDB shell
docker exec -it food_delivery_mongodb mongosh

# Trong mongosh:
use FoodDelivery
show collections
db.users.find()
exit
```

### Cách 2: Xem logs của MongoDB

```powershell
docker logs food_delivery_mongodb

# Nếu thấy dòng này = OK:
# "Waiting for connections on port 27017"
```

### Cách 3: Test từ backend

```powershell
# Xem logs backend
docker logs food_delivery_backend

# Nếu thấy:
# "DB Connected successfully!" = Database hoạt động
```

---

## 💾 Backup và Restore Database

### Backup toàn bộ database

```powershell
# Tạo backup
docker exec food_delivery_mongodb mongodump --db FoodDelivery --out /tmp/backup

# Copy backup ra máy local
docker cp food_delivery_mongodb:/tmp/backup ./mongodb_backup
```

### Restore database

```powershell
# Copy backup vào container
docker cp ./mongodb_backup food_delivery_mongodb:/tmp/restore

# Restore
docker exec food_delivery_mongodb mongorestore --db FoodDelivery /tmp/restore/FoodDelivery
```

### Export volume (cách khác)

```powershell
# Backup volume thành file tar
docker run --rm -v food_delivery_main_mongodb_data:/data -v ${PWD}:/backup alpine tar czf /backup/mongodb_backup.tar.gz -C /data .

# Restore từ file tar
docker run --rm -v food_delivery_main_mongodb_data:/data -v ${PWD}:/backup alpine tar xzf /backup/mongodb_backup.tar.gz -C /data
```

---

## 🗑️ Xóa Database (Reset)

### Xóa tất cả data

```powershell
# Dừng containers
docker-compose down

# Xóa volume (XÓA HẾT DATA!)
docker volume rm food_delivery_main_mongodb_data

# Hoặc xóa luôn khi down
docker-compose down -v
```

### Chỉ xóa collections cụ thể

```powershell
# Vào MongoDB shell
docker exec -it food_delivery_mongodb mongosh

# Trong mongosh:
use FoodDelivery
db.orders.drop()      # Xóa collection orders
db.users.drop()       # Xóa collection users
```

---

## 📂 Nếu muốn lưu data trong thư mục project

Nếu bạn THỰC SỰ muốn thấy file database trong project (không khuyên):

**Sửa `docker-compose.yml`:**

```yaml
mongodb:
  volumes:
    # Thay vì:
    # - mongodb_data:/data/db
    
    # Dùng:
    - ./data/mongodb:/data/db  # Lưu vào thư mục ./data/mongodb
```

**Lưu ý:** 
- ⚠️ Folder `./data/mongodb` sẽ rất lớn và phức tạp
- ⚠️ Không nên commit vào Git
- ⚠️ Có thể gây lỗi permission trên Windows

---

## 🎯 Kết luận

### ✅ Trạng thái hiện tại (TỐT):
- Database được lưu trong Docker Volume
- Tự động quản lý, không cần lo lắng
- Data bền vững qua các lần restart
- Dễ backup/restore

### ❌ KHÔNG CẦN:
- ❌ Tạo file database thủ công
- ❌ Lo lắng về đường dẫn file
- ❌ Commit database vào Git

### 💡 Chỉ cần nhớ:
- **Chạy bình thường:** `docker-compose up -d`
- **Xem data:** `docker exec -it food_delivery_mongodb mongosh`
- **Reset data:** `docker-compose down -v`

**Database của bạn đang hoạt động hoàn hảo! 🎉**
