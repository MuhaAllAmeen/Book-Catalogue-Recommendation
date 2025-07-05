import { Router } from "express"
import { addUserToDB, deleteUserReadingStatus, getUserFromDB, getUserReadingStatus, updateUserReadingStatus, updateUserToDB } from "../db/users/operations.js"
import { DatabaseError, UserAlreadyExistsError, UserNotFoundError } from "../db/errors.js"
import { addBookToDB } from "../db/books/operations.js"
import { verifyFirebaseToken } from "../middleware.js"

export const userRouter = Router()

//middleware so that every endpoint verifies token
userRouter.use(verifyFirebaseToken)

//adds user to db
userRouter.post("/add-user",async (req,res)=>{
    try{
        const {userDetails} = req.body
        const result = await addUserToDB(userDetails)
        return res.status(200).json({result:result})
    }catch(e){
        if (e instanceof UserAlreadyExistsError){
            return res.status(e.statusCode).json({error:e.message})
        }else if (e instanceof DatabaseError){
            return res.status(400).json({error:e.message})
        }else{
            return res.status(500).json({error:"Internal Server Error"})
        }
    }
        
})


//gets user from db
userRouter.get("/get-user",async(req,res)=>{
    try{
        const {id} = req.query
        const result = await getUserFromDB(id)
        if (result != null){
            return res.status(200).json({result:result})
        }else{
            throw new UserNotFoundError("User Configuration not found",404)
        }
    }catch(e){
        if (e instanceof DatabaseError){
            return res.status(400).json({error:e.message})
        }else if (e instanceof UserNotFoundError){
            return res.status(404).json({error:e.message})
        }else{
            return res.status(500).json({error:"Internal Server Error"})
        }
    }
})


//updates user to db with the genre, pubyear or book lengt data or all of them together
userRouter.put("/update-user",async(req,res)=>{
    try{
        const {id} = req.query
        const {preferredGenres, preferredBookLength, preferredMinimumPublicationYear} = req.body
        const result = await updateUserToDB(id,preferredGenres, preferredBookLength, preferredMinimumPublicationYear)
        return res.status(200).json({result:result})
    }catch(e){
        if (e instanceof DatabaseError){
            return res.status(400).json({error:e.message})
        }else{
            return res.status(500).json({error:"Internal Server Error"})
        }
    }
})

//get the reading status of a user of a particular book
userRouter.get("/get-user-reading-status",async(req,res)=>{
    try{
        const {user_id, book_id} = req.query
        const result = await getUserReadingStatus(user_id,book_id)
        return res.status(200).json({result:result})
    }catch(e){
        if (e instanceof DatabaseError){
            return res.status(400).json({error:e.message})
        }else{
            return res.status(500).json({error:"Internal Server Error"})
        }
    }
})

//updates the reading status of a user of a particular book.
//if the book is not already present in the db, it adds the book first so that there is a valid book id
userRouter.put("/update-user-reading-status",async(req,res)=>{
    try{
        const {user_id, book_id, status, bookDetails} = req.body
        const bookResult = await addBookToDB(bookDetails)
        const statusResult = await updateUserReadingStatus(user_id,book_id,status)
        return res.status(200).json({result:statusResult})
    }catch(e){
        if (e instanceof DatabaseError){
            return res.status(400).json({error:e.message})
        }else{
            return res.status(500).json({error:"Internal Server Error"})
        }
    }
})

//user can remove their reading progress of a book and this will remove the books from user's catalogue
userRouter.delete("/delete-user-reading-status",async(req,res)=>{
    try{
        const {user_id, book_id} = req.query
        const result = await deleteUserReadingStatus(user_id,book_id)
        return res.status(200).json({result:result})
    }catch(e){
        if (e instanceof DatabaseError){
            return res.status(400).json({error:e.message})
        }else{
            return res.status(500).json({error:"Internal Server Error"})
        }
    }
})

