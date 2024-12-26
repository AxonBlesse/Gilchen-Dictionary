const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Tambahkan header CSP
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' https://fonts.gstatic.com https://migaku-public-data.migaku.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://vercel.live; img-src 'self' data:; connect-src 'self'");
    next();
});

// Fungsi untuk mendapatkan path database
const getDbPath = (dbName) => {
    return path.resolve(__dirname, 'databases', `${dbName}.db`);
};

// Fungsi untuk mendapatkan nama tabel berdasarkan bahasa
const getTableName = (language) => {
    if (language === 'japanese') {
        return 'words_japanese';
    } else if (language === 'mandarin') {
        return 'words_mandarin';
    } else {
        throw new Error('Unsupported language');
    }
};

// Endpoint untuk membuat database baru
app.post('/create-database', (req, res) => {
    const { dbName } = req.body;
    const dbPath = getDbPath(dbName);

    console.log('Creating database with name:', dbName);

    if (fs.existsSync(dbPath)) {
        console.error('Database already exists:', dbPath);
        return res.status(400).json({ success: false, message: 'Database already exists' });
    }

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error creating database:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }

        const createTableQueryJapanese = `CREATE TABLE words_japanese (id INTEGER PRIMARY KEY, word TEXT NOT NULL, reading TEXT NOT NULL, meaning TEXT NOT NULL, part_of_speech TEXT NULL, example_sentence TEXT NULL, notes TEXT NULL, UNIQUE (word, reading, meaning))`;
        const createTableQueryMandarin = `CREATE TABLE words_mandarin (id INTEGER PRIMARY KEY, word TEXT NOT NULL, reading TEXT NOT NULL, meaning TEXT NOT NULL, part_of_speech TEXT NULL, example_sentence TEXT NULL, notes TEXT NULL, UNIQUE (word, reading, meaning))`;

        db.run(createTableQueryJapanese, (err) => {
            if (err) {
                console.error('Error creating table for Japanese:', err.message);
                return res.status(500).json({ success: false, message: err.message });
            }
        });

        db.run(createTableQueryMandarin, (err) => {
            if (err) {
                console.error('Error creating table for Mandarin:', err.message);
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true });
        });

        db.close();
    });
});

// Endpoint untuk mendapatkan data
app.get('/data', (req, res) => {
    const language = req.query.language;
    const query = req.query.query || '';
    const dbPath = getDbPath(language);
    const tableName = getTableName(language);
    const db = new sqlite3.Database(dbPath);

    const sqlQuery = query
        ? `SELECT * FROM ${tableName} WHERE word LIKE ? OR reading LIKE ? OR meaning LIKE ?`
        : `SELECT * FROM ${tableName}`;

    const params = query ? [`%${query}%`, `%${query}%`, `%${query}%`] : [];

    db.all(sqlQuery, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });

    db.close();
});

// Endpoint untuk mendapatkan data berdasarkan ID
app.get('/data/:id', (req, res) => {
    const id = req.params.id;
    const language = req.query.language;
    const dbPath = getDbPath(language);
    const tableName = getTableName(language);
    const db = new sqlite3.Database(dbPath);

    db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });

    db.close();
});

// Endpoint untuk menambahkan data
app.post('/data', (req, res) => {
    const { language, word, reading, meaning, part_of_speech, example_sentence, notes } = req.body;
    const dbPath = getDbPath(language);
    const tableName = getTableName(language);
    const db = new sqlite3.Database(dbPath);

    db.run(`INSERT INTO ${tableName} (word, reading, meaning, part_of_speech, example_sentence, notes) VALUES (?, ?, ?, ?, ?, ?)`, [word, reading, meaning, part_of_speech, example_sentence, notes], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });

    db.close();
});

// Endpoint untuk menambahkan data batch
app.post('/data/batch', (req, res) => {
    const { language, batchData } = req.body;
    const dbPath = getDbPath(language);
    const tableName = getTableName(language);
    const db = new sqlite3.Database(dbPath);

    const placeholders = batchData.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
    const values = batchData.flatMap(({ word, reading, meaning, part_of_speech, example_sentence, notes }) => [word, reading, meaning, part_of_speech, example_sentence, notes]);

    db.run(`INSERT INTO ${tableName} (word, reading, meaning, part_of_speech, example_sentence, notes) VALUES ${placeholders}`, values, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });

    db.close();
});

// Endpoint untuk memperbarui data
app.put('/data/:id', (req, res) => {
    const id = req.params.id;
    const { word, reading, meaning, part_of_speech, example_sentence, notes } = req.body;
    const language = req.query.language;
    const dbPath = getDbPath(language);
    const tableName = getTableName(language);
    const db = new sqlite3.Database(dbPath);

    db.run(`UPDATE ${tableName} SET word = ?, reading = ?, meaning = ?, part_of_speech = ?, example_sentence = ?, notes = ? WHERE id = ?`, [word, reading, meaning, part_of_speech, example_sentence, notes, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });

    db.close();
});

// Endpoint untuk menghapus data
app.delete('/data/:id', (req, res) => {
    const id = req.params.id;
    const language = req.query.language;
    const dbPath = getDbPath(language);
    const tableName = getTableName(language);
    const db = new sqlite3.Database(dbPath);

    db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });

    db.close();
});

// Endpoint untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint untuk halaman view
app.get('/view.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});