package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"regexp"

	bs "github.com/lukeorth/battleship-solver"
)

var (
    evaluateRe = regexp.MustCompile(`^\/evaluate[\/]*$`)
    testRe = regexp.MustCompile(`^\/test[\/]*$`)
)

type battleshipHandler struct{}

func (h *battleshipHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("content-type", "application/json")
    switch {
        case r.Method == http.MethodPost && evaluateRe.MatchString(r.URL.Path):
            h.Evaluate(w, r)
            return
        case r.Method == http.MethodGet && testRe.MatchString(r.URL.Path):
            h.Test(w, r)
            return
        default:
            notFound(w, r)
            return
    }
}

func (h *battleshipHandler) Evaluate(w http.ResponseWriter, r *http.Request) {
    var solver bs.Solver
    if err := json.NewDecoder(r.Body).Decode(&solver); err != nil {
        internalServerError(w, r)
        return
    }
    solver.Evaluate()
    jsonBytes, err := json.Marshal(&solver)
    if err != nil {
        internalServerError(w, r)
        return
    }
    w.WriteHeader(http.StatusOK)
    w.Write(jsonBytes)
}

func (h *battleshipHandler) Test(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Test\n")
}

func internalServerError(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusInternalServerError)
    w.Write([]byte("internal server error"))
}

func notFound(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusNotFound)
    w.Write([]byte(`{"error": "not found"}`))
}

func main() {
    addr := os.Getenv("LISTEN_ADDR")
    if addr == "" {
        addr = "0.0.0.0"
    }
    port := os.Getenv("LISTEN_PORT")
    if port == "" {
        port = "8080"
    }
    mux := http.NewServeMux()
    handler := &battleshipHandler{}
    mux.Handle("/evaluate", handler)
    mux.Handle("/test", handler)

    fmt.Printf("Starting the Server at %s\n", addr + ":" + port)
    http.ListenAndServe(addr + ":" + port, mux)
}
