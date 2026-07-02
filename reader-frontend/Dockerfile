# --- Build stage ---
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Vite bakes VITE_* vars into the bundle at build time, so this has to
# be a build-arg (passed in from cloudbuild), not a runtime env var.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Serve stage ---
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Cloud Run injects PORT at runtime (defaults to 8080). The official
# nginx image auto-runs envsubst on anything in /etc/nginx/templates/
# before start, substituting ${PORT} below. This default just lets the
# image run locally without Cloud Run setting it.
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
