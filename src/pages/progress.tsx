import { useAuth } from "@/context/auth_context"
import BookCarousel from "@/main_components/book_carousel"
import { ChartPieInteractive } from "@/main_components/pie_chart"
import { BookModel } from "@/models/BookModel"
import { getBooksOfUserOfStatus } from "@/request/books"
import { useEffect, useMemo, useState } from "react"
import { ReadingStatus } from "./book"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { responseHandler } from "@/lib/utils"


export interface BooksWithStatusType{
        status: ReadingStatus;
        books: BookModel[]  
}

//page for showing reading progress
const ProgressPage = () =>{
    const {user} = useAuth()
    const [allBooksByStatus, setAllBooksByStatus] = useState<BooksWithStatusType[]>([])
    const [allBooks, setAllBooks] = useState<BookModel[]>([])
    const [selectedStatusBooks, setSelectedStatusBooks] = useState<BooksWithStatusType>()

    //function to gett all the books with read status
    //we can use useMemo here since the read books dont need to change when page re renders
    const getReadBooks = useMemo(()=>allBooksByStatus.filter((booksWithStatus)=>booksWithStatus.status == ReadingStatus.READ).at(0)?.books.length || 0,[allBooksByStatus])
    
    // get all books os user by status 
    useEffect(() => {
        if (user != null) {
            responseHandler(()=>getBooksOfUserOfStatus(user.id),(data)=>{
                const dataObject = Object.entries(data)
                    setAllBooksByStatus(
                        dataObject.map(([status, books]) => ({
                            status: status as ReadingStatus,
                            books: (books as any[]).map((book) => BookModel.fromObj(book))
                        } as BooksWithStatusType))
                    )
                    const allBooks: BookModel[] = dataObject
                        .flatMap(([, books]) =>
                            (books as any[]).map((book: any) => BookModel.fromObj(book))
                        );
                    setAllBooks(allBooks);
                    
            },()=>{
            })
        }
    }, [user]);

    // function getReadBooks():number{
    //     return allBooksByStatus.filter((booksWithStatus)=>booksWithStatus.status == ReadingStatus.READ).at(0)?.books.length || 0
    // }



    return (
        <div>
            <h1 className="text-4xl text-primary-100 font-bold">Your Progress.</h1>        

            <div className="flex flex-col lg:flex-row w-full mt-10 gap-11 items-center ">
                <div className="w-full">
                    {allBooksByStatus.length > 0 && (
                        <ChartPieInteractive booksWithStatus={allBooksByStatus} 

                        //on changin status in the select menu show all the books with that status
                            onStatusChanged={(status)=>setSelectedStatusBooks({
                                status: status, books: allBooksByStatus.filter((bookWithStatus)=>bookWithStatus.status == status).at(0)?.books ?? []
                            })}/>
                    )}
                </div>

                {/* show books of selected status */}
                {selectedStatusBooks && (
                    <div className="w-full flex flex-col gap-3">
                        <h3 className="text-xl text-middle-100 self-center">All {selectedStatusBooks?.status} books</h3>
                        <BookCarousel books={selectedStatusBooks.books} />
                    </div>
                )}
                
            </div>

            {/* show total progress of read vs not read */}
            <div className="mt-7 flex flex-col gap-5">
                <Label>You Have read {getReadBooks} out of {allBooks.length} books</Label>
                <Progress value={(getReadBooks/allBooks.length)*100}/>
            </div>
            
            
        </div>
    )
}

export default ProgressPage