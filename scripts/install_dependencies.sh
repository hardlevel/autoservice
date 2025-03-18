#!/bin/bash
sudo apt update
sudo apt install -y nodejs npm php8.4-fpm
# curl -fsSL https://get.pnpm.io/install.sh | sh -
npm install -g pnpm@latest-10
npm install -g pm2
# Adicionar ao PATH o diretório de instalação do pnpm
export PATH=$HOME/.local/share/pnpm/global/5/.bin:$PATH

# Verificar se o pnpm foi instalado corretamente
pnpm --version
cp /home/ubuntu/.env_prod /var/www/autoservice/.env
chown -R ubuntu:ubuntu /var/www/autoservice
