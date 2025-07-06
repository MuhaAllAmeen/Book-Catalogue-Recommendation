import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/context/auth_context"
import { responseHandler } from "@/lib/utils"
import BookGrid from "@/main_components/book_grid"
import { SkeletonCard } from "@/main_components/skeleton_card"
import { BookModel } from "@/models/BookModel"
import {  getBooksOfUserOfStatus } from "@/request/books"
import { DownloadIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { CSVLink } from "react-csv";


// catalogue page where a user's saved books are displayed
const CataloguePage = () =>{

    const [allBooks, setAllBooks] = useState<BookModel[]>([])
    const [allGenres,setAllGenres] = useState<string[]>(["All"])
    const [selectedGenre,setSelected] = useState("All")
    const [allPublicationYears, setAllPublicationYears] = useState<number[]>([])
    const [selectedPublicationYear, setSelectedPublicationYear] = useState<number>(0)
    const [loading,setLoading] = useState(false)
    const {user} = useAuth()
    
    // on visit get all the books 
    useEffect(()=>{
        if(user!=null){

            setLoading(true)
            
            // fetch all the books saved by the user
            responseHandler(()=>getBooksOfUserOfStatus(user.id),(data)=>{
                const dataObject = Object.entries(data)
                
                const allBooks: BookModel[] = dataObject
                    .flatMap(([, books]) =>
                        (books as any[]).map((book: any) => BookModel.fromObj(book))
                    );
                setAllBooks(allBooks);
                
                // get all the genres of the saved books for filtering
                const allGenres: string[] = allBooks.reduce((genres: string[], book: BookModel) => {
                    if (!genres.includes(book.genre)) {
                        genres.push(book.genre);
                    }
                    return genres;
                }, []);
                setAllGenres((genres) => [...genres, ...allGenres])

                // get all the pub years of the saved books for filtering
                const allPublicationYears: number[] = allBooks.reduce((publicationYears: number[], book:BookModel)=>{
                    if (!publicationYears.includes(book.publicationYear)) {
                        publicationYears.push(book.publicationYear);
                    }
                    return publicationYears;
                },[])
                //sort it for use in slider
                const sortedYears = allPublicationYears.sort()
                setAllPublicationYears(sortedYears)

                // Set the initial selected year to the minimum year if it's still 0
                if (selectedPublicationYear === 0 && sortedYears.length > 0) {
                    setSelectedPublicationYear(sortedYears[0])
                }

                setLoading(false)
            }, () => {
                // Handle error case
                setLoading(false)
            })
        }
    }, [user])
    return(
        <div className="">
            <h1 className='text-4xl  text-primary-100 font-bold'>Your Catalogue.</h1>
            <div className="mt-10">
                
                <h2 className="text-2xl text-middle-100">You have saved {allBooks.length} books.</h2>
                <p className="text-dark-100">To add a book to your catalogue, simply visit any book from the library or search for it and mark your progress.</p>

                <div className="flex flex-col items-center md:flex-row gap-5 mt-5">
                    {/* filter by genre */}
                    <Select value={selectedGenre} onValueChange={setSelected}>
                        <SelectTrigger className="w-[180px] border-primary-100 cursor-pointer">
                            <SelectValue placeholder="Select Genre" />
                        </SelectTrigger>
                        <SelectContent>
                            {allGenres.map((genre)=>(
                                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* filter by pub year */}
                    <Popover>
                        <PopoverTrigger className="border-primary-100 cursor-pointer">Publication Year</PopoverTrigger>
                        <PopoverContent className="flex gap-3 ">
                            {allPublicationYears.length > 0 && (
                                <>
                                    <Slider 
                                        max={allPublicationYears[allPublicationYears.length-1]} 
                                        step={1} 
                                        min={allPublicationYears[0]}  
                                        defaultValue={[selectedPublicationYear]} 
                                        onValueChange={(value)=>setSelectedPublicationYear(value[0])} 
                                    />
                                    <Label>{selectedPublicationYear}</Label>
                                </>
                            )}
                        </PopoverContent>
                    </Popover>
                    {allBooks.length > 0 && (
                        <CSVLink data={allBooks} filename="my-catalogue" className="flex md:self end border-1 px-3 py-1 rounded-xl border-primary-100 gap-1"><DownloadIcon size={20} /> Catalogue</CSVLink>
                    )}

                </div>

                {loading && (
                    <div className="flex flex-col md:flex-row gap-6">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}
                
                <BookGrid books={selectedGenre === "All" ? allBooks.filter(book => selectedPublicationYear === 0 || book.publicationYear >= selectedPublicationYear) : allBooks.filter(book => book.genre === selectedGenre && (selectedPublicationYear === 0 || book.publicationYear >= selectedPublicationYear))} />
            </div>
        </div>

    )
}

export default CataloguePage