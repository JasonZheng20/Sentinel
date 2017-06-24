package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("sqlite", "db.sqlite3")
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/watch", watchHandler)
	http.ListenAndServe(":80", nil)
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "index.html")
}

type WatchData struct {
	Url         string `json:"url"`
	NodeAddress []int  `json:"nodeAddress"`
	PhoneNumber string `json:"phoneNumber"`
}

func watchHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	decoder := json.NewDecoder(r.Body)
	var data WatchData
	err := decoder.Decode(&data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}
	log.Print(data)
	w.WriteHeader(http.StatusOK)
}
