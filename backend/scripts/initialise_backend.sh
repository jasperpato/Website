#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

cd "$BACKEND_DIR"

python3 ./scripts/drop_tables.py

ADMIN_EMAIL="$(grep -E '^ADMIN_EMAIL=' .env | cut -d '=' -f2-)"
ADMIN_PASSWORD="$(grep -E '^ADMIN_PASSWORD=' .env | cut -d '=' -f2-)"

API_USER_EMAIL="$(grep -E '^API_USER_EMAIL=' .env | cut -d '=' -f2-)"
API_USER_PASSWORD="$(grep -E '^API_USER_PASSWORD=' .env | cut -d '=' -f2-)"

URL="$(grep -E '^URL=' .env | cut -d '=' -f2-)"

python3 manage.py makemigrations users api
python3 manage.py migrate

DJANGO_SUPERUSER_EMAIL="$ADMIN_EMAIL" DJANGO_SUPERUSER_PASSWORD="$ADMIN_PASSWORD" \
    python3 manage.py createsuperuser --noinput --email "$ADMIN_EMAIL" || true

DJANGO_SUPERUSER_EMAIL="$API_USER_EMAIL" DJANGO_SUPERUSER_PASSWORD="$API_USER_PASSWORD" \
    python3 manage.py createsuperuser --noinput --email "$API_USER_EMAIL" || true

HOST_PORT="${URL#*://}"
python3 manage.py runserver "$HOST_PORT" &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

echo "Waiting for server at $URL..."
until curl -s -o /dev/null "$URL"; do
    sleep 0.5
done

python3 "$SCRIPT_DIR/post_data.py"

echo "Backend initialised. Server running (PID $SERVER_PID) at $URL"
wait "$SERVER_PID"
