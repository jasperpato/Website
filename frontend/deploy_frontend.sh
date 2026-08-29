#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
WEB_ROOT="/var/www/jasperpato.com"

cd "$REPO_DIR"
git pull

cd "$SCRIPT_DIR"
npm install
npm run build

sudo rm -rf "${WEB_ROOT:?}"/*
sudo cp -r dist/* "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"

sudo systemctl reload nginx

echo "Frontend deployed to $WEB_ROOT"
