FROM node:18.17-alpine AS builder

WORKDIR /opt

COPY ./.yarnrc /opt
COPY ./yarn.lock /opt
COPY ./package.json /opt
COPY ./sdk.config.js /opt

RUN yarn install

COPY . /opt/
RUN yarn test-deploy
RUN yarn make
RUN ls -lah /opt/public/js

FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:stable
WORKDIR /opt
COPY --from=builder /opt/dist /opt

ENV BOTO_CONFIG=/opt/boto 
RUN gsutil cp /opt/assets /opt/index.html /opt/background.png gs://flag-tic-tac-toe-client/
