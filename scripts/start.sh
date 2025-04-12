#!/bin/bash
source /root/.bashrc  # Garante que o ambiente do bash seja carregado

if [ ! -d "/var/www/autoservice/" ]; then
  echo "Criando diretório logs..."
  sudo mkdir -p /var/www/autoservice/
fi

sudo chown -R ubuntu:ubuntu /var/www/autoservice

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
cp /home/ubuntu/.env_prod /var/www/autoservice/.env
# pm2 start ecosystem.config.js --no-daemon &
# pm2 start ecosystem.config.js --silent & disown
nohup pm2 start ecosystem.config.js > /dev/null 2>&1 &

echo "Aplicação iniciada com sucesso!"
exit 0

#dn
#venda balcao
#venda pela nf
#venda de peça oficina
#venda de mao de obra oficina
#valor e quantidade, numero da peça
#cada operacao por dn e regiao
#numero da nota venda balcao, preco, quando clicar consulta do dia, ver o detalhe da nota
