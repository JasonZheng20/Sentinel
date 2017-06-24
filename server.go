package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("sqlite3", "db.sqlite3")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("create table if not exists watch (" +
		"url string," +
		"node_address string," +
		"phone_number string" +
		")")
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/watch", watchHandler)
	http.ListenAndServe(":8080", nil)
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
	if data.Url == "" || data.NodeAddress == nil || data.PhoneNumber == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print("incomplete: ", data)
		return
	}
	log.Print(data)
	nodeAddress, err := json.Marshal(data.NodeAddress)
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("insert into watch (url,node_address,phone_number) "+
		"values (?, ?, ?)", data.Url, nodeAddress, data.PhoneNumber)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}
	w.WriteHeader(http.StatusOK)
}
