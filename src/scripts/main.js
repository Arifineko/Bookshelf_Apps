
const dataBook = JSON.parse(localStorage.getItem('book')) || [];

render()

const bookSubmit = document.getElementById('inputBook');

bookSubmit.addEventListener('submit', (e) => {

    e.preventDefault();

    const bookTitleInput = document.getElementById('inputBookTitle');
    const bookAuthorInput = document.getElementById('inputBookAuthor');
    const bookYearInput = document.getElementById('inputBookYear');
    const bookIsCompleteInput = document.getElementById('inputBookIsComplete');

    const bookTitle = bookTitleInput.value;
    const bookAuthor = bookAuthorInput.value;
    const bookYear = bookYearInput.value;
    const bookIsComplete = bookIsCompleteInput.checked;

    const generatedId = generateId();

    const dataInput = generateBook(generatedId, bookTitle, bookAuthor, bookYear, bookIsComplete)

    dataBook.push(dataInput);

    render()

    saveData()

    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    bookYearInput.value = '';
    bookIsCompleteInput.checked = false;

    swal({
        title: "Sukses!",
        text: "Buku telah ditambahkan ke koleksi Anda.",
        icon: "success",
        button: "oke",
    });

    document.querySelector('.bg-form').style.display = 'none';
    bodyEl.classList.remove('disableScroll');
});

function displayBook(dataInput) {

    const outerDiv = document.createElement('div');
    outerDiv.setAttribute('id', `book-${dataInput.id}`);

    const divBookCover = document.createElement('div');
    divBookCover.classList.add('book-cover');

    const bookCover = document.createElement('p');
    bookCover.innerText = 'Book Cover';
    divBookCover.appendChild(bookCover);

    const divBookInfo = document.createElement('div');
    divBookInfo.classList.add('book-info');

    const divBookDetails = document.createElement('div');
    divBookDetails.classList.add('book-details');

    const bookTitle = document.createElement('p');
    bookTitle.classList.add('book-title');
    bookTitle.innerText = dataInput.title;

    const divAuthor = document.createElement('div');
    divAuthor.classList.add('author');

    const divAuthorProfile = document.createElement('div');
    divAuthorProfile.classList.add('author-profile');
    divAuthor.appendChild(divAuthorProfile);

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('book-author');
    bookAuthor.innerText = `By ${dataInput.author}`;
    divAuthor.appendChild(bookAuthor);

    const bookYear = document.createElement('p');
    bookYear.classList.add('book-year');
    bookYear.innerText = dataInput.year;

    divBookDetails.append(bookTitle, divAuthor, bookYear)

    divBookInfo.appendChild(divBookDetails);

    const divBookButton = document.createElement('div');
    divBookButton.classList.add('book-button');

    if (!dataInput.isComplete) {

        const buttonSelesaiDibaca = document.createElement('button');
        buttonSelesaiDibaca.classList.add('confirm-button');
        buttonSelesaiDibaca.innerText = 'Sudah selesai dibaca';

        buttonSelesaiDibaca.addEventListener('click', () => {
            const bookTarget = dataInput.id;

            dataBook.forEach(book => {
                if (book.id === bookTarget) {
                    book.isComplete = true;
                    render();
                    saveData();
                }
            })
        })

        const buttonHapus = document.createElement('button');
        buttonHapus.classList.add('remove-button');
        buttonHapus.innerText = 'Hapus Buku';

        buttonHapus.addEventListener('click', () => {
            swal({
                title: "Apakah Anda yakin ingin menghapus buku ini dari koleksi Anda?",
                text: "Menghapus buku ini akan menghilangkan semua data terkait. Apakah Anda yakin ingin melanjutkan?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        const bookTarget = dataInput.id;

                        const bookIndex = dataBook.findIndex(book => book.id === bookTarget);
                        if (bookIndex !== -1 && !dataInput.isComplete) {
                            dataBook.splice(bookIndex, 1);
                            render()
                            saveData()
                        }
                        swal("Berhasil! Buku telah dihapus dari koleksi Anda.", {
                            icon: "success",
                        });
                    } else {
                        swal("Penghapusan Dibatalkan: Buku tetap aman dalam koleksi Anda.");
                    }
                });
        })

        divBookButton.append(buttonSelesaiDibaca, buttonHapus);

    } else {
        const buttonBelumSelesaiDibaca = document.createElement('button');
        buttonBelumSelesaiDibaca.classList.add('confirm-button');
        buttonBelumSelesaiDibaca.innerText = 'Belum selesai dibaca';

        buttonBelumSelesaiDibaca.addEventListener('click', () => {
            const bookTarget = dataInput.id;

            dataBook.forEach(book => {
                if (book.id === bookTarget) {
                    book.isComplete = false;
                    render()
                    saveData()
                }
            })
        })

        const buttonHapus = document.createElement('button');
        buttonHapus.classList.add('remove-button');
        buttonHapus.innerText = 'Hapus Buku';

        buttonHapus.addEventListener('click', () => {
            swal({
                title: "Apakah Anda yakin ingin menghapus buku ini dari koleksi Anda?",
                text: "Menghapus buku ini akan menghilangkan semua data terkait. Apakah Anda yakin ingin melanjutkan?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteBook(dataInput)
                        swal("Berhasil! Buku telah dihapus dari koleksi Anda.", {
                            icon: "success",
                        });
                    } else {
                        swal("Penghapusan Dibatalkan: Buku tetap aman dalam koleksi Anda.");
                    }
                });
        })
        divBookButton.append(buttonBelumSelesaiDibaca, buttonHapus);
    }

    outerDiv.append(divBookCover, divBookInfo, divBookButton);

    return outerDiv;
}

