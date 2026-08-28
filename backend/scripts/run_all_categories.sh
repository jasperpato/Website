#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CATEGORIES=(object nature person action world random)

for category in "${CATEGORIES[@]}"; do
    python3 "$SCRIPT_DIR/web_scrape.py" "$category" &
done

wait
