import type { BookModel } from "@/models/BookModel";
import BookCard from "./book_card";

interface BookGridProps{
    books: BookModel[]
}

//grid of books
const BookGrid:React.FC<BookGridProps> = ({books}) =>{
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10 gap-6 justify-items-center">
            {
                books.map((book)=>{
                    return(
                        <BookCard key={book.ISBN} book={book} />
                    )
                })
            }
        </div>
    )
}

export default BookGrid;