FROM node:latest AS builder

ARG SERVICE_ACCOUNT

WORKDIR /opt

# COPY ./client/package.json /opt
# # COPY ./secrets/api_key.json /opt

# RUN yarn install

# COPY ./client /opt/
# RUN yarn test-deploy
# RUN yarn build
RUN echo ${SERVICE_ACCOUNT} >> /opt/key.json
RUN cat /opt/key.json

# FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:stable

# ARG GIT_TAG

# WORKDIR /workspace
# COPY --from=builder /opt/dist /workspace
# COPY --from=builder /opt/api_key.json /workspace/api_key.json

# RUN echo "[Credentials]\ngs_service_key_file=/workspace/api_key.json" > /workspace/boto
# ENV BOTO_CONFIG=/workspace/boto 

# RUN gsutil cp -r /workspace/assets /workspace/index.html /workspace/background.png gs://flag-tic-tac-toe-client/$GIT_TAG
