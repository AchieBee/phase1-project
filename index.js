const bookListElement = document.querySelector(".book-list");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const coverImageURLInput = document.getElementById("coverImageURL");

const apiUrl = "http://localhost:3000/Books"; // Replace with your local API URL

async function fetchBooks() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

async function displayBooks() {
    const books = await fetchBooks();

    bookListElement.innerHTML = "";
    books.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-item");

        const bookTitle = document.createElement("h3");
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement("p");
        bookAuthor.textContent = "Author: " + book.author;

        const bookGenre = document.createElement("p");
        bookGenre.textContent = "Genre: " + book.genre;

        const bookImage = document.createElement("img");
        bookImage.src = book.coverImagrURL || "default-cover.jpg";
        bookImage.alt = book.title;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteBook(book.id);

        bookItem.appendChild(bookTitle);
        bookItem.appendChild(bookAuthor);
        bookItem.appendChild(bookGenre);
        bookItem.appendChild(bookImage);
        bookItem.appendChild(deleteButton);

        bookListElement.appendChild(bookItem);
    });
}

async function addBook() {
    const title = titleInput.value;
    const author = authorInput.value;
    const genre = genreInput.value;
    const coverImageURL = coverImageURLInput.value;

    if (title && author && genre) {
        const newBook = {
            title,
            author,
            genre,
            coverImagrURL: coverImageURL || "default-cover.jpg"
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBook),
            });

            if (response.ok) {
                displayBooks();
                clearInputFields();
            } else {
                console.error("Failed to add book:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error adding book:", error);
        }
    }
}

async function deleteBook(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            displayBooks();
            clearInputFields();
        } else {
            console.error("Failed to delete book:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error deleting book:", error);
    }
}

function clearInputFields() {
    titleInput.value = "";
    authorInput.value = "";
    genreInput.value = "";
    coverImageURLInput.value = "";
}

displayBooks();
