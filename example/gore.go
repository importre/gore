package main

import (
	"fmt"
	"html"
	"log"
	"net/http"
	"regexp"
	"strings"
	"text/template"
)

const (
	tmplFile = "index.html"
)

var (
	tmpl *template.Template
)

func init() {
	initTemplate()
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/data/", dataHandler)
	http.Handle("/css/", http.FileServer(http.Dir(".")))
	http.Handle("/js/", http.FileServer(http.Dir(".")))
}

func initTemplate() {
	tmpl = template.New(tmplFile)
	tmpl, _ = tmpl.ParseFiles(tmplFile)
}

func main() {
	err := http.ListenAndServe(":8080", nil)
	log.Println(err)
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	tmpl.Execute(w, nil)
}

func dataHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	expr := r.Form.Get("expr")
	source := r.Form.Get("source")

	re, err := regexp.Compile(expr)
	if nil != err {
		log.Println(err)
	} else if len(expr) > 0 {
		source = re.ReplaceAllString(source, "@#mark#@$0@#/mark#@")
	}

	source = html.EscapeString(source)
	source = strings.Replace(source, "%", "%%", -1)
	source = strings.Replace(source, "@#", "<", -1)
	source = strings.Replace(source, "#@", ">", -1)
	source = strings.Replace(source, "\n", "<br/>", -1)
	respMsg := source
	fmt.Fprintf(w, respMsg)
}
