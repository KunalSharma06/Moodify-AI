const mongoose = require("mongoose");

function connectToDb(){
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database is connected");
    }).catch(err => {
      console.log("Database is not connected");
  })
}

module.exports = connectToDb