#!/bin/sh

# Se a pasta estiver vazia, copie os arquivos do contêiner
if [ ! "$(ls -A /var/www/autoservice)" ]; then
  echo "Inicializando arquivos na pasta montada..."
  cp -R /var/www/autoservice_bkp/* /var/www/autoservice
  chown -R www-data:www-data /var/www/autoservice
else
  echo "Arquivos já existem, mantendo-os."
fi

exec "$@"
