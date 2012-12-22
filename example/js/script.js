var input = null;
var src = null;
var dst = null;

window.onload = function() {
  input = document.getElementById("input");
  input.focus();

  src = document.getElementById("src");
  dst = document.getElementById("dst");
}

function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function doRegex(text) {
  /*
  if(!text || trim(text).length == 0) {
    return
  }
  */

  data = "expr=" + encodeURIComponent(text);
  data += "&source=" + encodeURIComponent(src.innerText);
  sendRequest("/data/", data, funcReceived, "POST");
}

function getXMLHttpRequest() {
  if (window.ActiveXObject) {
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch(e) {
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch(e1) { return null; }
    }
  } else if (window.XMLHttpRequest) return new XMLHttpRequest();
  else return null;
}

function sendRequest(url,params,callback,method) {
  httpRequest=getXMLHttpRequest();
  var httpMethod=method ? method : 'GET';
  if(httpMethod!='GET' && httpMethod!='POST') httpMethod='GET';
  var httpParams=(params==null || params=='') ? null : params;
  var httpUrl=url;
  if (httpMethod=='GET' && httpParams != null) httpUrl=httpUrl+"?"+httpParams;
  httpRequest.open(httpMethod,httpUrl,true);
  httpRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  httpRequest.onreadystatechange=callback;
  httpRequest.send(httpMethod=='POST' ? httpParams : null);
}

function funcReceived() {
  if (httpRequest.readyState == 4) {
    if (httpRequest.status == 200) {
      dst.innerHTML = httpRequest.responseText;
    }
  }
}

