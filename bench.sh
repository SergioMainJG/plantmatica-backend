#!/usr/bin/env bash

set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"
RESULTS_DIR="bench-results-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$RESULTS_DIR"

echo "BASE_URL=$BASE_URL"
echo "Guardando resultados en $RESULTS_DIR"

run_test() {
  local name="$1"
  shift

  echo ""
  echo "==> $name"
  "$@" | tee "$RESULTS_DIR/$name.txt"
}

run_json_test() {
  local name="$1"
  shift

  echo ""
  echo "==> $name"
  "$@" --json > "$RESULTS_DIR/$name.json"
}

# Sanidad básica
curl -i "$BASE_URL/ficha" | tee "$RESULTS_DIR/smoke-ficha.txt"

# Lectura pública
run_test "ficha-c10" autocannon -c 10 -d 30 --renderStatusCodes "$BASE_URL/ficha"
run_test "ficha-c50" autocannon -c 50 -d 30 --renderStatusCodes "$BASE_URL/ficha"
run_test "ficha-c100" autocannon -c 100 -d 30 --renderStatusCodes "$BASE_URL/ficha"
run_test "ficha-c200" autocannon -c 200 -d 30 --renderStatusCodes "$BASE_URL/ficha"

# Estrés
run_test "ficha-stress-c500" autocannon -c 500 -d 30 --renderStatusCodes "$BASE_URL/ficha"

# Búsqueda
run_test "search-c50" autocannon \
  -c 50 \
  -d 30 \
  --renderStatusCodes \
  -m PUT \
  -H "Content-Type: application/json" \
  -b '{"termino":"rosa"}' \
  "$BASE_URL/ficha/encontrar/coincidencia/"

# Docker stats snapshot
docker stats --no-stream plantmatica-backend | tee "$RESULTS_DIR/docker-stats.txt"

echo ""
echo "Pruebas terminadas."