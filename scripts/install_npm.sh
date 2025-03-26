#!/bin/bash
source /root/.bashrc

# Continuando com o restante do script
cd /var/www/autoservice
#pnpm install
#pnpm run build
pnpm env use --global 22.14.0
