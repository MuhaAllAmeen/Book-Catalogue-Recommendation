import { BookLength } from "@/models/UserModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/context/auth_context"
import z from "zod"
import { popularBookCategories } from "@/lib/constants"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"



// Add form scheme for validation
const formSchema = z.object({
    genre: z.array(z.object({
        id: z.string(),
        label: z.string()
    })).min(1, { message: "Please select at least one genre." }),
    minimumYear: z.number().min(1900).max(new Date().getFullYear()),
    preferredSize: z.enum(Object.values(BookLength) as [string, ...string[]])
})

export interface formValueType {
    genre: {
        id: string;
        label: string;
    }[];
    minimumYear: number;
    preferredSize: string;
}
// callback for on submit
interface UserConfigFormProps {
    onFormSubmit: (values: formValueType) => Promise<void>;
}

//form that is used is settings page and config page. Here, it is only used for selecting preferences etc. or else if dynamic then
//we can pass formScheme as a prop
const UserConfigForm:React.FC<UserConfigFormProps> = ({onFormSubmit}) => {

    const {user} = useAuth()
    const [minimumYear,setMinimumYear] = useState(user ? user.preferredMinimumPublicationYear : 1900)
    const [loading,setLoading] = useState(false)

    
  // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({

        resolver: zodResolver(formSchema),
        defaultValues: {
        // give initial values as the user's already selected genres in the settings page
        genre: user
        ? user.preferredGenres.map(label => {
            const found = popularBookCategories.find(cat => cat.label === label);
            return found ? { id: found.id, label: found.label } : null;
            // filter boolean clears out all the falsy values like null or undefined
        }).filter(Boolean) as { id: string, label: string }[]
        : [],
        minimumYear: user ? user.preferredMinimumPublicationYear : 1900,
        preferredSize: user? user.preferredBookLength : BookLength.MEDIUM
        },
    })

  

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    setLoading(true)
    await onFormSubmit(values) 
    setLoading(false)  
  }
    return(
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mt-15">
                    
                        <h2 className="text-xl text-middle-100">Select your favorite genres.</h2>
                        {/* <div className="grid grid-cols-5"> */}
                            <FormField
                            control={form.control}
                            name="genre"
                            render={() => (
                                <FormItem>
                                <div className="">
                                    <FormLabel className="text-base">Genres</FormLabel>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">

                                    {/* gets categories from the constant file */}
                                    {popularBookCategories.map((item) => (
                                        <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="genre"
                                        render={({ field }) => {
                                            return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center gap-2"
                                            >
                                                <FormControl>
                                                <Checkbox
                                                className="border-primary-100"
                                                    checked={!!field.value?.find(g => g.id === item.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            const newGenre = { id: item.id, label: item.label };
                                                            //add to the list of genres using spread operator
                                                            field.onChange([...field.value || [], newGenre]);
                                                        } else {
                                                            field.onChange(field.value?.filter(g => g.id !== item.id) || []);
                                                        }
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                {item.label}
                                                </FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                        />
                                    ))}
                                </div>

                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            
                        </div>
                    {/* </div> */}
                    <div className="mt-15 flex flex-col gap-9">
                        <h2 className="text-xl text-middle-100">Select your minimum publication year.</h2>
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="minimumYear"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{minimumYear}</FormLabel>
                                    <Slider min={1900} max={2025} onValueChange={(value) => {
                                        const year = value[0];
                                        setMinimumYear(year);  // Update local state for showing as label above slider
                                        field.onChange(year);  // Update form state
                                    }}  value={[field.value]}>
                                        <FormControl>
                                        </FormControl>
                                    </Slider>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                        
                    </div>
                    <div className="mt-15 flex flex-col gap-9">
                        <h2 className="text-xl text-middle-100">Select your preferred Book Size.</h2>
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="preferredSize"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Preffered Size</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Size" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="SHORT">&lt;200 pages</SelectItem>
                                            <SelectItem value="MEDIUM">200-400 pages</SelectItem>
                                            <SelectItem value="LONG">&gt;400 pages</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                        
                    </div>
                    <Button disabled={loading} type="submit" className="mt-14 cursor-pointer">{loading && (<Loader2Icon className="animate-spin" />)}Done</Button>
                </form>
            </Form>
        </div>

    )
}

export default UserConfigForm