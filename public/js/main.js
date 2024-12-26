document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const resultsTable = document.getElementById('resultsTable');
    const resultsBody = document.getElementById('results');
    const addForm = document.getElementById('addForm');
    const addBatchForm = document.getElementById('addBatchForm');
    const toggleAddFormButton = document.getElementById('toggleAddForm');
    const toggleAddBatchFormButton = document.getElementById('toggleAddBatchForm');
    const languageSelect = document.getElementById('language');
    let currentLanguage = null;

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('query').value;
        const language = languageSelect.value;

        if (!language) {
            alert('Please select a language.');
            return;
        }

        fetch(`/data?language=${language}&query=${query}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    resultsBody.innerHTML = '';
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.id}</td>
                            <td>${item.word}</td>
                            <td>${item.reading}</td>
                            <td>${item.meaning}</td>
                            <td class="actions-column"><button class="btn btn-view">👁</button></td>
                        `;
                        resultsBody.appendChild(row);
                    });
                    resultsTable.classList.remove('hidden');
                } else {
                    console.error('Data is not an array:', data);
                }
            })
            .catch(error => console.error('Error:', error));
    });

    document.getElementById('showAll').addEventListener('click', function() {
        const language = languageSelect.value;

        if (!language) {
            alert('Please select a language.');
            return;
        }

        fetch(`/data?language=${language}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    resultsBody.innerHTML = '';
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.id}</td>
                            <td>${item.word}</td>
                            <td>${item.reading}</td>
                            <td>${item.meaning}</td>
                            <td class="actions-column"><button class="btn btn-view">👁</button></td>
                        `;
                        resultsBody.appendChild(row);
                    });
                    resultsTable.classList.remove('hidden');
                    currentLanguage = language;
                } else {
                    console.error('Data is not an array:', data);
                }
            })
            .catch(error => console.error('Error:', error));

        if (!addForm.classList.contains('hidden')) {
            addForm.classList.add('hidden');
        }
        if (!addBatchForm.classList.contains('hidden')) {
            addBatchForm.classList.add('hidden');
        }
    });

    toggleAddFormButton.addEventListener('click', function() {
        addForm.classList.toggle('hidden');
        if (!addBatchForm.classList.contains('hidden')) {
            addBatchForm.classList.add('hidden');
        }
        if (!resultsTable.classList.contains('hidden')) {
            resultsTable.classList.add('hidden');
        }
    });

    toggleAddBatchFormButton.addEventListener('click', function() {
        addBatchForm.classList.toggle('hidden');
        if (!addForm.classList.contains('hidden')) {
            addForm.classList.add('hidden');
        }
        if (!resultsTable.classList.contains('hidden')) {
            resultsTable.classList.add('hidden');
        }
    });

    addForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const language = languageSelect.value;
        const word = document.getElementById('word').value;
        const reading = document.getElementById('reading').value;
        const meaning = document.getElementById('meaning').value;
        const part_of_speech = document.getElementById('part_of_speech').value;
        const example_sentence = document.getElementById('example_sentence').value;
        const notes = document.getElementById('notes').value;

        const newData = {
            language,
            word,
            reading,
            meaning,
            part_of_speech,
            example_sentence,
            notes
        };

        fetch('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Data added successfully!');
                addForm.reset();
                addForm.classList.add('hidden');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    addBatchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const language = languageSelect.value;
        const batchInput = document.getElementById('batchInput').value;
        const rows = batchInput.split('\n');
        const batchData = rows.map(row => {
            const [word, reading, meaning, part_of_speech, example_sentence, notes] = row.split(',');
            return { word, reading, meaning, part_of_speech, example_sentence, notes };
        });

        fetch('/data/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ language, batchData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Batch data added successfully!');
                addBatchForm.reset();
                addBatchForm.classList.add('hidden');
            } else {
                alert('Error adding batch data: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    resultsBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-view')) {
            const row = event.target.closest('tr');
            const id = row.children[0].textContent;
            const language = languageSelect.value;
            window.location.href = `/view.html?id=${id}&language=${language}`;
        }
    });
});