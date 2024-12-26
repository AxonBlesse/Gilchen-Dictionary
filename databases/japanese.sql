-- CREATE TABLE words_japanese (
--   id INTEGER PRIMARY KEY,
--   word TEXT NOT NULL,
--   reading TEXT NOT NULL,
--   meaning TEXT NOT NULL,
--   part_of_speech TEXT NULL,
--   example_sentence TEXT NULL,
--   notes TEXT NULL,
--   UNIQUE (word, reading, meaning)
-- );

-- INSERT INTO words_japanese (word, reading, meaning) 
-- VALUES 
--     ('日本', 'にほん', 'jepang'),
--     ('日本人', 'にほん人', 'jepang'),
--     ('日本語', 'にほんご', 'bahasa jepang');

-- menghapus tabel
-- DROP TABLE words_japanese;

-- .mode csv
-- .import words.csv vocabulary

-- menampilkan isi tabel
SELECT * FROM words_japanese;