# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# U Docker-u VITE_API_URL ostaje prazan — runtime config preuzima preko window._env_
# koji se generise iz /config.js pri container startup-u (envsubst u entrypoint-u).
# Tako ista image moze deploy u dev/staging/prod bez rebuild-a (k8s ConfigMap pattern).
ENV VITE_API_URL=""
RUN npm run build

# ---- Runtime stage ----
FROM nginx:alpine

# envsubst dolazi sa gettext paketom — vec ga ima u nginx:alpine baseline,
# ali instaliramo eksplicitno za pouzdanost (neki nginx:alpine tag-ovi ga skidaju).
RUN apk add --no-cache gettext

COPY --from=build /app/dist /usr/share/nginx/html
# config.template.js MORA biti u dist (Vite copy-uje sve iz public/ u dist/)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
