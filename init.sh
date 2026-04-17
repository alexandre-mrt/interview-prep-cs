#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
bun install --silent
bunx biome check --write . >/dev/null 2>&1 || true
echo "init.sh ready"
