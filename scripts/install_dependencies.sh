#!/bin/bash

# Atualizar a lista de pacotes
sudo apt update

# Verificar se o npm está instalado
if ! command -v npm &>/dev/null; then
    echo "Instalando npm..."
    sudo apt install -y npm
else
    echo "npm já está instalado."
fi

# Verificar se pnpm está instalado
if ! command -v pnpm &>/dev/null; then
    echo "Instalando pnpm..."
    npm install -g pnpm@latest-10
else
    echo "pnpm já está instalado."
fi

# Verificar se pm2 está instalado
if ! command -v pm2 &>/dev/null; then
    echo "Instalando pm2..."
    npm install -g pm2
else
    echo "pm2 já está instalado."
fi

# Verificar a versão do Node.js
NODE_VERSION_DESIRED="22.14.0"
NODE_VERSION_INSTALLED=$(node -v 2>/dev/null | tr -d 'v')

if [[ "$NODE_VERSION_INSTALLED" == "$NODE_VERSION_DESIRED" ]]; then
    echo "Node.js já está na versão $NODE_VERSION_DESIRED."
else
    echo "Alterando versão do Node.js para $NODE_VERSION_DESIRED..."
    pnpm env use --global "$NODE_VERSION_DESIRED"
fi

# Adicionar o diretório de instalação do pnpm e o caminho do node ao PATH
export PATH=$HOME/.local/share/pnpm/global/5/.bin:$HOME/.local/share/pnpm/node:$PATH

# Persistir a modificação no arquivo .bashrc para que o PATH seja configurado em futuras sessões
echo 'export PATH=$HOME/.local/share/pnpm/global/5/.bin:$HOME/.local/share/pnpm/node:$PATH' >> ~/.bashrc
echo "Configuração concluída!"