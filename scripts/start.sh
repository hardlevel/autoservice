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

# pm2 start ecosystem.config.js --no-daemon &
# pm2 start ecosystem.config.js --silent & disown
nohup pm2 start ecosystem.config.js --silent > /dev/null 2>&1 &

echo "Aplicação iniciada com sucesso!"
exit 0