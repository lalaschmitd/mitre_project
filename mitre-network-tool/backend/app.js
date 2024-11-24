const express = require("express");
const connectToDatabase = require("./database");
const analyzeRoutes = require("./routes/analyze");

const app = express();
const PORT = 3000;

app.use(express.json());
connectToDatabase();

app.use("/analyze", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
