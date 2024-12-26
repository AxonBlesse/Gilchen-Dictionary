const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));

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
app.get('/get', (req, res) => {
    const { id, language } = req.query;
    const table = language === 'mandarin' ? 'words_mandarin' : 'words_japanese';
    const db = getDbConnection(language);
    db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ result: row });
    });
    db.close();
});

// Endpoint untuk memperbarui data
app.post('/update', (req, res) => {
    const { id, language, kanji, kana, meaning, partOfSpeech, exampleSentence, notes } = req.body;
    const table = language === 'mandarin' ? 'words_mandarin' : 'words_japanese';
    const columnKanji = language === 'mandarin' ? 'hanzi' : 'kanji';
    const columnKana = language === 'mandarin' ? 'pinyin' : 'kana';
    const db = getDbConnection(language);
    db.run(`UPDATE ${table} SET ${columnKanji} = ?, ${columnKana} = ?, meaning = ?, part_of_speech = ?, example_sentence = ?, notes = ? WHERE id = ?`,
        [kanji, kana, meaning, partOfSpeech, exampleSentence, notes, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        }
    );
    db.close();
});

// Endpoint untuk menghapus data
app.delete('/delete', (req, res) => {
    const { id, language } = req.query;
    const table = language === 'mandarin' ? 'words_mandarin' : 'words_japanese';
    const db = getDbConnection(language);
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
    db.close();
});

// Endpoint untuk menambahkan data baru
app.post('/add', (req, res) => {
    const { language, kanji, kana, meaning, partOfSpeech, exampleSentence, notes } = req.body;
    const table = language === 'mandarin' ? 'words_mandarin' : 'words_japanese';
    const columnKanji = language === 'mandarin' ? 'hanzi' : 'kanji';
    const columnKana = language === 'mandarin' ? 'pinyin' : 'kana';
    const db = getDbConnection(language);
    db.run(`INSERT INTO ${table} (${columnKanji}, ${columnKana}, meaning, part_of_speech, example_sentence, notes) VALUES (?, ?, ?, ?, ?, ?)`,
        [kanji, kana, meaning, partOfSpeech, exampleSentence, notes],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        }
    );
    db.close();
});

// Endpoint untuk mencari data
app.get('/search', (req, res) => {
    const { query, language } = req.query;
    const table = language === 'mandarin' ? 'words_mandarin' : 'words_japanese';
    const columnKanji = language === 'mandarin' ? 'hanzi' : 'kanji';
    const columnKana = language === 'mandarin' ? 'pinyin' : 'kana';
    const db = getDbConnection(language);
    db.all(`SELECT * FROM ${table} WHERE ${columnKanji} LIKE ? OR ${columnKana} LIKE ? OR meaning LIKE ?`, [`%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ results: rows });
    });
    db.close();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});