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

RUN echo "SERVICE_ACCOUNT" > /opt/boto
ENV BOTO_CONFIG=/opt/boto 

RUN gsutil -i flag-tic-tac-toe-554@flag-tic-tac-toe.iam.gserviceaccount.com@flag-tic-tac-toe cp -r /opt/assets /opt/index.html /opt/background.png gs://flag-tic-tac-toe-client
