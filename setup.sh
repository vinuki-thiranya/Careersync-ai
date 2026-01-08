#!/bin/bash

# CareerSync AI - Setup Script

set -e

echo "🚀 CareerSync AI - Setup Script"
echo "================================"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker and Docker Compose found"

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend .env.local file..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
EOF
fi

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "🗄️ Running database migrations..."
docker-compose exec -T backend php artisan migrate

# Generate app key
echo "🔑 Generating application key..."
docker-compose exec -T backend php artisan key:generate

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
docker-compose exec -T frontend npm ci

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   ML Service: http://localhost:8001"
echo ""
echo "📝 Test Credentials:"
echo "   Email: test@example.com"
echo "   Password: password123"
echo ""
echo "Run 'docker-compose logs -f' to view logs"
