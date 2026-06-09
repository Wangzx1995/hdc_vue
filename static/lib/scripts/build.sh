#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker build -t emscripten-cutils - < "${DIR}/Dockerfile"
docker run --rm -v "${DIR}/..":/src emscripten-cutils \
  emcc src/exported.c src/md5.c /usr/local/lib/libarchive.a /usr/local/lib/liblzma.a -I/usr/local/include -o ./build/cutils.js \
    -s ERROR_ON_UNDEFINED_SYMBOLS=0  \
    -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME=CUtils \
    -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "UTF8ToString", "AsciiToString", "setValue", "getValue", "FS", "addFunction", "removeFunction"]' \
    -s RESERVED_FUNCTION_POINTERS=10 \
    -s EXPORTED_FUNCTIONS=@scripts/exported-functions.json \
    -s TOTAL_MEMORY=$((32 * 1024 * 1024)) -s WARN_UNALIGNED=1 -O3
