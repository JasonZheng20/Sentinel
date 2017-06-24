var url = 'http://validator.w3.org/'; // website you want to scrape

function getSourceAsDOM(url)
{
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    parser=new DOMParser();
    return parser.parseFromString(xmlhttp.responseText,"text/html");
}
const source = getSourceAsDOM(url);
console.log(source);
