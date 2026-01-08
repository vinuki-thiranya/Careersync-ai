FROM php:8.2-fpm-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    curl \
    libpq-dev \
    postgresql-client \
    git \
    zip \
    unzip \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) gd

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader 2>&1 || true

# Create necessary directories and set permissions
RUN mkdir -p storage bootstrap/cache vendor && \
    chmod -R 777 storage bootstrap/cache vendor

# Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
