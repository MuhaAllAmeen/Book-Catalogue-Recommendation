import type { BookModel } from "@/models/BookModel";
import BookCard from "./book_card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

//carousel of books that can be swiped through
const BookCarousel:React.FC<{books:BookModel[]}> = ({books}) =>{
    return(
        <div className="w-full relative px-12">
            <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
                {
                    books.map((book)=>{
                        return(
                            <CarouselItem key={book.ISBN} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <BookCard book={book} />
                            </CarouselItem>
                        )
                    })
                }
            </CarouselContent>
            <CarouselPrevious size={"lg"} />
            <CarouselNext size={"lg"} />
            </Carousel>
        </div>
    )
}

export default BookCarousel