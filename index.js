const express = require('express');
const app = express();
const fs = require('fs');
const shortId = require('shortid');
const validUrl = require('valid-url');
const path = require('path');

app.enable('trust proxy')

app.all('/:code', (req, res) => {
  const code = req.params.code
  let data = fs.readFileSync('./db.json', 'utf8')
  data = JSON.parse(data)
  const url = data[code]
  if (url) {
    res.redirect(url)
  } else if (code != "shorten" && code != "info") {
    res.status(404).json('No URL found')
  } else if (code === "shorten") {
    if (!validUrl.isUri(req.query.url)) return res.send("Not a valid url");
    const urlCode = shortId.generate()
    let db = fs.readFileSync('./db.json', 'utf8')
    db = JSON.parse(db)
    if (Object.values(db).includes(req.query.url)) {
      res.send(req.protocol + "://" + req.get('host') + "/" + Object.keys(db)[Object.values(db).indexOf(req.query.url)])
    } else {
      res.send(req.protocol + "://" + req.get('host') + "/" + urlCode)
      db = Object.assign(db, { [urlCode]: req.query.url })
    fs.writeFileSync('./db.json', JSON.stringify(db), 'utf8')
    }
 }
})

app.all('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

const listen = app.listen(3000, () => {
  console.log("I'm ready on port", listen.address().port)
})
