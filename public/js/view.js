document.addEventListener('DOMContentLoaded', function() {
    const viewForm = document.getElementById('viewForm');
    const backButton = document.getElementById('backButton');
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const deleteButton = document.getElementById('deleteButton');
    const inputs = viewForm.querySelectorAll('input');

    let originalData = {};

    // Ambil ID dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const language = urlParams.get('language');

    // Fungsi untuk mengambil data dari server
    function fetchData() {
        fetch(`/data/${id}?language=${language}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Isi form dengan data yang diambil
                    inputs.forEach(input => {
                        input.value = data[input.id];
                        originalData[input.id] = data[input.id];
                    });
                } else {
                    alert('Data not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('An error occurred while fetching data.');
            });
    }

    // Panggil fungsi fetchData saat halaman dimuat
    fetchData();

    backButton.addEventListener('click', function() {
        window.history.back();
    });

    editButton.addEventListener('click', function() {
        inputs.forEach(input => {
            input.removeAttribute('readonly');
        });
        editButton.classList.add('hidden');
        saveButton.classList.remove('hidden');
    });

    viewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let dataChanged = false;
        inputs.forEach(input => {
            if (input.value !== originalData[input.id]) {
                dataChanged = true;
            }
        });

        if (!dataChanged) {
            alert('You must change some data.');
            return;
        }

        // Simpan data yang telah diubah
        const updatedData = {};
        inputs.forEach(input => {
            updatedData[input.id] = input.value;
        });

        fetch(`/data/${id}?language=${language}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Data successfully updated.');
                inputs.forEach(input => {
                    input.setAttribute('readonly', 'readonly');
                });
                editButton.classList.remove('hidden');
                saveButton.classList.add('hidden');
                // Perbarui data asli
                originalData = { ...updatedData };
            } else {
                alert('Failed to update data.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating data.');
        });
    });

    deleteButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this item?')) {
            fetch(`/data/${id}?language=${language}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Data successfully deleted.');
                    window.location.href = '/';
                } else {
                    alert('Failed to delete data.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting data.');
            });
        }
    });
});