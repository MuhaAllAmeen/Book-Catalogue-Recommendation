import type { UserModel } from "@/models/UserModel";
import { ApiService } from "./api_service";

const baseUrl = '/user'

// save user to db
export async function addUser(user: UserModel){
    const userDetails = Object.fromEntries(user.toMap())

    return await ApiService.post(`${baseUrl}/add-user`,new Map().set("userDetails",userDetails))
}

//get user from db
export async function getUser(id: string){
    return await ApiService.get(`${baseUrl}/get-user`,new Map().set("id",id))
}

//update user preferences to db
export async function updateUser(id: string, userDetails: Map<string,any>){
    return await ApiService.put(`${baseUrl}/update-user`,userDetails,new Map().set("id",id))
}

// save or update reading status of a book marked by the user
export async function saveReadingStatusofUser( details: Map<string,any>){
    return await ApiService.put(`${baseUrl}/update-user-reading-status`,details)
}

//delete reading status (delete from user catalogue)
export async function deleteReadingStatusofUser( user_id: string, book_id: number){
    return await ApiService.delete(`${baseUrl}/delete-user-reading-status`,new Map().set("user_id",user_id).set("book_id",book_id))
}

//get reading status of a book by a user
export async function getReadingStatusofUser( details: Map<string,any>){
    return await ApiService.get(`${baseUrl}/get-user-reading-status`,details)
}
