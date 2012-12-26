var input = null;
var input1 = null;
var input1bg = null;
var find1 = null;
var code = null;

//function trim(str) {
//  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
//}

function sample() {
  find1.value = "</?[^<>]+?>";
  input1.value = "<go>\n    <pkg>fmt</pkg>\n    <pkg>regexp</pkg>\n</go>";
  refresh();
}

$(document).ready(function() {
  $('#find1').keydown(function() {
    doRegex(this.value);
  });
  $('#find1').keyup(function() {
    doRegex(this.value);
  });
  $('#input1').keydown(function() {
    refresh();
  });
  $('#input1').keyup(function() {
    refresh();
  });

  input = document.getElementById("input");
  input1 = document.getElementById("input1");
  input1bg = document.getElementById("input1bg");
  find1 = document.getElementById("find1");
  find1.focus();
  code = document.getElementById("code");
  sample();
});

function doRegex(text) {
  jQuery.ajax({
    type:"POST",
    url:"/find/",
    data: {
      "expr": encodeURIComponent(text),
    "source": encodeURIComponent(input1.value)
    },
    success: function(response, s, j) {
               if("success" === s) {
                 setHighlight(response);
               }
             }
  });
  genCode(text);
}

function genCode(expr) {
  expr = expr.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\"/g, "&quot;");
  code.innerHTML =
    "re, err := regexp.Compile(\"" +
    "<b>" + expr + "</b>" +
    "\")<br/><br/>" +
    "if nil == err {<br/>" +
    "&nbsp;&nbsp;res := re.FindAllString(input, -1)<br/>" +
    "&nbsp;&nbsp;for _, data := range res {<br/>" +
    "&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(data);<br/>" +
    "&nbsp;&nbsp;}<br/>" +
    "}";
}

function refresh() {
  doRegex(find1.value);
}

function setHighlight(response) {
  input1bg.innerHTML = response + "<br/>";
  markList = input1bg.getElementsByTagName("mark");
  for(var i = 1; i < markList.length; i += 2) {
    markList[i].style.background = "#1ff7c1";
    markList[i].style.color = "#1ff7c1";
  }

  input1.style.width = "";
  var sw = input1.scrollWidth;
  var ow = input1.offsetWidth;
  input1.style.width = (sw === ow ? ow : sw + 8) + "px";
  input1.style.height =
    Math.max(input1bg.offsetHeight,input.offsetHeight - 2) + "px";
}

