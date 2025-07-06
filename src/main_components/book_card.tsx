import type { BookModel } from "@/models/BookModel";
import notFound from "../assets/J5LVHEL.webp"
import { NavLink } from "react-router";

interface BookCardProps {
    book: BookModel;
}

//book card component that shows the cover art and title and author
const BookCard:React.FC<BookCardProps> = ({book}) => {
    return(
        <NavLink to={`/book/${book.ISBN}`} state={{ book }}>
        <div className="flex flex-col items-center">
            <img 
                src={book.coverArt ?? notFound} 
                alt={book.title} 
                height={300} 
                width={200} 
                style={{ objectFit: "cover" }}
            />
            <h2 className="font-bold text-wrap text-center">{book.title}</h2>
            <p className="text-center">{book.author}</p>     
        </div>
        </NavLink>
    )
}

export default BookCard;