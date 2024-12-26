document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const resultsTable = document.getElementById('resultsTable');
    const resultsBody = document.getElementById('results');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('query').value;
        const language = document.getElementById('language').value;

        fetch(`/data?language=${language}&query=${query}`)
            .then(response => response.json())
            .then(data => {
                resultsBody.innerHTML = '';
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.hanzi}</td>
                        <td>${item.pinyin}</td>
                        <td>${item.meaning}</td>
                        <td>${item.partOfSpeech}</td>
                        <td><button class="btn btn-edit">Edit</button></td>
                    `;
                    resultsBody.appendChild(row);
                });
                resultsTable.classList.remove('hidden');
            })
            .catch(error => console.error('Error:', error));
    });
});