#!/bin/bash
set -e

echo "Starting CareerSync AI Setup..."

# Wait for database
echo "Waiting for PostgreSQL..."
for i in {1..30}; do
    if PGPASSWORD=secure_password psql -h postgres -U careersync_user -d careersync_db -c "SELECT 1" 2>/dev/null; then
        echo "PostgreSQL is ready!"
        break
    fi
    echo "PostgreSQL not ready yet... ($i/30)"
    sleep 1
done

# Generate Laravel key
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Run migrations if needed
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader
fi

echo "Running migrations..."
php artisan migrate --force 2>/dev/null || echo "Migrations already run or artisan not available"

echo "Setup complete!"
exec php-fpm
