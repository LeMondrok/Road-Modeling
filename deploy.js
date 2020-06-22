const Bundler = require('parcel-bundler');
const express = require('express');

let bundler = new Bundler('./main.html');
let app = express();

app.get("/kekw", (req, resp) => {resp.send("meme")})

app.use(bundler.middleware());
app.listen(5000);

