import { connection } from "../server.js";
import { DatabaseError } from "../utils/errors.js";


//get all the books in the library
export async function getAllBooks() {
    const getAllBooksQuery = `SELECT * FROM books`
    return new Promise((resolve, reject) => {
        connection.query(getAllBooksQuery, (err, results) => {
            if (err) {
                console.error('Error fetching books: ' + err.stack);
                reject(new DatabaseError('Error fetching books', err.code));
                return;
            }
            resolve(results);
        });
    });
}

//add a book to the db. The book db is a public library where anyone can add a book 
// so if the book was already added by another user then we must handle it so that there are no duplicates
export async function addBookToDB(bookDetails) {
    return new Promise((resolve, reject) => {
        console.log(bookDetails)
        const addBookQuery = `
            INSERT INTO books (ISBN, Title, Author, Genre, Description, \`Publication Year\`, \`Cover Art\`) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE ISBN = ISBN
        `
        connection.query(addBookQuery, [
            bookDetails.ISBN, 
            bookDetails.title,
            bookDetails.author,
            bookDetails.genre,
            bookDetails.description,
            bookDetails.publicationYear,
            bookDetails.coverArt
        ], (err, results) => {
            if (err) {
                console.error('Error adding book: ' + err.stack);
                reject(new DatabaseError('Error adding book', err.code));
                return;
            }
            resolve(results);
        });
    });
}

//get books of same genre from google books api
export async function getGenreRecommendations(genre,limit) {
    return new Promise((resolve,reject)=>{
        fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=${limit}`)
            .then((data)=> data.json()
            .then((json)=> resolve(json))
            .catch((err)=>reject(err)))
    }) 
}

//get recommendations ordered by genre for a user
export async function getUserRecommendations(genre, preferredMinimumPublicationYear, preferredBookLength) {
    const genres = genre.split(",")
    const genreRecommendations = {}
    try{
        await Promise.all((
            genres.map(async (genre)=>{
                const recommendations = await getGenreRecommendations(genre,20)
                genreRecommendations[genre] = recommendations
            }))
        )
    }catch(e){
        console.error(e)
    }
    
    // console.log(genreRecommendations) 
    return genreRecommendations
}

//search for a book by its title or isbn from google books api
export async function searchBook(type, value) {
    if (type=="Title"){
        type = "intitle"
    }else if(type=="ISBN"){
        type = "isbn"
    }
    return new Promise((resolve,reject)=>{
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${type}:${value}&maxResults=7`)
            .then((data)=> data.json()
            .then((json)=> resolve(json))
            .catch((err)=>reject(err)))
    }) 
}

