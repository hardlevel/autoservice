#!/bin/bash
source /root/.bashrc  # Garante que o ambiente do bash seja carregado

cd /var/www/autoservice
pnpm install
pnpm run build
cd /var/www/autoservice/laravel
composer install
cd ..
pnpm run start:prod
