package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
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
	NodeAddress string `json:"nodeAddress"`
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
	if data.Url == "" || data.NodeAddress == "" || data.PhoneNumber == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print("incomplete: ", data)
		return
	}
	log.Print(data)
	nodeAddress, err := json.Marshal(data.NodeAddress)
	if err != nil {
		log.Fatal(err)
	}

	newContent := getContent(data.Url, data.NodeAddress)

	_, err = db.Exec("insert into watch (url,node_address,phone_number,content) "+
		"values (?, ?, ?, ?)", data.Url, nodeAddress, data.PhoneNumber, newContent)
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
				var url, nodeAddress, phoneNumber string
				var content sql.NullString
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
					log.Printf(newContent)
					if !content.Valid {
					} else if content.String == newContent {
						log.Printf("content at %s has not changed\n", url)
					} else {
						log.Printf("content changed at %s!\n", url)
						s := fmt.Sprintf("update watch set content=\"%s\" where url=\"%s\" and phone_number=\"%s\" and node_address=\"%s\"",
							newContent, url, phoneNumber, nodeAddress)
						_, err = db.Exec(s)
						if err != nil {
							log.Print(err)
							return
						}
						twilio.SendSMS("+14695072505", "+12145637620", fmt.Sprintf("content changed at %s!", url), "", "")
					}
				}()
			}
			wg.Wait()
		}
	}()
}

type ParseInput struct {
	Url      string `json:"url"`
	Selector string `json:"selector"`
}

func getContent(theUrl, address string) string {
	//v := ParseInput{Url: theUrl, Selector: address}
	//b := new(bytes.Buffer)
	//json.NewEncoder(b).Encode(v)

	values := map[string]string{"url": theUrl, "selector": address}
	jsonValue, _ := json.Marshal(values)

	res, err := http.Post("http://localhost:3000/parse", "application/json; charset=utf-8", bytes.NewBuffer(jsonValue))
	//req, err := http.NewRequest("POST", "http://localhost:3000/parse", bytes.NewBuffer(jsonValue))
	//req.Header.Set("Content-Type", "application/json")

	//res, err := http.Post("http://localhost:3000/parse", "application/json; charset=utf-8", b)
	//res, err := http.PostForm("http://localhost:3000/parse",
	//url.Values{"url": {theUrl}, "selector": {address}})
	if err != nil {
		log.Fatal(err)
	}
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}
	return string(body)
}
