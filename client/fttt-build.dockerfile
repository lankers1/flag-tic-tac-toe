FROM node:latest AS builder

WORKDIR /opt

COPY ./package.json /opt

RUN yarn install

COPY . /opt/
RUN yarn test-deploy
RUN yarn build

FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:stable
WORKDIR /opt
COPY --from=builder /opt/dist /opt

ENV BOTO_CONFIG=/opt/boto 
RUN gsutil cp /opt/assets /opt/index.html /opt/background.png gs://flag-tic-tac-toe-client/
