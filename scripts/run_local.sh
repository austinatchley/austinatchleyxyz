#!/usr/bin/env bash
# Local dev: run the theme's TypeScript watcher alongside the Hugo server.
#
# The esbuild watcher rebuilds theme JS into static/js and assets/js on save;
# Hugo watches those directories and live-reloads the browser. Pass --no-ts to
# skip the watcher (e.g. if you have no Node toolchain installed).
set -euo pipefail

THEME_DIR="themes/hello-friend-ng"
TS_PID=""

cleanup() {
  if [[ -n "$TS_PID" ]] && kill -0 "$TS_PID" 2>/dev/null; then
    kill "$TS_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if [[ "${1:-}" != "--no-ts" ]] && [[ -d "$THEME_DIR/node_modules" ]]; then
  echo "[run_local] starting TypeScript watcher…"
  (cd "$THEME_DIR" && npm run watch) &
  TS_PID=$!
elif [[ "${1:-}" != "--no-ts" ]]; then
  echo "[run_local] $THEME_DIR/node_modules not found — skipping TS watcher."
  echo "[run_local] run 'cd $THEME_DIR && npm install' to enable it."
fi

hugo server -D
