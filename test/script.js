var url = 'https://web.stanford.edu/class/cs193x/lectures/'; // website you want to scrape

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


function importNodes(root, parent) {
  // console.log(level);
  //if not a picture (if root is img, change the src ./ to cwd) //this does NOT work for divs with classes that specify background-image
  if (root.tagName == 'img' || root.tagName == 'IMG') {
    // console.log(root);
    const defaultValue = root.getAttribute('src');
    // console.log(defaultValue);
    let newSrc = defaultValue.replace('./', url); //get the URL
    newSrc = newSrc.replace('//www', 'https://www'); //there are probably more edge cases
    // console.log(newSrc);
    root.src = newSrc;
  }
  else {
    document.importNode(root);
    parent.appendChild(root);
  }
  for (const child of root.childNodes) {
    importNodes(child, root);
  }
}
importNodes(source.querySelector('body'), document.querySelector('div.append')); //doesn't append


console.log(document.querySelector('#banner'));
