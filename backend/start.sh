#!/usr/bin/env bash
set -e

echo ">>> START.SH EXECUTED <<<"

# Force UTF-8 for production emoji logs
export PYTHONUTF8=1

uvicorn app.main:app --host 0.0.0.0 --port $PORT
