import { Router } from "express"
import { getAllBooks, getAllBooksOfUser, getGenreRecommendations, getUserRecommendations, searchBook } from "../db/books/operations.js"
import { refineBooksByStatus, refineRecommendationResponse, refineUserRecommendationResponse } from "../db/helper.js"
import { verifyFirebaseToken } from "../middleware.js"
import { DatabaseError } from "../db/errors.js"
export const booksRouter = Router()

//gets all the books from the book library for anyone visiting the website
booksRouter.get('/get-books',async (req,res)=>{

    try{
        const books = await getAllBooks()
        return res.status(200).json({result:books})
    }catch(e){
        if (e instanceof DatabaseError) {
            return res.status(e.code).json({error: e.message})
        }
        return res.status(500).json({error: 'Internal server error'})
    }
    
})

//gets 10 books relevant to the genre when user visits a book
booksRouter.get('/get-genre-recommendations',async (req,res)=>{
    try{
        const {genre} = req.query
        const recommendations = await getGenreRecommendations(genre,10)
        const refinedRecommendations = refineRecommendationResponse(recommendations)
        res.status(200).json({result: refinedRecommendations})
    }catch(e){
        if (e instanceof DatabaseError) {
            return res.status(e.code).json({error: e.message})
        }
        return res.status(500).json({error: 'Internal server error'})
    }
})

//gets customized recommendation based on genre, pub year and book length
booksRouter.get('/get-user-recommendations',verifyFirebaseToken ,async (req,res)=>{
    try{
        const {genre, preferredBookLength, preferredMinimumPublicationYear} = req.query
        const recommendations = await getUserRecommendations(genre)
        const refinedRecommendations = refineUserRecommendationResponse(recommendations, preferredBookLength, preferredMinimumPublicationYear)
        res.status(200).json({result: refinedRecommendations})
    }catch(e){
        if (e instanceof DatabaseError) {
            return res.status(e.code).json({error: e.message})
        }
        return res.status(500).json({error: 'Internal server error'})
    }
})


//search for any book based on title or isbn
booksRouter.get('/search-book',async (req,res)=>{
    try{
        const {type,value} = req.query
        const results = await searchBook(type,value)
        // console.log(results)
        const refinedRecommendations = refineRecommendationResponse(results)
        res.status(200).json({result: refinedRecommendations})
    }catch(e){
        return res.status(500).json({error: "Internal Server Error"})
    }
})

//get all the books the user has a reading status (saved to catalogue)
// booksRouter.get("/get-user-books", verifyFirebaseToken, async(req,res)=>{
//     try{
//         const {user_id} = req.query
//         console.log(user_id)
//         const results = await getAllBooksOfUser(user_id)
//         const booksByStatus = refineBooksByStatus(results)
//         res.status(200).json({result: booksByStatus})
//     }catch(e){
//         if (e instanceof DatabaseError) {
//             return res.status(e.code).json({error: e.message})
//         }
//         return res.status(500).json({error: 'Internal server error'})
//     }
// })

//gets all the books a user has saved based on the status
//eg: if user wants all the books that he has marked as want to read
booksRouter.get("/get-user-books-of-status", verifyFirebaseToken, async(req,res)=>{
    try{
        const {user_id, status} = req.query
        console.log(user_id)
        let results = await getAllBooksOfUser(user_id,status)
        // if status is null then user requires all the books grouped by status
        if (status == null){
            results = refineBooksByStatus(results)
        }
        res.status(200).send({result: results})
    }catch(e){
        if (e instanceof DatabaseError) {
            return res.status(e.code).json({error: e.message})
        }
        return res.status(500).json({error: 'Internal server error'})
    }
})