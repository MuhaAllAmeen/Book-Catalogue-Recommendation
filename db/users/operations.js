import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "@firebase/auth";
import { DatabaseError, EmailAlreadyExistsError, IncompleteCredentialsError, InternalServerError, InvalidCredentialsError, UserAlreadyExistsError } from "../errors.js";
import {auth} from '../../firebase.js'
import {getAuth} from 'firebase-admin/auth'
import { connection } from "../../server.js";


// login function that returns the user details and token
export async function login(email,password){
    try{
        if (!email || !password) {
            throw new IncompleteCredentialsError("Credentials Missing", 422)
              
          }
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const idToken = userCredential._tokenResponse.idToken
        const refreshToken = userCredential.user.refreshToken

        const uid = userCredential.user.uid;

          if (idToken) {
            return {idToken, refreshToken, email, uid}
          } else {
              throw new InternalServerError("Couldn't process token",500)
            //   res.status(500).json({ error: "internal Server Error" });
          }
                
      }catch(error){
        console.error(error);
        if (error.code == "auth/invalid-credential"){
          throw new InvalidCredentialsError("Invalid Credentials", 401)
        }
        const errorMessage = error.message || "An error occurred while logging in";
        throw new InternalServerError(errorMessage,500)
      }
}

// register function that returns the user details and token

export async function register(email,password){
    try{
        if (!email || !password) {
            throw new IncompleteCredentialsError("Credentials Missing", 422)
        }
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        
        const idToken = userCred._tokenResponse.idToken
        const refreshToken = userCred.user.refreshToken
        if (idToken) {
            return {userCred, idToken, refreshToken}
        } else {
            throw new InternalServerError("Couldn't process token",500)
        }
    }catch(error){
      console.error(error)
      if (error.code == "auth/email-already-in-use"){         
        throw new EmailAlreadyExistsError("Account exists with this email", 409)
      }else{
        const errorMessage = error.message || "An error occurred while registering user";
        throw new InternalServerError(errorMessage,500)
      }
        
    }
}

//logout function
export async function logout(){
    await signOut(auth)
}

//function that takes user id and gives the user details.
//this function is used after token verification
export async function getAuthUser(uid){
    return await getAuth().getUser(uid);
}

//adds user to db, if user already present then sends an error
export async function addUserToDB(userDetails){
    const addUserQuery = `INSERT INTO users (id, name, email, preferredGenres, preferredMinimumPublicationYear, preferredBookLength) VALUES ('${userDetails.id}', '${userDetails.name}', '${userDetails.email}', '${userDetails.preferredGenres}', '${userDetails.preferredMinimumPublicationYear}', '${userDetails.preferredBookLength}');`
    return new Promise((resolve, reject) => {
        connection.query(addUserQuery, (err, results) => {        
            if (err) {
                console.error('Error adding user: ' + err);
                if (err.code == "ER_DUP_ENTRY"){
                    reject(new UserAlreadyExistsError("User Already Exists", 409))
                    return;
                }
                reject(new DatabaseError('Error adding user', err.code));
                return;
            }
            console.log(results)
            resolve(results);
        });
    });
}

//gets user based on user id
//this function is run after every login
export async function getUserFromDB(id){
    const getUserQuery = `SELECT * FROM users WHERE id = '${id}';`
    console.log(getUserQuery)
    return new Promise((resolve, reject) => {
        connection.query(getUserQuery, (err, results) => {        
            if (err) {
                console.error('Error fetching user: ' + err);
                reject(new DatabaseError('Error fetching user', err.code));
                return;
            }
            // results is an array of RowDataPacket objects; to get plain object:
            const user = results && results.length > 0 ? { ...results[0] } : null;
            console.log(user);
            resolve(user);
        });
    });
}


//updates the user's preferences
export async function updateUserToDB(id, preferredGenres, preferredBookLength, preferredMinimumPublicationYear) {
    const updates = [];
    if (preferredGenres != null) updates.push(`preferredGenres = '${preferredGenres}'`);
    if (preferredBookLength != null) updates.push(`preferredBookLength = '${preferredBookLength}'`);
    if (preferredMinimumPublicationYear != null) updates.push(`preferredMinimumPublicationYear = '${preferredMinimumPublicationYear}'`);

    if (updates.length === 0) {
        throw new Error("No fields to update");
    }

    const updateUserQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = '${id}';`;
    console.log(updateUserQuery)

    return new Promise((resolve, reject) => {
        connection.query(updateUserQuery, (err, results) => {        
            if (err) {
                console.error('Error updating user: ' + err);
                reject(new DatabaseError('Error updating user', err.code));
                return;
            }
            console.log(results)
            resolve(results);
        });
    });
}


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