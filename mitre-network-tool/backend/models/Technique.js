const mongoose = require("mongoose");

const TechniqueSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  tactic: { type: String },
  vulnerability: [{type: String}],
  platforms: [{ type: String }], 
  relevant_nodes: [{ type: String }],
});

module.exports = mongoose.model("Technique", TechniqueSchema);
