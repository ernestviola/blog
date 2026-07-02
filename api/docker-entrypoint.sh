#!/bin/sh
set -e

# Prisma (via libs/prisma.js) expects a single DATABASE_URL connection
# string. Cloud Run gives us the pieces separately (DB_USER/DB_PASSWORD
# come from Secret Manager, DB_NAME/INSTANCE_CONNECTION_NAME are plain
# env vars), so assemble it here at container start rather than storing
# a second, overlapping secret.
export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost/${DB_NAME}?host=/cloudsql/${INSTANCE_CONNECTION_NAME}&schema=public"

exec node app.js
