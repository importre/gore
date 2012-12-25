package main

import (
	"fmt"
	"html"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"text/template"
)

const (
	tmplFile = "index.html"
	markTag  = "mark"
	openTag  = "@#"
	closeTag = "#@"
)

var (
	tmpl *template.Template
)

func init() {
	initTemplate()
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/find/", findHandler)
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
	tmpl = template.New(tmplFile)
	tmpl, _ = tmpl.ParseFiles(tmplFile)
	tmpl.Execute(w, nil)
}

func findHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	expr := r.Form.Get("expr")
	source := r.Form.Get("source")
	var err error

	expr, err = url.QueryUnescape(expr)
	source, err = url.QueryUnescape(source)
	//fmt.Println(expr);
	//fmt.Println(source);

	re, err := regexp.Compile(expr)
	if nil != err {
		log.Println(err)
	} else if len(expr) > 0 {
		markTmpl := fmt.Sprintf("%s%s%s$0%s/%s%s",
			openTag, markTag, closeTag, openTag, markTag, closeTag)
		source = re.ReplaceAllString(source, markTmpl)
	}

	source = html.EscapeString(source)
	source = strings.Replace(source, "%", "%%", -1)
	source = strings.Replace(source, openTag, "<", -1)
	source = strings.Replace(source, closeTag, ">", -1)
	source = strings.Replace(source, "\n", "<br/>", -1)
	respMsg := source
	fmt.Fprintf(w, respMsg)
}
