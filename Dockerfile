FROM golang:1.19 AS build-stage
WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /battleship-solver

FROM alpine:3.17 AS build-release-stage
WORKDIR /
COPY --from=build-stage /battleship-solver /battleship-solver
RUN chmod +x battleship-solver
ENTRYPOINT ["/battleship-solver"]
