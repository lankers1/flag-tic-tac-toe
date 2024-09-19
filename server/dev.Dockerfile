FROM golang:latest

ENV PROJECT_DIR=/app \
  GO111MODULE=on \
  CGO_ENABLED=0

WORKDIR /app

RUN mkdir "/build"

COPY go.mod go.sum ./
COPY . .

RUN go mod tidy

RUN go get github.com/githubnemo/CompileDaemon
RUN go install github.com/githubnemo/CompileDaemon

ENTRYPOINT CompileDaemon -build="go build -o /build/app" -command="/build/app"
