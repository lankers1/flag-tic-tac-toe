FROM node:latest AS builder

WORKDIR /opt

COPY ./client/package.json /opt
COPY ./secrets /opt/secrets

RUN yarn install

COPY ./client /opt/
RUN yarn test-deploy
RUN yarn build

FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:stable
WORKDIR /opt
COPY --from=builder /opt/dist /opt
COPY --from=builder /opt/secrets /opt

RUN echo /opt/api_key.json > /opt/boto
ENV BOTO_CONFIG=/opt/boto 

RUN gsutil cp -r /opt/assets /opt/index.html /opt/background.png gs://flag-tic-tac-toe-client/
