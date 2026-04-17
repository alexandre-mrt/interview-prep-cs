#!/usr/bin/env bash
# Bootstrap env for a fresh context iteration
set -e
cd "$(dirname "$0")"

if [ -f package.json ]; then
  echo "[init] bun install"
  bun install --silent 2>&1 | tail -5 || true
fi

if [ -f package.json ] && grep -q '"build"' package.json; then
  : # build on demand, not every iter
fi

echo "[init] env ready"
