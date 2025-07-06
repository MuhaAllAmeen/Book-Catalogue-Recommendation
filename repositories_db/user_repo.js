import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "@firebase/auth";
import { DatabaseError, EmailAlreadyExistsError, IncompleteCredentialsError, InternalServerError, InvalidCredentialsError, UserAlreadyExistsError } from "../utils/errors.js";
import {auth} from '../utils/firebase.js'
import {getAuth} from 'firebase-admin/auth'
import { connection } from "../server.js";


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
        const name = userCredential.user.displayName

          if (idToken) {
            return {idToken, refreshToken, email, uid, name}
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

export async function register(email,password, name){
    try{
        if (!email || !password) {
            throw new IncompleteCredentialsError("Credentials Missing", 422)
        }
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        await getAuth().updateUser(userCred.user.uid,{displayName:name})
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


