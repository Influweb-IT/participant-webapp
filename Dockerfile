# build environment
FROM node:16.17.1 as build
# default env_file
ARG ENV_FILE=".env.local"
WORKDIR /app
# Install yalc globally
RUN npm install -g yalc
COPY package.json /app
COPY yarn.lock /app
# Copy yalc files if they exist
COPY .yalc/ /app/.yalc/
COPY yalc.lock /app/
RUN yarn install
# Restore yalc links after yarn install
RUN yalc add @influenzanet/case-web-app-core --no-save
COPY . .
COPY ${ENV_FILE} /app/.env.local
RUN yarn build
# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000 80
CMD ["nginx", "-g", "daemon off;"]
