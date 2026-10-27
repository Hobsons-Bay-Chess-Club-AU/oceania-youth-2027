#!/bin/bash
# Double-click in Finder. No npm packages are needed.
cd "$(dirname "$0")" || exit 1
printf '\nOceania Youth 2027 — Pacific Championship Preview\n\n'
if command -v node >/dev/null 2>&1; then
  node tools/serve.mjs
elif command -v python3 >/dev/null 2>&1 && python3 --version >/dev/null 2>&1; then
  python3 tools/serve.py --open
else
  printf 'This preview needs Node.js or Python 3.\nInstall either runtime, then double-click this file again.\n\n'
  printf 'Node.js: https://nodejs.org/\nPython: https://www.python.org/downloads/macos/\n'
fi
printf '\nPreview stopped. You can close this window.\n'
read -r -p 'Press Return to finish. ' answer
