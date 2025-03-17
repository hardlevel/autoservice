#!/bin/bash
# sudo npm install -g pm2
export PATH=$PATH:/home/ubuntu/.local/share/pnpm
cd /var/www/autoservice
# Garantir que pm2 esteja instalado globalmente

# APP_PORT=3000
# PID=$(lsof -t -i:$APP_PORT)

# if [ -n "$PID" ]; then
#   echo "Parando a aplicação na porta $APP_PORT..."
#   kill -9 $PID
#   echo "Aplicação encerrada com sucesso."
# else
#   echo "Nenhum processo rodando na porta $APP_PORT."
# fi

# exit 0
pm2 stop all || true