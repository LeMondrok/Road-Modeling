const Bundler = require('parcel-bundler');
const express = require('express');

let bundler = new Bundler('./main.html');
let app = express();

app.use(bundler.middleware());
app.listen(process.env.PORT || 3000);

