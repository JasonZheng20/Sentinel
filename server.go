package main

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"sync"
	"time"

	"github.com/sfreiberg/gotwilio"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB
var twilio *gotwilio.Twilio

func main() {
	twilioSid := os.Getenv("TWILIO_SID")
	twilioAuthToken := os.Getenv("TWILIO_AUTH_TOKEN")
	twilio = gotwilio.NewTwilioClient(twilioSid, twilioAuthToken)
	var err error
	db, err = sql.Open("sqlite3", "db.sqlite3")
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec("create table if not exists watch (" +
		"url string not null," +
		"node_address text not null," +
		"phone_number text not null," +
		"content text" +
		")")
	if err != nil {
		log.Fatal(err)
	}
	startWatcher()
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
		log.Fatal(err)
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

func startWatcher() {
	ticker := time.NewTicker(time.Second * 5)
	go func() {
		for _ = range ticker.C {
			log.Println("Checking pages")
			var wg sync.WaitGroup
			rows, err := db.Query("select url,node_address,phone_number,content " +
				"from watch")
			if err != nil {
				log.Fatal(err)
			}
			defer rows.Close()
			for rows.Next() {
				var url, nodeAddress, phoneNumber, content string
				err := rows.Scan(&url, &nodeAddress, &phoneNumber, &content)
				if err != nil {
					log.Fatal(err)
				}
				if err != nil {
					log.Println(err)
					return
				}
				wg.Add(1)
				go func() {
					defer wg.Done()
					newContent := getContent(url, nodeAddress)
					if content == newContent {
						log.Printf("content at %s has not changed\n", url)
					} else {
						log.Printf("content changed at %s!\n", url)
					}
				}()
			}
			wg.Wait()
		}
	}()
}

func getContent(theUrl, address string) string {
	res, err := http.PostForm("localhost:8080",
		url.Values{"url": {theUrl}, "selector": {address}})
	if err != nil {
		log.Fatal(err)
	}
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}
	return string(body)
}
