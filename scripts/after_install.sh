#!/bin/bash
source /root/.bashrc  # Garante que o ambiente do bash seja carregado
pm2 flush

chown -R ubuntu:ubuntu /var/www/autoservice