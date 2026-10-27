# build environment
FROM node:20-alpine AS build
# default env_file
ARG ENV_FILE=".env"
WORKDIR /app
COPY .npmrc /app
ARG NPM_TOKEN
COPY package.json /app
COPY yarn.lock /app
RUN yarn install
COPY . .
COPY ${ENV_FILE} /app/.env
RUN yarn build
# production environment
# build with --pull and apk upgrade to pick up the Alpine security fixes for this pin
FROM nginx:1.30.6-alpine3.24
RUN apk upgrade --no-cache
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000 80
CMD ["nginx", "-g", "daemon off;"]
