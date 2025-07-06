
import { connection } from "../server.js";
import { DatabaseError } from "../utils/errors.js";

//updates user's reading status of a book
//if its the user's first time marking progress, it will insert or else it will update
export async function updateUserReadingStatus(user_id, book_id, status){
    const updateReadingStatusQuery = `
        INSERT INTO user_book_status (user_id, book_id, status, updated_at)
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = NOW()
        `;
    return new Promise((resolve, reject) => {
        connection.query(updateReadingStatusQuery, [user_id,book_id,status] ,(err, results) => {        
            if (err) {
                console.error('Error updating status: ' + err);
                reject(new DatabaseError('Error updating status', err.code));
                return;
            }
            // results is an array of RowDataPacket objects; to get plain object:
            
            resolve(results);
        });
    });
}

//get the reading status of a user's book
export async function getUserReadingStatus(user_id, book_id){
    const getReadingStatusQuery = `
        SELECT * FROM user_book_status 
        WHERE user_id = '${user_id}' AND book_id = '${book_id}'
        `;
    return new Promise((resolve, reject) => {
        connection.query(getReadingStatusQuery ,(err, results) => {        
            if (err) {
                console.error('Error fetching status: ' + err);
                reject(new DatabaseError('Error fetching status', err.code));
                return;
            }
            // results is an array of RowDataPacket objects; to get plain object:
            resolve(results[0]);
        });
    });
}

//delete status of a user's book. this will remove the progress and delete from the catalogue
export async function deleteUserReadingStatus(user_id, book_id){
    const deleteReadingStatusQuery = `
        DELETE FROM user_book_status 
        WHERE user_id = '${user_id}' AND book_id = '${book_id}'
        `;
    return new Promise((resolve, reject) => {
        connection.query(deleteReadingStatusQuery ,(err, results) => {        
            if (err) {
                console.error('Error fetching status: ' + err);
                reject(new DatabaseError('Error fetching status', err.code));
                return;
            }
            // results is an array of RowDataPacket objects; to get plain object:
            resolve(results[0]);
        });
    });
}

// get all books the user has marked progress (added to catalogue) with its status
// function is also used to get all books of a user of a particular status
export async function getAllBooksOfUser(user_id, status){

    let getAllBooksofUserQuery = `
    SELECT books.*, user_book_status.status
    FROM books
    JOIN user_book_status ON books.ISBN = user_book_status.book_id
    WHERE user_book_status.user_id = ? 
  `;
    if (status != null){
        getAllBooksofUserQuery += `AND user_book_status.status = '${status}'`
    }

    return new Promise((resolve,reject)=> {
        connection.query(getAllBooksofUserQuery,[user_id],(err, results) => {
            if (err) {
                console.error('Error getting book: ' + err.stack);
                reject(new DatabaseError('Error getting book', err.code));
                return;
            }
            // console.log(results)
            resolve(results);
        })
    })
}