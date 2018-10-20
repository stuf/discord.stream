#/usr/bin/env bash
set -e

FILE="$1" && shift
ROOT="$(git rev-parse --show-toplevel)"
BIN="$ROOT/node_modules/.bin/"
OUTDIR="$ROOT/src/bnf/"

$BIN/nearleyc "${ROOT}/grammar/${FILE}.ne" --out "${OUTDIR}/${FILE}.js"
