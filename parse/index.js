import express from 'express';
import bodyParser from 'body-parser';
import request from 'request-promise';
import cheerio from 'cheerio';
const app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// POST /parse
//
// url - string of url
// selector - selector of specific node to get text of
app.post('/parse', (req, res) => {
  console.log(req.body);
  if(!req.body.url || !req.body.selector) {
    res.status(422).send('ELI YOU NEED url AND selector JSON IN BODY');
    return;
  }

  //let selector = JSON.parse( JSON.stringify( req.body.selector ) );
  let selector = req.body.selector.replace(/\\u003e/g, '>');
  selector = selector.replace(/"/g, '');
  //JSON.parse( JSON.stringify( req.body.selector ) );
  console.log(selector);
  //req.body.selector.split('\\u003e').join(' > ');
  //req.body.selector = req.body.selector.replace(/\\u003e/g, '>');
  //req.body.selector = unescape( encodeURIComponent( req.body.selector ) )
  

  request(req.body.url)
    .then((html) => {
      const $ = cheerio.load(html);
      console.log($(selector).text());
      res.send($(selector).text());
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    })
})

app.listen(3000, () => {
  console.log(3000);
})
