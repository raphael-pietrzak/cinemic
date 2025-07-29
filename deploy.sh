#!/bin/bash

# Configuration
REMOTE_USER="swords-line-web"
REMOTE_HOST="ns321435.ip-37-187-155.eu"
REMOTE_USER_HOST="$REMOTE_USER@$REMOTE_HOST"
REMOTE_DIR="/var/www/cinemic"
REMOTE_DOCKER_COMPOSE_PATH="$REMOTE_DIR/docker-compose.yml"



echo "🚀 Début du déploiement vers $REMOTE_USER_HOST:$REMOTE_DIR"

# Création du répertoire distant si nécessaire
ssh $REMOTE_USER_HOST "mkdir -p $REMOTE_DIR"

# Copie des fichiers
echo "📁 Copie des fichiers..."
rsync -avz --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'backend/uploads/*' \
    --exclude 'backend/db/*' \
    ./ $REMOTE_USER_HOST:$REMOTE_DIR

# Installation de Docker si nécessaire
echo "🐳 Vérification de l'installation de Docker..."
ssh $REMOTE_USER_HOST "which docker || curl -fsSL https://get.docker.com | sh"
ssh $REMOTE_USER_HOST "which docker-compose || apt-get install -y docker-compose"

# Déploiement avec Docker Compose
echo "🚀 Déploiement des containers..."
ssh $REMOTE_USER_HOST "cd $REMOTE_DIR && docker compose pull && docker compose up -d --build"

echo "✅ Déploiement terminé!"
echo "🌍 L'application devrait être accessible à http://$REMOTE_HOST"