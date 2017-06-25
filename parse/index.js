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
  console.log('lol');
  if(!req.body.url || !req.body.selector) {
    res.status(422).send('ELI YOU NEED url AND selector JSON IN BODY');
    return;
  }

  request(req.body.url)
    .then((html) => {
      const $ = cheerio.load(html);
      res.send($(req.body.selector).text());
    })
    .catch((e) => {
      res.sendStatus(500);
    })
})

app.listen(3000, () => {
  console.log(3000);
})
