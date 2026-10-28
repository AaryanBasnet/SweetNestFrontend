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
#
# Production for this app is Vercel, which builds the site itself. This image is for
# running the whole app locally (see the backend repository's
# docker-compose.fullstack.yml) and for anyone who prefers a container.
#
# The versions are written out in the FROM lines on purpose: Dependabot reads FROM
# lines to propose base-image updates, and cannot see a version hidden in an ARG.
# =============================================================================


# --- Build -------------------------------------------------------------------
FROM node:22.23.4-alpine AS build

WORKDIR /app

# The files that describe the dependencies come first, so the slow install layer is
# reused until a dependency actually changes (editing a component does not touch them).
COPY package.json package-lock.json ./
# Dev dependencies are required here: vite itself is one.
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

# Supplied at build time, e.g.
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com/api .
ARG VITE_API_BASE_URL=http://localhost:5000/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build


# --- Serve -------------------------------------------------------------------
# The "unprivileged" nginx image runs as a normal user, not root, and listens on 8080
# (a normal user may not bind a port below 1024). The stock nginx image runs its
# master process as root, which is more power than serving a folder of files needs.
FROM nginxinc/nginx-unprivileged:1.28-alpine AS runtime

# A published base image is a snapshot: security fixes for its system packages (curl, brotli, c-ares and so on)
# arrive in Alpine after the snapshot was taken. The vulnerability scan found 72 fixable HIGH and CRITICAL
# findings in that gap. "apk upgrade" installs the fixed packages when we build. It needs root, so the image
# switches to root for this one command and straight back to the unprivileged user (uid 101) after it.
USER root
RUN apk upgrade --no-cache
USER 101

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

ARG GIT_SHA=unknown
LABEL org.opencontainers.image.title="SweetNest Web" \
      org.opencontainers.image.description="The SweetNest website, served by nginx" \
      org.opencontainers.image.source="https://github.com/AaryanBasnet/SweetNestFrontend" \
      org.opencontainers.image.revision="${GIT_SHA}"

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
