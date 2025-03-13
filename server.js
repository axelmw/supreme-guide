const express = require("express");
const path = require("path");
const app = express();
const pool = require("./db"); // Koble til PostgreSQL
const PORT = process.env.PORT || 3000;

// ✅ Import session dependencies
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

// ✅ Configure session middleware
app.use(
    session({
        store: new pgSession({
            pool: pool, // PostgreSQL connection
            tableName: "session", // The table we created
        }),
        secret: "your_secret_key", // Change this to a strong secret
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // Secure cookies in production
            maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
        },
    })
);

app.use(express.json());

// Middleware for logging
app.use((req, res, next) => {
    console.log(`➡️ [${req.method}] ${req.url}`);
    console.log("📝 Received body:", req.body);
    next();
});

const treeRoutes = require("./routes");
app.use("/api", treeRoutes);

// ✅ Test session endpoint
app.get("/test-session", (req, res) => {
    if (!req.session.views) {
        req.session.views = 1;
    } else {
        req.session.views++;
    }
    res.json({ message: `You have visited this page ${req.session.views} times.` });
});

// ✅ NYE ROUTER (POEM, QUOTE, SUM) STARTER HER:

// 📜 GET /tmp/poem - Returnerer et dikt
app.get("/tmp/poem", (req, res) => {
    res.send("Roser er røde, fioler er blå, Node.js er gøy, det må du forstå!");
});

// 💬 GET /tmp/quote - Returnerer et tilfeldig sitat
const quotes = [
    "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
    "Do what you can, with what you have, where you are. – Theodore Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
    "Act as if what you do makes a difference. It does. – William James",
    "Happiness depends upon ourselves. – Aristotle"
];

app.get("/tmp/quote", (req, res) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    res.send(quotes[randomIndex]);
});

// ➕ POST /tmp/sum/:a/:b - Summerer to tall
app.post("/tmp/sum/:a/:b", (req, res) => {
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b);
    
    if (isNaN(a) || isNaN(b)) {
        return res.status(400).json({ error: "Begge parametrene må være tall" });
    }

    res.json({ sum: a + b });
});

// ✅ Import and initialize deck functions
const { decks, createDeck } = require("./deck");

// ✅ Kortstokk API - START HER

// 📌 POST /temp/deck - Oppretter en ny kortstokk
app.post("/temp/deck", (req, res) => {
    const deckId = Math.random().toString(36).substr(2, 8); // Generer en tilfeldig ID
    decks[deckId] = createDeck();
    res.json({ deck_id: deckId });
});

// 📌 PATCH /temp/deck/shuffle/:deck_id - Stokker kortstokken
app.patch("/temp/deck/shuffle/:deck_id", (req, res) => {
    const deckId = req.params.deck_id;
    if (!decks[deckId]) {
        return res.status(404).json({ error: `Kortstokken med ID '${deckId}' finnes ikke.` });
    }
    decks[deckId] = decks[deckId].sort(() => Math.random() - 0.5);
    res.json({ message: "Kortstokken er stokket!" });
});

// 📌 GET /temp/deck/:deck_id - Henter kortstokken
app.get("/temp/deck/:deck_id", (req, res) => {
    const deckId = req.params.deck_id;
    if (!decks[deckId]) {
        return res.status(404).json({ error: `Kortstokken med ID '${deckId}' finnes ikke.` });
    }
    res.json({ deck: decks[deckId] });
});

// 📌 GET /temp/deck/:deck_id/card - Trekker et kort
app.get("/temp/deck/:deck_id/card", (req, res) => {
    const deckId = req.params.deck_id;
    if (!decks[deckId]) {
        return res.status(404).json({ error: `Kortstokken med ID '${deckId}' finnes ikke.` });
    }
    if (decks[deckId].length === 0) {
        return res.status(400).json({ error: "Kortstokken er tom! Du kan ikke trekke flere kort." });
    }
    const card = decks[deckId].pop();
    res.json({ card });
});

// ✅ Kortstokk API - SLUTT HER

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
