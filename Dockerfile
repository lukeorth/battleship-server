FROM golang:1.19 AS build-stage
WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o battleship-solver

FROM alpine:3.17 AS build-release-stage
COPY --from=build-stage /app/battleship-solver /battleship-solver
COPY --from=build-stage /app/frontend /frontend
RUN chmod +x battleship-solver
ENTRYPOINT ["/battleship-solver"]
