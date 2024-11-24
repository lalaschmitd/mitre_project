const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  label: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Node", NodeSchema);
