let currentLanguage = null;

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('query').value.toLowerCase();
    const language = document.getElementById('language').value;
    const resultsContainer = document.getElementById('results');
    const resultsTable = document.getElementById('resultsTable');
    const addForm = document.getElementById('addForm');
    resultsContainer.innerHTML = '';
    resultsTable.classList.add('hidden');
    addForm.classList.add('hidden');

    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    fetch(`/search?query=${query}&language=${language}`)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                resultsTable.classList.remove('hidden');
                const results = data.results;
                results.forEach(result => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${result.id}</td>
                        <td>${result.hanzi || result.kanji}</td>
                        <td>${result.pinyin || result.kana}</td>
                        <td>${result.meaning}</td>
                        <td>${result.part_of_speech || ''}</td>
                        <td>
                            <button class="actionButton viewButton" data-id="${result.id}" data-language="${language}">
                                👁
                            </button>
                        </td>
                    `;
                    resultsContainer.appendChild(tr);
                });

                document.querySelectorAll('.viewButton').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const language = this.getAttribute('data-language');
                        window.location.href = `/view.html?id=${id}&language=${language}`;
                    });
                });
            } else {
                console.error('No results found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('showAllJapanese').addEventListener('click', function() {
    const resultsContainer = document.getElementById('results');
    const resultsTable = document.getElementById('resultsTable');
    const addForm = document.getElementById('addForm');
    resultsContainer.innerHTML = '';
    addForm.classList.add('hidden');

    if (currentLanguage === 'japanese' && !resultsTable.classList.contains('hidden')) {
        resultsTable.classList.add('hidden');
        return;
    }

    currentLanguage = 'japanese';

    document.getElementById('headerHanzi').textContent = 'Kanji';
    document.getElementById('headerPinyin').textContent = 'Kana';

    fetch(`/search?query=&language=japanese`)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                resultsTable.classList.remove('hidden');
                const results = data.results;
                results.forEach(result => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${result.id}</td>
                        <td>${result.kanji}</td>
                        <td>${result.kana}</td>
                        <td>${result.meaning}</td>
                        <td>${result.part_of_speech || ''}</td>
                        <td>
                            <button class="actionButton viewButton" data-id="${result.id}" data-language="japanese">
                                👁
                            </button>
                        </td>
                    `;
                    resultsContainer.appendChild(tr);
                });

                document.querySelectorAll('.viewButton').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const language = this.getAttribute('data-language');
                        window.location.href = `/view.html?id=${id}&language=${language}`;
                    });
                });
            } else {
                console.error('No results found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('showAllMandarin').addEventListener('click', function() {
    const resultsContainer = document.getElementById('results');
    const resultsTable = document.getElementById('resultsTable');
    const addForm = document.getElementById('addForm');
    resultsContainer.innerHTML = '';
    addForm.classList.add('hidden');

    if (currentLanguage === 'mandarin' && !resultsTable.classList.contains('hidden')) {
        resultsTable.classList.add('hidden');
        return;
    }

    currentLanguage = 'mandarin';

    document.getElementById('headerHanzi').textContent = 'Hanzi';
    document.getElementById('headerPinyin').textContent = 'Pinyin';

    fetch(`/search?query=&language=mandarin`)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                resultsTable.classList.remove('hidden');
                const results = data.results;
                results.forEach(result => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${result.id}</td>
                        <td>${result.hanzi}</td>
                        <td>${result.pinyin}</td>
                        <td>${result.meaning}</td>
                        <td>${result.part_of_speech || ''}</td>
                        <td>
                            <button class="actionButton viewButton" data-id="${result.id}" data-language="mandarin">
                                👁
                            </button>
                        </td>
                    `;
                    resultsContainer.appendChild(tr);
                });

                document.querySelectorAll('.viewButton').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const language = this.getAttribute('data-language');
                        window.location.href = `/view.html?id=${id}&language=${language}`;
                    });
                });
            } else {
                console.error('No results found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('toggleAddForm').addEventListener('click', function() {
    const addForm = document.getElementById('addForm');
    const resultsTable = document.getElementById('resultsTable');
    addForm.classList.toggle('hidden');
    resultsTable.classList.add('hidden');
});

document.getElementById('addLanguage').addEventListener('change', function() {
    const language = this.value;
    const kanjiGroup = document.getElementById('kanjiGroup');
    const kanaGroup = document.getElementById('kanaGroup');
    const meaningGroup = document.getElementById('meaningGroup');
    const partOfSpeechGroup = document.getElementById('partOfSpeechGroup');
    const exampleSentenceGroup = document.getElementById('exampleSentenceGroup');
    const notesGroup = document.getElementById('notesGroup');
    const addButton = document.getElementById('addButton');

    kanjiGroup.classList.remove('hidden');
    kanaGroup.classList.remove('hidden');
    meaningGroup.classList.remove('hidden');
    partOfSpeechGroup.classList.remove('hidden');
    exampleSentenceGroup.classList.remove('hidden');
    notesGroup.classList.remove('hidden');
    addButton.classList.remove('hidden');

    const kanjiInput = document.getElementById('kanji');
    const kanaInput = document.getElementById('kana');

    if (language === 'japanese') {
        kanjiInput.placeholder = 'Kanji';
        kanaInput.placeholder = 'Kana';
    } else if (language === 'mandarin') {
        kanjiInput.placeholder = 'Hanzi';
        kanaInput.placeholder = 'Pinyin';
    }
});

document.getElementById('addForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const language = document.getElementById('addLanguage').value;
    const kanji = document.getElementById('kanji').value;
    const kana = document.getElementById('kana').value;
    const meaning = document.getElementById('meaning').value;
    const partOfSpeech = document.getElementById('partOfSpeech').value;
    const exampleSentence = document.getElementById('exampleSentence').value;
    const notes = document.getElementById('notes').value;

    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language, kanji, kana, meaning, partOfSpeech, exampleSentence, notes })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Vocabulary added successfully!');
        } else {
            alert('Failed to add vocabulary.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});