const mongoose = require ('mongoose');
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
var grid = require("gridfs-stream");

// mongoose.connect('mongodb://admin:abcdef1@ds151997.mlab.com:51997/storetest', { useNewUrlParser: true });
mongoose.connect('mongodb://mongo:27017/filesDB', { useNewUrlParser: true }).then(() => {
    console.log('Connection to DB successful');
  }).catch(err => {
    throw new Error(err)
  });

var connection = mongoose.connection;
 
if (connection !== "undefined") {
    console.log(connection.readyState.toString());
    grid.mongo = mongoose.mongo;
    connection.once("open", () => {
      console.log("Connection Open");
    });
}

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const gridfs = grid(connection.db);
  var readstream = gridfs.createReadStream({ filename });
  return readstream.pipe(res);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
