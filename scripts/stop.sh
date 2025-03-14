#!/bin/bash
cd /var/www/autoservice

APP_PORT=3000
PID=$(lsof -t -i:$APP_PORT)

if [ -n "$PID" ]; then
  echo "Parando a aplicação na porta $APP_PORT..."
  kill -9 $PID
  echo "Aplicação encerrada com sucesso."
else
  echo "Nenhum processo rodando na porta $APP_PORT."
fi

exit 0