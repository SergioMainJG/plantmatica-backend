#!/usr/bin/env bash

set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"
TOKEN="${TOKEN:?Falta TOKEN}"
FICHA_ID="${FICHA_ID:?Falta FICHA_ID}"
USER_ID="${USER_ID:?Falta USER_ID}"

RESULTS_DIR="bench-auth-results-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$RESULTS_DIR"

run_test() {
  local name="$1"
  shift

  echo ""
  echo "==> $name"
  "$@" | tee "$RESULTS_DIR/$name.txt"
}

run_test "ficha-usuario-c50" autocannon \
  -c 50 \
  -d 30 \
  --renderStatusCodes \
  -H "x-token: $TOKEN" \
  "$BASE_URL/ficha/usuario/$USER_ID"

run_test "fichas-guardadas-c50" autocannon \
  -c 50 \
  -d 30 \
  --renderStatusCodes \
  -H "x-token: $TOKEN" \
  "$BASE_URL/ficha/guardadas/$USER_ID"

run_test "comentario-post-c10" autocannon \
  -c 10 \
  -d 30 \
  --renderStatusCodes \
  -m POST \
  -H "Content-Type: application/json" \
  -H "x-token: $TOKEN" \
  -b "{\"comentario\":\"comentario benchmark\",\"id_user\":\"$USER_ID\"}" \
  "$BASE_URL/comment/$FICHA_ID"

docker stats --no-stream plantmatica-backend | tee "$RESULTS_DIR/docker-stats.txt"

echo ""
echo "Pruebas autenticadas terminadas."