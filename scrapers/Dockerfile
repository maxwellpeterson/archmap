FROM public.ecr.aws/lambda/nodejs:14 AS build
WORKDIR /app
RUN npm install --global yarn typescript
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install
COPY ./src ./src
RUN yarn build

FROM public.ecr.aws/lambda/nodejs:14
RUN npm install --global yarn
COPY package.json yarn.lock ./
RUN yarn install --production=true
COPY --from=build /app/build ./

# Command can be overwritten by providing a different command in the template directly.
CMD ["archdaily.tester"]

# Try with alpine base image? Would need to make some changes for AWS?
# https://docs.aws.amazon.com/lambda/latest/dg/images-create.html