const mongoose = require ('mongoose');

mongoose.connect('mongodb://mongo:27017/filesDB', { useNewUrlParser: true }).then(() => {
      console.log('Connection to DB successful');
    }).catch(err => {
      throw new Error(err)
    });
// Prodution mode

// mongoose.connect(`mongodb://admin:abcdef1@ds151997.mlab.com:51997/storetest`, { useNewUrlParser: true }).then(() => {
//   console.log('Connection to DB successful');
// }).catch(err => {
//   throw new Error(err)
// });

//3. The Connection Object
var connection = mongoose.connection;
if (connection !== "undefined") {
    //4. The Path object
    var path = require("path");
    //5. The grid-stream
    var grid = require("gridfs-stream");
    //6. The File-System module
    var fs = require("fs");
    var dir = "./store";
    //Set the directory

    //8. Establish connection between Mongo and GridFS
    grid.mongo = mongoose.mongo;
    //9.Open the connection and write file
    connection.once("open", () => {
        console.log("Connection Open");
        var gridfs = grid(connection.db);
        if (gridfs) {
            //9a. create a stream, this will be
            //used to store file in database
            let count = 0;
            fs.readdirSync(dir).forEach(filename => {
                const filepath = path.resolve(dir, filename);
                let streamwrite = gridfs.createWriteStream({
                    //the file will be stored with the name
                    filename: filename
                });
                fs.createReadStream(filepath).pipe(streamwrite);
                //9c. Complete the write operation
                streamwrite.on("close", file => {
                    console.log(`Write ${file.filename} written successfully in database`)
                    count += 1
                    if(fs.readdirSync(dir).length === count){
                        console.log('done!')
                        connection.close()
                    }
                });
            });
        } else {
            console.log("Sorry No Grid FS Object");
        }
    });
} else {
    console.log('Sorry not connected');
}
