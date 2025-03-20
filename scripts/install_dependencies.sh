#!/bin/bash
sudo apt update
sudo apt install -y npm
# curl -fsSL https://get.pnpm.io/install.sh | sh -
npm install -g pnpm@latest-10
npm install -g pm2
pnpm env use --global 22.14.0
# Adicionar ao PATH o diretório de instalação do pnpm
export PATH=$HOME/.local/share/pnpm/global/5/.bin:$PATH
