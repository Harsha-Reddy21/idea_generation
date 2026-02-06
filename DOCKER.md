# Docker Setup Guide

This guide explains how to build and run the application using Docker.

## Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### Using Docker Compose (Recommended)

1. **Ensure your `.env` file exists** in the `server/` directory:
   ```env
   MODEL_ENDPOINT=https://dev.cortex.lilly.com/model/ask/poc-conversational-text-editor-agent
   COOKIE=your_authentication_cookie
   PORT=5000
   ```

2. **Build and run the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Open your browser and navigate to `http://localhost:5000`
   - The React frontend and Express API will both be served from the same port

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Using Docker directly

1. **Build the Docker image**:
   ```bash
   docker build -t idea-generation:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -p 5000:5000 \
     -e MODEL_ENDPOINT=your_endpoint \
     -e COOKIE=your_cookie \
     -e PORT=5000 \
     -e NODE_ENV=production \
     idea-generation:latest
   ```

   Or use an environment file:
   ```bash
   docker run -p 5000:5000 \
     --env-file server/.env \
     -e NODE_ENV=production \
     idea-generation:latest
   ```

## Docker Image Details

### Multi-Stage Build

The Dockerfile uses a multi-stage build process:

1. **Stage 1 (client-builder)**: Builds the React application
   - Installs client dependencies
   - Builds the production-ready React app
   - Outputs to `/app/client/build`

2. **Stage 2 (server)**: Creates the final image
   - Installs server dependencies
   - Copies server code
   - Copies built React app to `public/` directory
   - Serves both API and static files

### Port Configuration

- The application runs on port `5000` by default
- You can override this using the `PORT` environment variable
- When running with Docker, map the port: `-p 5000:5000`

### Environment Variables

Required environment variables:
- `MODEL_ENDPOINT`: Your AI model endpoint URL
- `COOKIE`: Authentication cookie (if required)

Optional environment variables:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Set to `production` for production builds

## Health Check

The Docker image includes a health check that verifies the `/health` endpoint:
- Interval: 30 seconds
- Timeout: 3 seconds
- Retries: 3
- Start period: 5 seconds

Check container health:
```bash
docker ps
# Look for "healthy" status
```

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:
- Runs tests on push/PR
- Builds Docker image
- Pushes to GitHub Container Registry (ghcr.io)
- Tags images with branch names, SHA, and semantic versions

### Using the CI/CD Image

After the CI/CD pipeline runs, you can pull and use the image:

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/YOUR_USERNAME/idea_generation:latest

# Run the image
docker run -p 5000:5000 \
  --env-file server/.env \
  ghcr.io/YOUR_USERNAME/idea_generation:latest
```

## Troubleshooting

### Build fails with "npm ci" error
- Ensure `package-lock.json` files exist in both `client/` and `server/` directories
- Run `npm install` locally to generate lock files if missing

### Container exits immediately
- Check logs: `docker logs <container-id>`
- Verify environment variables are set correctly
- Ensure `.env` file exists and has valid values

### Can't access the application
- Verify port mapping: `docker ps` should show `0.0.0.0:5000->5000/tcp`
- Check if port 5000 is already in use: `netstat -an | grep 5000` (Linux/Mac) or `netstat -an | findstr 5000` (Windows)
- Try a different port: `-p 3000:5000` and access `http://localhost:3000`

### React app not loading
- Ensure `NODE_ENV=production` is set
- Check that the build stage completed successfully
- Verify the `public/` directory exists in the container: `docker exec <container-id> ls -la /app/public`

## Development vs Production

### Development
- Run `npm start` in `client/` and `npm run dev` in `server/` separately
- React dev server runs on port 3000
- Express server runs on port 5000
- Hot reloading enabled

### Production (Docker)
- Single container serves both frontend and backend
- React app is built and served as static files
- Express server handles API routes and serves React app
- All traffic goes through port 5000

## Additional Commands

### View logs
```bash
docker-compose logs -f
```

### Rebuild without cache
```bash
docker-compose build --no-cache
```

### Run in detached mode
```bash
docker-compose up -d
```

### Execute commands in container
```bash
docker-compose exec app sh
```
