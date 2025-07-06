import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth_context";
import { responseHandler } from "@/lib/utils";
import GenreRecommendations from "@/main_components/genre_recommendations";
import type { BookModel } from "@/models/BookModel";
import { deleteReadingStatusofUser, getReadingStatusofUser, saveReadingStatusofUser } from "@/request/user";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";


export enum ReadingStatus{
    READING = "READING",
    READ = "READ",
    WANT_TO_READ = "WANT TO READ"
}

//Page when user clicks on a book
const BookPage = () => {
    const location = useLocation();
    const {user} = useAuth()
    const navigate = useNavigate()

    // get book as props from react router
    const book = location.state?.book as BookModel | undefined;
    const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>()

    if (!book) return <div>No book data!</div>;

    useEffect(()=>{
        if (user!=null && book!=null){
            // if user is logged in then we get the reading status of the book
            const details = new Map().set("user_id", user?.id).set("book_id", book.ISBN);
            responseHandler(()=>getReadingStatusofUser(details),(result)=>{
                if (result!=null){
                    setSelectedStatus(result["status"])
                }else{
                    setSelectedStatus(undefined)
                }
            },()=>{
    
            })
        }
        

    },[book,user])

    // send reading status to db. If user has clicked on the current reading status then it will remove the book from their catalogue
    async function onReadStatusClicked(status:ReadingStatus){
        if (user!=null && book!=null){
            const details = new Map().set("user_id",user?.id).set("book_id",book?.ISBN).set("status",status).set("bookDetails",book)
            if(status == selectedStatus){
            responseHandler(()=>deleteReadingStatusofUser(user?.id,book?.ISBN),()=>{
                setSelectedStatus(undefined)
            },()=>{})
            }else{
                responseHandler(()=>saveReadingStatusofUser(details),()=>{
                    setSelectedStatus(status)
                },()=>{})
            }
        
            // if user clicks on a status and not logged in, it will prompt for login
        }else{
            toast("Error Occured", {
                description: "You need to login to save to catalogue",
                action: {
                  label: "Login",
                  onClick: () => navigate("/login"),
                }
              });
        }
        
        
    }

    return(
        <div className="flex flex-col items-center gap-5 w-full">
            <img src={book.coverArt} alt={book.title} height={300} width={200}/>
            <h1 className="text-4xl font-bold text-dark-100 text-center">{book.title}</h1>
            <h2>{book.publicationYear}</h2>
            <p className="text-lg text-primary-100">{book.genre}</p>            
            <p className="text-2xl text-primary-100">{book.author}</p>
            <p className="text-xl text-center">{book.description}</p>
            {/* {user &&   ( */}
                <div className="mt-9 flex flex-col flex-wrap justify-center items-center md:self-end gap-2 w-full max-w-md">
                    <p className="">Mark your progress.</p>
                    <div className=" flex gap-1">
                        {Object.entries(ReadingStatus).map(([key, value]) => {
                            if (selectedStatus && selectedStatus.toLowerCase() === value.toLowerCase()){
                                return (
                                    // If they click on the current progress to remove from catalgue then an alert will be displayed
                                    <AlertDialog key={key}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant= "destructive" 
                                                className=" cursor-pointer text-sm px-3 py-1"
                                            >
                                                <XIcon />
                                                {value}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will remove your book from the catalogue and your progress
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={()=>onReadStatusClicked(value)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )
                            }
                            return (
                                <Button
                                    key={key}
                                    onClick={()=>onReadStatusClicked(value)}
                                    variant="ghost"
                                    className= "bg-amber-200 cursor-pointer text-sm px-3 py-1"
                                >
                                    {value}
                                </Button>
                            )
                        } )}
                    </div>
                </div>
                
            {/* )} */}

            {/* show same genre recommendations */}
            <GenreRecommendations genre={book.genre} />
        </div>
    )
}

export default BookPage;