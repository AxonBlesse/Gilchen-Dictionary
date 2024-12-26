// filepath: /c:/Users/gilan/OneDrive/Documents/My Learning/Programming/GilsenOshiete!/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Tambahkan header CSP
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' https://fonts.gstatic.com https://migaku-public-data.migaku.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://vercel.live; img-src 'self' data:; connect-src 'self'");
    next();
});

// Fungsi untuk mendapatkan path database berdasarkan bahasa
const getDbPath = (language) => {
    return language === 'mandarin' 
        ? path.resolve(__dirname, 'databases/mandarin.db') 
        : path.resolve(__dirname, 'databases/japanese.db');
};

// Fungsi untuk membuat koneksi database berdasarkan bahasa
const getDbConnection = (language) => {
    const dbPath = getDbPath(language);
    return new sqlite3.Database(dbPath);
};

// Endpoint untuk mendapatkan data
app.get('/data', (req, res) => {
    const language = req.query.language;
    const db = getDbConnection(language);

    db.all('SELECT * FROM vocabulary', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });

    db.close();
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});