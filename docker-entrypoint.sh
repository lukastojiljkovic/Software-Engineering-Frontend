#!/bin/sh
set -e

# Defaults ako env vars nisu setovani (dev safety)
export API_URL="${API_URL:-/api}"
export OUR_BANK_CODE="${OUR_BANK_CODE:-RN-222}"
export ENV="${ENV:-development}"

# Generisi /usr/share/nginx/html/config.js iz template-a koriscenjem envsubst.
# envsubst je deo nginx:alpine slike kroz gettext paket (eksplicitno
# instaliran u Dockerfile-u za pouzdanost — neki nginx:alpine tag-ovi nemaju).
envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js

echo "Runtime config:"
cat /usr/share/nginx/html/config.js

# Pokreni nginx u foreground modu (PID 1)
exec nginx -g 'daemon off;'
