CI/CD notes

This repository now includes a GitHub Actions workflow and Dockerfiles for the services.

Files added:
- `.github/workflows/ci-cd.yml` - builds each service (backend, frontend, admin, restaurant). It builds Docker images locally in the runner.
- `backend/Dockerfile` - multi-stage Node.js Dockerfile for the backend.
- `frontend/Dockerfile` - build static assets with Node and serve with Nginx (usable for admin/restaurant/frontend builds).

Notes:
- The `publish` job in the workflow is disabled by default. To enable pushing images to Docker Hub or another registry, set the workflow `publish` job `if` condition to `true` and add the appropriate secrets to your repository settings (e.g., `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`).
- The workflow runs `npm ci`, `npm run lint`, `npm test`, `npm run build` if these scripts exist in the project's `package.json`.

Local testing:
- Build backend image locally:

```powershell
cd backend
docker build -t food_delivery_backend:local .
```

- Build frontend image locally (example for `restaurant` site):

```powershell
cd restaurant
docker build -t food_delivery_restaurant:local -f ../frontend/Dockerfile .
```

If you want, I can:
- Enable pushing images to Docker Hub and add templates to deploy to a server.
- Add a `docker-compose.yml` to run all services together locally.
- Add additional workflow steps for security scanning or tests.

What would you like next?