
import { responseHandler } from "@/lib/utils"
import BookGrid from "@/main_components/book_grid"
import { SkeletonCard } from "@/main_components/skeleton_card"
import { BookModel } from "@/models/BookModel"
import { getInitialBooks } from "@/request/books"
import { useEffect, useState } from "react"

// public library page where anyone can see the books all users have saved
const LibraryPage = () =>{
    const [books, setBooks] = useState<BookModel[]>([])
    // const {user} = useAuth()
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        setLoading(true)

        //get all books from db
        responseHandler(()=>getInitialBooks(),(data)=>{
            setBooks(data.map((book: any) => BookModel.fromObj(book)));
            setLoading(false)
        },()=>{
            setLoading(false)  
        })
        
    },[])
    return(
        <div>
            <h1 className='text-4xl text-primary-100 font-bold text-center md:text-left'>Library.</h1>
            <h2 className="text-xl text-middle-100 mt-3">Welcome to the public library. Mark your progress on any book and let the world see the book.</h2>
            <div className="grid grid-cols-4 gap-9 mt-9 md:mt-19">
                {loading && (
                    <div className="flex flex-col md:flex-row gap-6">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}
            </div>
            <BookGrid books={books} />
            
        </div>
    )

}

export default LibraryPage