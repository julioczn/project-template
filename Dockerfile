# Build

FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .npmrc.tmpl ./.npmrc

COPY src ./src
COPY nest-cli.json ./
COPY .swcrc ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN yarn install --frozen-lockfile --non-interactive --production=false
RUN yarn run build
RUN rm -rf node_modules
RUN yarn install --frozen-lockfile --non-interactive --production=true

# Run

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node

CMD [ "node", "dist/main.js" ]
EXPOSE 3000
