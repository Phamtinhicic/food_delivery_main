# Script: Migrate MongoDB từ Local sang Docker

## Bước 1: Backup MongoDB Local

# Tạo thư mục backup
New-Item -ItemType Directory -Force -Path ".\mongodb_backup"

# Backup từ MongoDB local (port 27017 - local instance)
# Nếu bạn có mongodump trên máy:
mongodump --host localhost --port 27017 --db FoodDelivery --out .\mongodb_backup

# Nếu không có mongodump local, skip bước này và dùng cách khác ở dưới

## Bước 2: Copy backup vào Docker container

docker cp .\mongodb_backup food_delivery_mongodb:/tmp/backup

## Bước 3: Restore vào MongoDB Docker

docker exec food_delivery_mongodb mongorestore --db FoodDelivery /tmp/backup/FoodDelivery --drop

## Bước 4: Verify

docker exec food_delivery_mongodb mongosh --eval "use FoodDelivery; db.users.countDocuments()"

Write-Host "Migration completed! Check counts above."
