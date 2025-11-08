# 🚀 Deploy Food Delivery App to Production Server

## Prerequisites
- ✅ Docker Hub account
- ✅ VPS/Server (Ubuntu 22.04 recommended)
- ✅ Domain name (optional but recommended)
- ✅ Stripe account for payment

---

## Part 1: Build & Push Images (On Local Machine)

### Step 1: Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username and password
```

### Step 2: Run Build Script
```powershell
# On Windows PowerShell
.\deploy-to-dockerhub.ps1

# Or manually:
# Replace 'yourusername' with your Docker Hub username
docker build -t yourusername/food-delivery-backend:latest ./backend
docker build -t yourusername/food-delivery-frontend:latest ./frontend
docker build -t yourusername/food-delivery-admin:latest ./admin
docker build -t yourusername/food-delivery-restaurant:latest ./restaurant

docker push yourusername/food-delivery-backend:latest
docker push yourusername/food-delivery-frontend:latest
docker push yourusername/food-delivery-admin:latest
docker push yourusername/food-delivery-restaurant:latest
```

---

## Part 2: Setup Production Server

### Step 1: Connect to Your Server
```bash
# Replace with your server IP
ssh root@your-server-ip
```

### Step 2: Install Docker & Docker Compose
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Create App Directory
```bash
mkdir -p /opt/food-delivery
cd /opt/food-delivery
```

### Step 4: Create .env.production File
```bash
nano .env.production
```

Paste this content (replace with your actual values):
```env
# Docker Hub
DOCKERHUB_USERNAME=your_dockerhub_username

# Backend API URL
API_URL=http://your-server-ip:4000

# Frontend URL (for CORS)
FRONTEND_URL=http://your-server-ip:5174

# MongoDB
MONGO_URI=mongodb://mongodb:27017/FoodDelivery

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_xyz123
SALT=10

# Stripe (use live keys for production)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
```

**Save file:** Press `Ctrl + X`, then `Y`, then `Enter`

### Step 5: Upload docker-compose.production.yml
```bash
# Option 1: Use nano to create file
nano docker-compose.production.yml
# Then paste the content from your local file

# Option 2: Use SCP from local machine
# On your local machine (Windows PowerShell):
scp docker-compose.production.yml root@your-server-ip:/opt/food-delivery/
```

---

## Part 3: Deploy Application

### Step 1: Pull Images
```bash
cd /opt/food-delivery
docker-compose -f docker-compose.production.yml pull
```

### Step 2: Start Containers
```bash
docker-compose -f docker-compose.production.yml up -d
```

### Step 3: Check Status
```bash
# View running containers
docker ps

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Check specific service logs
docker logs food_delivery_backend_prod
docker logs food_delivery_frontend_prod
```

---

## Part 4: Access Your Application

### Without Domain:
- **Frontend (Customer):** http://your-server-ip:5174
- **Admin Panel:** http://your-server-ip:5175
- **Restaurant Panel:** http://your-server-ip:5176
- **Backend API:** http://your-server-ip:4000

### With Domain (Recommended):
Setup Nginx reverse proxy for domain access.

---

## Part 5: Setup Nginx Reverse Proxy (Optional but Recommended)

### Step 1: Install Nginx
```bash
sudo apt install nginx -y
```

### Step 2: Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/food-delivery
```

Paste this config (replace yourdomain.com):
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5174;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin
server {
    listen 80;
    server_name admin.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5175;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Restaurant
server {
    listen 80;
    server_name restaurant.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5176;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 3: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/food-delivery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Setup SSL with Let's Encrypt (Free HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx -y

sudo certbot --nginx -d yourdomain.com \
                      -d admin.yourdomain.com \
                      -d restaurant.yourdomain.com \
                      -d api.yourdomain.com
```

---

## Part 6: Useful Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker logs -f food_delivery_backend_prod
docker logs -f food_delivery_frontend_prod
```

### Restart Services
```bash
# All services
docker-compose -f docker-compose.production.yml restart

# Specific service
docker restart food_delivery_backend_prod
```

### Update Application
```bash
# Pull new images
docker-compose -f docker-compose.production.yml pull

# Restart with new images
docker-compose -f docker-compose.production.yml up -d
```

### Stop Application
```bash
docker-compose -f docker-compose.production.yml down
```

### Backup MongoDB
```bash
docker exec food_delivery_mongodb_prod mongodump --out=/data/backup
docker cp food_delivery_mongodb_prod:/data/backup ./mongodb-backup
```

---

## Part 7: Firewall Setup

```bash
# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Troubleshooting

### Problem: Containers not starting
```bash
# Check logs
docker-compose -f docker-compose.production.yml logs

# Check container status
docker ps -a
```

### Problem: Cannot connect to MongoDB
```bash
# Check MongoDB logs
docker logs food_delivery_mongodb_prod

# Check network
docker network ls
docker network inspect food_delivery_network
```

### Problem: API returning errors
```bash
# Check backend logs
docker logs -f food_delivery_backend_prod

# Check environment variables
docker exec food_delivery_backend_prod env
```

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong passwords
- [ ] Setup firewall (ufw)
- [ ] Enable SSL/HTTPS
- [ ] Use Stripe live keys (not test keys)
- [ ] Regular backups
- [ ] Update Docker images regularly
- [ ] Monitor logs for suspicious activity

---

## Cost Estimation

### VPS Options:
- **DigitalOcean Droplet:** $6/month (Basic - 1GB RAM)
- **DigitalOcean Droplet:** $12/month (Recommended - 2GB RAM)
- **AWS EC2:** Free tier for 12 months
- **Vultr:** $6/month

### Domain:
- **.com domain:** ~$10-15/year

### Total Monthly Cost: ~$6-12 + domain ($1/month)

---

## Next Steps After Deployment

1. Create admin account using the script:
   ```bash
   docker exec -it food_delivery_backend_prod node createAdmin.js
   ```

2. Add food items via Admin Panel

3. Test ordering flow

4. Setup monitoring (optional):
   - Install Portainer for Docker management
   - Setup uptime monitoring

5. Configure email notifications (optional)

---

## Support

If you encounter issues:
1. Check logs first
2. Verify environment variables
3. Ensure all ports are accessible
4. Check Docker Hub for image availability

---

**🎉 Congratulations! Your Food Delivery App is now live in production!**
