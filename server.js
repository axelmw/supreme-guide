const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware for JSON-parsing

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});

const treeRoutes = require("./routes");
app.use("/api", treeRoutes);
