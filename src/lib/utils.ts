import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ErrorHandler } from "./error"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//checks difference between two lists of genres by content and length
export function checkGenreDifference(currentGenre: string[], newGenre: string[]): boolean {
  if (currentGenre.length !== newGenre.length) {
    return true
  }
  
  // Check if every genre in currentGenre exists in newGenre
  return !currentGenre.every(genre => newGenre.includes(genre))
}

//handles responses by sending callbacks on success and failure so that further action can be made. Also shows error toast on failure
export async function responseHandler(apiFunction: ()=>Promise<Response>, onSuccess: (result:any)=>void, onFailure: (error: any)=>void){
  const res = await apiFunction()
  const data = await res.json()
  if (res.ok){
    onSuccess(data["result"])
  }else{
    new ErrorHandler(data["error"])
    onFailure(data["error"])
  }
}