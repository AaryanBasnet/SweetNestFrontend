# syntax=docker/dockerfile:1

# =============================================================================
# SweetNest Frontend
#
# A Vite app compiles to static files - HTML, JS, CSS. There is no Node
# process at runtime, so the final image is nginx serving a folder, not a
# Node server. That takes the image from ~400MB to ~50MB and removes a whole
# runtime from the attack surface.
#
# Note that VITE_ variables are baked in AT BUILD TIME, not read at runtime.
# Anything you pass here ends up readable in the shipped JavaScript, so it
# must never be a secret.
# =============================================================================

ARG NODE_VERSION=22.14-alpine
ARG NGINX_VERSION=1.27-alpine


# --- Build -------------------------------------------------------------------
FROM node:${NODE_VERSION} AS build

WORKDIR /app

COPY package.json package-lock.json ./
# Dev dependencies are required here: vite itself is one.
RUN npm ci

COPY . .

# Supplied at build time, e.g.
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com/api .
ARG VITE_API_BASE_URL=http://localhost:5000/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build


# --- Serve -------------------------------------------------------------------
FROM nginx:${NGINX_VERSION} AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
