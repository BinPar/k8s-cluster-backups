# -- Base Node ---
FROM node:12-alpine AS base
WORKDIR /usr/src/app
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk update
RUN apk add --no-cache mongodb-tools
RUN  mkdir -p /data/backups
COPY package*.json ./

# -- Build Base ---
FROM base AS build-base
COPY ["./jest.config.js","./tsconfig.json", "./.eslintrc", "./.eslintignore", "./"]

# -- Dependencies Node ---
FROM build-base AS dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
RUN cp -R node_modules prod_node_modules
RUN npm install

# ---- Compile  ----
FROM build-base AS compile
COPY ./src ./src
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN npm run build

# ---- Release  ----
FROM base AS release
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
COPY --from=compile /usr/src/app/dist ./dist

# Expose port and define CMD
ENV NODE_ENV production
CMD npm run start