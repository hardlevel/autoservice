#!/bin/bash
source /root/.bashrc  # Garante que o ambiente do bash seja carregado

# Verifica se a pasta logs existe, se não, cria
if [ ! -d "/var/www/autoservice/logs" ]; then
  echo "Criando diretório logs..."
  mkdir -p /var/www/autoservice/logs
fi

# Verifica se o arquivo de log autoservice.log existe, se não, cria
if [ ! -f "/var/www/autoservice/logs/autoservice.log" ]; then
  echo "Criando arquivo de log autoservice.log..."
  touch /var/www/autoservice/logs/autoservice.log
fi

# Continuando com o restante do script
cd /var/www/autoservice
pnpm install
pnpm run build
cd /var/www/autoservice/laravel
composer install
cd ..

# Inicia o aplicativo (comentado o comando anterior)
pnpm run start:prod || true
