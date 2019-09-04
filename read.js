var mongooseDrv = require("mongoose");
var schema = mongooseDrv.Schema;
mongooseDrv.connect('mongodb://admin:abcdef1@ds151997.mlab.com:51997/storetest', { useMongoClient: true });
var connection = mongooseDrv.connection;
 
if (connection !== "undefined") {
    console.log(connection.readyState.toString());
    var path = require("path");
    var grid = require("gridfs-stream");
    var fs = require("fs");
    grid.mongo = mongooseDrv.mongo;
    connection.once("open", () => {
      console.log("Connection Open");
      var gridfs = grid(connection.db);
      if (gridfs) {
          var fsstreamwrite = fs.createWriteStream(
              path.join(__dirname, "./test_data.csv")
          );

          var readstream = gridfs.createReadStream({
              filename: "test_data.csv"
          });
          readstream.pipe(fsstreamwrite);
          readstream.on("close", function (file) {
              console.log("File Read successfully from database");
          });
      } else {
          console.log("Sorry No Grid FS Object");
      }
    });
} else {
 
    console.log('Sorry not connected');
}
console.log("done");