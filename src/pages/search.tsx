import { Button } from "@/components/ui/button"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { searchBook } from "@/request/books"
import { BookModel } from "@/models/BookModel"
import BookGrid from "@/main_components/book_grid"
import { Loader2Icon } from "lucide-react"
import { SkeletonCard } from "@/main_components/skeleton_card"
import { responseHandler } from "@/lib/utils"


//search page by title or ISBN
const SearchPage = () =>{

    const [books,setBooks] = useState<BookModel[]>([])
    const [loading,setLoading] = useState(false)

    //data validation according to type
    const formSchema = z.discriminatedUnion("type", [
        z.object({
            type: z.literal("Title"),
            search: z.string().min(2).max(50),
        }),
        z.object({
            type: z.literal("ISBN"),
            search: z
                .string()
                .regex(/^[0-9]{10,13}$/, "ISBN must be a 10 or 13 digit number"),
        }),
    ])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          search: "",
          type:"Title"
        },
      })

      function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setBooks([])

        //search for the book from google books api
        responseHandler(()=>searchBook(values.type, values.search),(data)=>{
            setBooks(data.map((book: any) => BookModel.fromObj(book)));
            setLoading(false)
        },()=>{
            setLoading(false)  
        })
        
      }
    return(
        <div>
            <h1 className="text-4xl text-primary-100 font-bold">Search for any book.</h1>
            <div className="mt-10">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start md:flex-row md:items-end gap-8">
                    <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Search</FormLabel>
                        <FormControl>
                            <Input placeholder="Title, ISBN" className="w-[200px] border-primary-100" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    
                    />
                    <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue="Title">
                                <SelectTrigger className="w-[180px] border-primary-100">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ISBN">ISBN</SelectItem>
                                    <SelectItem value="Title">Title</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" variant="outline" className="border-dark-100"disabled={loading} >
                        {loading && (<Loader2Icon className="animate-spin" />)}
                        Search
                    </Button>
                </form>                    
                </Form>
            </div>

            {loading && (
                    <div className="mt-10 flex flex-col md:flex-row gap-6">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}
                
            {books.length > 0 && (
                <BookGrid books={books} />
            )}
            
            
      </div>

    )
}

export default SearchPage