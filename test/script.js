var url = 'https://developer.mozilla.org/en-US/docs/Tools/Add-ons/DOM_Inspector/Introduction_to_DOM_Inspector'; // website you want to scrape

function getSourceAsDOM(url)
{
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    parser=new DOMParser();
    return parser.parseFromString(xmlhttp.responseText,"text/html");
}
const source = getSourceAsDOM(url);


function importNodes(root, level) {
  // console.log(level);
  //if not a picture (if root is img, change the src ./ to cwd) //this does NOT work for divs with classes that specify background-image
  if (root.tagName == 'img' || root.tagName == 'IMG') {
    console.log(root);
    const defaultValue = root.getAttribute('src');
    console.log(defaultValue);
    let newSrc = defaultValue.replace('./', url); //get the URL
    newSrc = newSrc.replace('//www', 'https://www'); //there are probably more edge cases
    console.log(newSrc);
    root.src = newSrc;
  }
  document.importNode(root);
  for (const child of root.childNodes) {
    importNodes(child, level++);
  }
}
importNodes(source.querySelector('body'), 0); //doesn't append


console.log(document.querySelector('#banner'));
// console.log()
// console.log(source);
// console.log(source.querySelector('body'));

// document.importNode(source.querySelector('body'), true);
// console.log(document.querySelector('body')); //source url + source change the base url
//
//
// const resultArr = [];
// function walkTree(root, level) {
//   level += 1;
//   if (root.nodeType === Node.TEXT_NODE) {
//     console.log(level + ' text:' + root.textContent);
//   } else {
//     console.log(level + root.nodeName);
//   }
//   for (const child of root.childNodes) {
//     walkTree(child, level);
//   }
// }
//
// const allText = walkTree(source, 1);
// console.log(allText);
//
// console.log(resultArr);
