
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login as authLogin } from "@/request/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { z } from "zod"
import { Loader2Icon } from "lucide-react";
import { getUser } from "@/request/user"
import { UserModel } from "@/models/UserModel"
import { useAuth } from "@/context/auth_context"
import { responseHandler } from "@/lib/utils"


//Login page
export default function LoginPage() {

    const [loading,setLoading] = useState(false)
    const {login} = useAuth()
    const navigate = useNavigate();

    //data validation
    const formSchema = z.object({
        email: z.string().min(2, {
          message: "email must be at least 2 characters.",
        }).email({message: "Invalid email"}),
        password: z.string().min(6)
      })
  // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: ""
        },
    })

  

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    setLoading(true)

    //login using firebase in the backend
    responseHandler(()=>authLogin(values.email,values.password),async (result)=>{
        //after login get user details from db using id
        await responseHandler(()=>getUser(result["uid"]),(result)=>{
            const user = new UserModel({id: result["id"], email:result["email"], name: result["name"],preferredGenres: result["preferredGenres"], preferredMinimumPublicationYear:result["preferredMinimumPublicationYear"], preferredBookLength: result["preferredBookLength"]})
            // call login function from auth context to save user locally
            login(user)
            setLoading(false)
            navigate("/")
        },(error)=>{

            // In case the user leaves browser afer registering and does not do the config then user will not be found in db
            // so we route them to config
            if (error == "User Configuration not found"){
                navigate("/config")
            }
            setLoading(false)  
        })
    },()=>{
        setLoading(false)
    })

  }

  return (
    <div className="flex justify-center">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Label className="text-4xl text-primary-100">Login.</Label>
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input className="w-[250px] border-primary-100" placeholder="email@domain.com" {...field} />
                </FormControl>
                <FormDescription>
                    Enter your Email.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" className="w-[250px] border-primary-100" placeholder="password" {...field} />
                </FormControl>
                <FormDescription>
                    Enter your Password.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button className="bg-secondary-100 text-dark-100 hover:text-white" disabled={loading} type="submit">
                {loading && (<Loader2Icon className="animate-spin" />)}
                Login
            </Button>
        </form>
        </Form>
    </div>
    
  )
}