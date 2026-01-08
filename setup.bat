@echo off
REM CareerSync AI - Setup Script for Windows

echo.
echo 🚀 CareerSync AI - Setup Script
echo ================================
echo.

REM Check Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✓ Docker and Docker Compose found
echo.

REM Create .env files if they don't exist
if not exist "backend\.env" (
    echo 📝 Creating backend .env file...
    copy backend\.env.example backend\.env
)

if not exist "frontend\.env.local" (
    echo 📝 Creating frontend .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    ) > frontend\.env.local
)

REM Start services
echo 🐳 Starting Docker services...
docker-compose up -d

REM Wait for database
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak

REM Run migrations
echo 🗄️ Running database migrations...
docker-compose exec -T backend php artisan migrate

REM Generate app key
echo 🔑 Generating application key...
docker-compose exec -T backend php artisan key:generate

echo.
echo ✅ Setup completed successfully!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    ML Service: http://localhost:8001
echo.
echo 📝 Test Credentials:
echo    Email: test@example.com
echo    Password: password123
echo.
pause
