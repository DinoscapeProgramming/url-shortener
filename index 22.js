const express = require('express');
const app = express();
const fs = require('fs');
const shortId = require('shortid');
const validUrl = require('valid-url');

app.all('/:code', (req, res) => {
  const code = req.params.code
  let data = fs.readFileSync('./db.json', 'utf8')
  data = JSON.parse(data)
  const url = data[code]
  if (url) {
    res.redirect(url)
  } else if (code != "shorten") {
    res.status(404).json('No URL found')
  } else {
    if (!validUrl.isUri(req.query.url)) return res.json("Not a valid url");
    const urlCode = shortId.generate()
    let db = fs.readFileSync('./db.json', 'utf8')
    db = JSON.parse(db)
    if (Object.values(db).includes(req.query.url)) {
      res.json({ [Object.keys(db)[Object.values(db).indexOf(req.query.url)]]: req.query.url })
    } else {
      db = Object.assign(db, { [urlCode]: req.query.url })
      res.json({ [urlCode]: req.query.url })
    fs.writeFileSync('./db.json', JSON.stringify(db), 'utf8')
    }
  }
})

app.all('/', (req, res) => {
  res.json("A simple URL shortener made with express.")
})

app.use('favicon.ico', express.static("favicon.ico"))

app.listen(3000, () => {
  console.log("I'm ready!")
})