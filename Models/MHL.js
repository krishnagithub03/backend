const mongoose = require("mongoose");

const MHLschema = new mongoose.Schema({
    matchName: {
        type: String,
        required: true,
      }
})

module.exports=mongoose.model("MHL", MHLschema);