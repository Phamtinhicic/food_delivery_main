CI/CD notes

This repository now includes a GitHub Actions workflow and Dockerfiles for the services.

Files added:
- `.github/workflows/ci-cd.yml` - builds each service (backend, frontend, admin, restaurant). It builds Docker images locally in the runner.
- `backend/Dockerfile` - multi-stage Node.js Dockerfile for the backend.
- `frontend/Dockerfile` - build static assets with Node and serve with Nginx (usable for admin/restaurant/frontend builds).

Notes:
- The `publish` job in the workflow is disabled by default. To enable pushing images to Docker Hub or another registry, set the workflow `publish` job `if` condition to `true` and add the appropriate secrets to your repository settings (e.g., `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`).
- The workflow runs `npm ci`, `npm run lint`, `npm test`, `npm run build` if these scripts exist in the project's `package.json`.

## Running with Docker Compose

The easiest way to run all services together:

1. **Setup environment variables:**
```powershell
copy .env.example .env
# Edit .env and add your JWT_SECRET and STRIPE_SECRET_KEY
```

2. **Start all services:**
```powershell
docker-compose up -d
```

This will start:
- MongoDB (port 27017)
- Backend API (port 4000)
- Customer Frontend (port 5174) - http://localhost:5174
- Admin Panel (port 5175) - http://localhost:5175
- Restaurant Panel (port 5176) - http://localhost:5176

3. **View logs:**
```powershell
docker-compose logs -f
```

4. **Stop all services:**
```powershell
docker-compose down
```

5. **Stop and remove volumes (reset database):**
```powershell
docker-compose down -v
```

## Local testing (individual services)

- Build backend image:
```powershell
cd backend
docker build -t food_delivery_backend:local .
```

- Build any frontend (admin/restaurant/frontend):
```powershell
cd restaurant
docker build -t food_delivery_restaurant:local .
```

## Production Deployment

To deploy to production:
1. Set up secrets in GitHub repository settings (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
2. Enable the `publish` job in `.github/workflows/ci-cd.yml` by changing `if: false` to `if: github.ref == 'refs/heads/main'`
3. Update image names in the publish job to match your Docker Hub repository
4. Push to main branch - images will be built and pushed automatically