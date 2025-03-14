#!/bin/bash
cd /var/www/autoservice
pnpm install
pnpm run build
cd /var/www/autoservice/laravel
composer install
cd ..
cp /home/ubuntu/.env_prod /var/www/autoservice/.env
pnpm run start:prod
