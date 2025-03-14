#!/bin/bash
sudo apt update
sudo apt install -y nodejs npm php8.4-fpm
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Adicionar ao PATH o diretório de instalação do pnpm
export PATH=$HOME/.local/share/pnpm/global/5/.bin:$PATH

# Verificar se o pnpm foi instalado corretamente
pnpm --version

php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'.PHP_EOL; } else { echo 'Installer corrupt'.PHP_EOL; unlink('composer-setup.php'); exit(1); }"
php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer
cp /home/ubuntu/.env_prod /var/www/autoservice/.env
chown -R ubuntu:ubuntu /var/www/autoservice
