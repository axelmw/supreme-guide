const express = require("express");
const path = require("path");
const app = express();
const pool = require("./db"); // Koble til PostgreSQL
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware for logging
app.use((req, res, next) => {
    console.log(`➡️ [${req.method}] ${req.url}`);
    console.log("📝 Received body:", req.body);
    next();
});

const treeRoutes = require("./routes");
app.use("/api", treeRoutes);

// Server statiske filer fra "public"-mappen
app.use(express.static(path.join(__dirname, "public")));

// For alle andre requests, send index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Sjekk databaseforbindelsen før serverstart
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Kan ikke koble til databasen!", err);
        process.exit(1); // Avslutt programmet hvis databasen ikke er tilgjengelig
    } else {
        console.log("✅ Tilkoblet til databasen:", res.rows[0]);
        app.listen(PORT, () => {
            console.log(`🚀 Server kjører på http://localhost:${PORT}`);
        });
    }
});
