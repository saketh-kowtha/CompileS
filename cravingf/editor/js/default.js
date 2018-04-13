var myCodeMirror = CodeMirror(document.getElementById("editor"), {
	  value: "function myScript(){return 100;}\n",
  	  mode:  "javascript",
      lineNumbers : true
      });