const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use((req, res, next) => {
    console.log(`➡️ [${req.method}] ${req.url}`);
    console.log("📝 Received body:", req.body);
    next();
});


const treeRoutes = require("./routes");
app.use("/api", treeRoutes);


app.get("/", (req, res) => {
    res.send("API is running...");
});


app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});
