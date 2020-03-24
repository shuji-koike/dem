package main

import (
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/shuji-koike/goutil"
)

// Server ...
type Server struct {
}

// Listen ...
func (s *Server) Listen(port int) {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/files", handleGetFiles)
	mux.HandleFunc("/api/match", handleGetMatch)
	mux.HandleFunc("/api/round", handleGetRound)
	mux.HandleFunc("/status", goutil.HTTPhandleGetStatus)
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	mux.Handle("/replays/", http.StripPrefix("/replays/", http.FileServer(http.Dir(*dir))))
	mux.Handle("/", http.FileServer(http.Dir("./static")))
	goutil.HTTPListenAndServe(mux, port)
}

func handleGetFiles(res http.ResponseWriter, req *http.Request) {
	var err error
	defer goutil.LogError(&err)
	if req.Method != http.MethodGet {
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	files := make([]string, 0)
	err = filepath.Walk(*dir, func(path string, info os.FileInfo, err error) error {
		name := strings.TrimPrefix(strings.TrimPrefix(path, *dir), "/")
		if strings.HasSuffix(name, ".dem") {
			files = append(files, name)
		}
		return err
	})
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		return
	}
	goutil.HTTPServeJSON(res, req, files)
}

func handleGetMatch(res http.ResponseWriter, req *http.Request) {
	var err error
	defer goutil.LogError(&err)
	if req.Method != http.MethodGet {
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	params := req.URL.Query()
	name := params.Get("name")
	if len(name) < 1 {
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	match, err := load(filepath.Join(*dir, name))
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		return
	}
	rounds := make([]Round, len(match.Rounds))
	copy(rounds, match.Rounds)
	for i := range match.Rounds {
		rounds[i].Frames = nil
	}
	match.Rounds = rounds
	goutil.HTTPServeJSON(res, req, match)
}

func handleGetRound(res http.ResponseWriter, req *http.Request) {
	var err error
	defer goutil.LogError(&err)
	if req.Method != http.MethodGet {
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	params := req.URL.Query()
	name := params.Get("name")
	if name == "" {
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	match, err := load(filepath.Join(*dir, name))
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		return
	}
	r, err := strconv.Atoi(params.Get("r"))
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	if r < 0 || r >= len(match.Rounds) {
		res.WriteHeader(http.StatusBadRequest)
		return
	}
	goutil.HTTPServeJSON(res, req, match.Rounds[r])
}
