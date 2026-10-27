# build environment
FROM node:20-alpine AS build
# default env_file
ARG ENV_FILE=".env"
WORKDIR /app
COPY .npmrc /app
# .npmrc needs the variable set; no @influweb-it package is installed, so empty works
ARG NPM_TOKEN=""
COPY package.json /app
COPY yarn.lock /app
RUN yarn install
COPY . .
COPY ${ENV_FILE} /app/.env
RUN yarn build
# production environment
# build with --pull and apk upgrade to pick up the Alpine security fixes for this pin
# unprivileged variant: runs as uid 101, listens on 8080, pid and temp files in /tmp
FROM nginx/nginx-unprivileged:1.30.6-alpine3.24
USER root
RUN apk upgrade --no-cache
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
USER 101
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
