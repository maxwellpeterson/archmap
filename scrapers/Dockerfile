FROM node:14-alpine AS build
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY ./src ./src
RUN yarn install --frozen-lockfile && \
    yarn build

FROM node:14-alpine As modules
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production=true && \
    apk add curl && \
    curl -sf https://gobinaries.com/tj/node-prune | sh && \
    node-prune

FROM public.ecr.aws/lambda/nodejs:14
COPY --from=build /app/build ./
COPY --from=modules /app/node_modules ./node_modules

CMD ["archdaily.tester"]