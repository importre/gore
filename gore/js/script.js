var input = null;
var input1 = null;
var input1bg = null;
var find1 = null;

window.onload = function() {
  input = document.getElementById("input");
  input1 = document.getElementById("input1");
  input1bg = document.getElementById("input1bg");
  find1 = document.getElementById("find1");
  find1.focus();
  sample();
}

//function trim(str) {
//  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
//}

function sample() {

  find1.value = "</?[^<>]+?>";
  input1.value = "<go>\n\t<pkg>fmt</pkg>\n\t<pkg>regexp</pkg>\n</go>";
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

