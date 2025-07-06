import { BookModel } from "@/models/BookModel"
import { getGenreRecommendation } from "@/request/books"
import { useEffect, useState } from "react"

import { SkeletonCard } from "./skeleton_card"
import BookCarousel from "./book_carousel"
import { responseHandler } from "@/lib/utils"

//the carousel that shows books of a genre
const GenreRecommendations:React.FC<{genre: string}> = ({genre}) => {
    const [books,setBooks] = useState<BookModel[]>([])
    const [loading,setLoading] = useState(false)

    // calls endpoint with genre and fetches books. called everytime the genre changes on the book page
    useEffect(()=>{
        setLoading(true)
        setBooks([])
        responseHandler(()=>getGenreRecommendation(genre),(data)=>{
            setBooks(data.map((book: any) => BookModel.fromObj(book)));
            setLoading(false)
        }, ()=>{
            setLoading(false) 
        })
        
    },[genre])
    return(
        <div className="w-full">
            <h2 className="my-15 text-2xl text-middle-100">Books Like these</h2>
            {loading && (
                    <div className="flex gap-6">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}
            <BookCarousel books={books} />
            
        </div>
        
    )
}

export default GenreRecommendations