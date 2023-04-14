# Build NPM
FROM node:18-alpine3.16 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit

COPY . .
RUN npm run build

# Creating Image stage
FROM nginx:stable-alpine as production-stage

WORKDIR /usr/share/nginx/html

## Remove default nginx
RUN rm -rf /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/nginx.conf

#Copy folder project and conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./docker/nginx.conf /etc/nginx/

CMD ["nginx", "-g", "daemon off;"]

