#!/usr/bin/env bash
# Loads the journey tests' data into the services started by apha-incubator-core
# (`npm start` or `npm run start:ci` there). Safe to rerun: it replaces the data.
#
# Usage: npm run seed
#   E2E_BACKEND_MONGO_CONTAINER  backend MongoDB container (default backend-mongo-1,
#                                the name apha-incubator-core gives it)

set -euo pipefail

cd "$(dirname "$0")/.."

container="${E2E_BACKEND_MONGO_CONTAINER:-backend-mongo-1}"

if [ "$(docker inspect --format '{{.State.Running}}' "$container" 2>/dev/null)" != true ]; then
  echo "MongoDB container $container is not running. Start the services with apha-incubator-core first" >&2
  exit 1
fi

# --eval rather than stdin, so mongosh runs it as a script instead of echoing a REPL
docker exec "$container" mongosh --quiet --eval "$(cat seed/disease-risks.mongo.js)"
