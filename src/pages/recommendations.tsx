import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth_context";
import { responseHandler } from "@/lib/utils";
import BookCarousel from "@/main_components/book_carousel";
import { SkeletonCard } from "@/main_components/skeleton_card";
import { BookModel } from "@/models/BookModel";
import { getUserRecommendations } from "@/request/books";
import { useEffect, useState } from "react";

//User recommendations page
const RecommendationsPage = () =>{
    const {user} = useAuth()
    const [recommendedBooks, setRecommendedBooks] = useState<{genre: string, books:BookModel[]}|{}>({})
    const [loading,setLoading] = useState(false)

    const bookLength = {
        "SHORT": "< 200 pages",
        "MEDIUM": "200 - 400 pages",
        "LONG": "> 400 pages"
    }
    useEffect(()=>{
        if (user != null){
            setLoading(true)
            
            // incase the saved genres is svaed as array or string (doing this for type safety)
            const genres: string[] = Array.isArray(user.preferredGenres)
                ? user.preferredGenres
                : typeof user.preferredGenres === "string"
                    ? (user.preferredGenres as string).split(",")
                    : [];
            
            // get user recommendations according to genre, book length and pub year and group them by genre 
            responseHandler(()=>getUserRecommendations(genres.join(","), user?.preferredMinimumPublicationYear, user?.preferredBookLength),
                (data)=>{
                    setRecommendedBooks(
                        Object.fromEntries(
                            Object.entries(data).map(([genre, books]) => [
                                genre,
                                (books as any[]).map(book => BookModel.fromObj(book))
                            ])
                        )
                    );
                    setLoading(false)
                },()=>{
                    setLoading(false)  
                })
        }
    },[])
    return(
        <div className="w-full overflow-hidden">
            <h1 className='text-2xl md:text-4xl font-bold text-primary-100'>Your Recommendations.</h1>
            <div>
                <h2 className="text-lg md:text-xl text-middle-100 mt-7">Recommendations based on your preferences.</h2>
                <div className="flex gap-3 mt-5 flex-wrap">
                    {/* show selected preferences */}
                    <Badge className="bg-secondary-100 text-dark-100 whitespace-normal break-words max-w-4xl">{user?.preferredGenres.join(", ") ?? "No genre preference"}</Badge>
                    <Badge className="bg-secondary-100 text-dark-100">{user?.preferredMinimumPublicationYear ?? "No year preference"}</Badge>
                    <Badge className="bg-secondary-100 text-dark-100">
                        {user?.preferredBookLength && bookLength[user.preferredBookLength] ? bookLength[user.preferredBookLength] : "No length preference"}
                    </Badge>
                </div>
            </div>
            <div className="mt-10">
                {loading && (
                    <div className="flex flex-col md:flex-row gap-6">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}
                {Object.entries(recommendedBooks).map(([genre, books]) => (
                    <div key={genre} className="my-6">
                        <div className="font-bold text-lg mb-2">{genre}</div>
                        <BookCarousel books={books as BookModel[]} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecommendationsPage;