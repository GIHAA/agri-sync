
set -euo pipefail
: ${CORE_PEER_TLS_ENABLED:="false"}
: ${DEBUG:="false"}

if [ "${DEBUG,,}" = "true" ]; then
   npm run start:server-debug
elif [ "${CORE_PEER_TLS_ENABLED,,}" = "true" ]; then
   npm run start:server
else
   npm run start:server-nontls
fi