function generateId() {
    return +new Date();
}

function generateBook(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete
    }
}

function render() {
    const bookIncomplete = document.getElementById('incompleteBookshelfList');
    const bookComplete = document.getElementById('completeBookshelfList');
    const emptyBookIncomplete = emptyIncomplete();
    const emptyBookComplete = emptyComplete();

    bookIncomplete.innerHTML = '';
    bookComplete.innerHTML = '';

    if (dataBook.length === 0) {

        bookIncomplete.innerHTML = emptyBookIncomplete.outerHTML;
        bookComplete.innerHTML = emptyBookComplete.outerHTML;

    } else {
        let incompleteIsEmpty = true;
        let completeIsEmpty = true;

        for (bookItem of dataBook) {
            const todoElement = displayBook(bookItem);
            if (bookItem.isComplete) {
                bookComplete.append(todoElement);
                completeIsEmpty = false;
            } else {
                bookIncomplete.append(todoElement);
                incompleteIsEmpty = false;
            }
        }

        if (incompleteIsEmpty) {
            bookIncomplete.innerHTML = emptyBookIncomplete.outerHTML;
        }

        if (completeIsEmpty) {
            bookComplete.innerHTML = emptyBookComplete.outerHTML;
        }
    }
}

function deleteBook(dataInput) {
    const bookTarget = dataInput.id;

    const bookIndex = dataBook.findIndex(book => book.id === bookTarget);

    if (bookIndex !== -1 && dataInput.isComplete) {
        dataBook.splice(bookIndex, 1);
        render();
        saveData();
    }
}

function saveData() {
    const book = JSON.stringify(dataBook);
    localStorage.setItem('book', book);
}

function emptyIncomplete() {
    const emptyBookDiv = document.createElement('div');
    emptyBookDiv.classList.add('empty-book');

    const imgElement = document.createElement('img');
    imgElement.src = 'assets/Empty-book.svg';

    const pElement = document.createElement('p');
    pElement.innerText = 'Belum ada buku yang ditambahkan';

    emptyBookDiv.append(imgElement, pElement);

    return emptyBookDiv;
}

function emptyComplete() {
    const emptyBookDiv = document.createElement('div');
    emptyBookDiv.classList.add('empty-book');

    const imgElement = document.createElement('img');
    imgElement.src = 'assets/Empty-book.svg';

    const pElement = document.createElement('p');
    pElement.innerText = 'Belum ada buku yang selesai dibaca';

    emptyBookDiv.append(imgElement, pElement);

    return emptyBookDiv;
}


