import { ApiService } from "./api_service"

const authUrl = "/auth"

//call login
export async function login(email:string,password:string):Promise<Response>{
    return await ApiService.post(`${authUrl}/login`, new Map().set("email",email).set("password",password))
}

//call register
export async function register(email:string,password:string,name:string):Promise<Response>{
    return await ApiService.post(`${authUrl}/register`, new Map().set("email",email).set("password",password).set("name",name))
}

//call logout
export async function logout():Promise<Response>{
    return await ApiService.post(`${authUrl}/logout`)
   
}

//call to verify tokens
export async function verifyToken():Promise<Response>{
    return await ApiService.get(`${authUrl}/me`)
}