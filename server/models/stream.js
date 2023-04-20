const mongoose = require("mongoose");

// create a constant that will store the schema and define a shape of our document/launches
const chunksSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Stream", chunksSchema);
