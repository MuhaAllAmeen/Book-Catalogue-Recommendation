import { ApiService } from "./api_service"

const booksUrl = "/books"

//call for fetching all books in db
export async function getInitialBooks():Promise<Response> {
    const response = await ApiService.get(`${booksUrl}/get-books`)
    return response;
}

// call to get recommendations based on genre only
export async function getGenreRecommendation(genre: string):Promise<Response> {
    const response = await ApiService.get(`${booksUrl}/get-genre-recommendations`,new Map().set("genre",genre))
    return response
}

// call to search for book by title or isbn
export async function searchBook(type: string, value: string):Promise<Response> {
    const response = await ApiService.get(`${booksUrl}/search-book`,new Map().set("type",type).set("value",value))
    return response
}

//call to get recommendations based on user preferences
//we could either just send the user id to backend and fetch user details by id and get recommendation
//but since the details are already stored on local storage we can just send them and reduce an unncessary fetch operation
export async function getUserRecommendations(genre: string, preferredMinimumPublicationYear: number, preferredBookLength: string){
    const response = await ApiService.get(`${booksUrl}/get-user-recommendations`,new Map().set("genre",genre).set("preferredMinimumPublicationYear",preferredMinimumPublicationYear).set("preferredBookLength",preferredBookLength))
    return response
}

// get all books the user has marked progress
// export async function getBooksOfUser(user_id: string){
//     const response = await ApiService.get(`${booksUrl}/get-user-books`,new Map().set("user_id",user_id))
//     return response
// }

// get all books the user has marked progress
// if status is null then it will fetch all books grouped by status
//if status is mentioned then it will fetch all books of that status
export async function getBooksOfUserOfStatus(user_id: string, status?:string){
    const params = new Map().set("user_id", user_id);
    if (status) {
        params.set("status", status);
    }
    const response = await ApiService.get(`${booksUrl}/get-user-books-of-status`,params)
    return response
}