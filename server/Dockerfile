FROM golang:1.23.1

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./
COPY .env ./
COPY controllers/ ./controllers
COPY models/ ./models
COPY repositories/ ./repositories
COPY services/ ./services

RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-gs-ping

EXPOSE 8080

CMD ["/docker-gs-ping"]
