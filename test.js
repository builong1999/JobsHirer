
var url_string =  "localhost:5000/my-cv-?i=12";
// var url_string = window.location.href;
var url = new URL(url_string)
var c = url.searchParams.get('i')
console.log(c)