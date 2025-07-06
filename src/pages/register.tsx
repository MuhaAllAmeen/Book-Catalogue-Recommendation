
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/request/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { z } from "zod"
import { Loader2Icon } from "lucide-react";
import { responseHandler } from "@/lib/utils"

//register page
export default function RegisterPage() {

    const navigate = useNavigate();
    const [loading,setLoading] = useState(false)

    //data validation
    const formSchema = z.object({
        name: z.string().min(2),
        email: z.string().min(2, {
          message: "email must be at least 2 characters.",
        }).email({message: "Invalid email"}),
        password1: z.string()
          .min(6, { message: "Password must be at least 6 characters." })
          .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
            message: "Password must contain at least one uppercase letter, one number, and one special character."
          }),
        password2: z.string()
          .min(6, { message: "Password must be at least 6 characters." })
          .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
            message: "Password must contain at least one uppercase letter, one number, and one special character."
          }),
      }).refine((data) => data.password1 === data.password2, {
        message: "Passwords do not match",
        path: ["password2"], // set the error on password2
      })
      
  // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name:"",
        email: "",
        password1: "",
        password2:""
        },
    })

  

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    console.log(values)
    setLoading(true)
    //save user to firebase and then route to user preference config
    responseHandler(()=>register(values.email,values.password1),(data)=>{
        const uid =data["uid"]
        const email = values.email
        const name = values.name
        setLoading(false)
        navigate("/config",{state:{uid, email, name }})
    },()=>{
        setLoading(false)  
    })
  }

  return (
    <div className="flex justify-center">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Label className="text-4xl text-primary-100">Register.</Label>
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input className="w-[250px] border-primary-100" placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>
                    Enter your Name.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
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
            name="password1"
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
            <FormField
            control={form.control}
            name="password2"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" className="w-[250px] border-primary-100" placeholder="password" {...field} />
                </FormControl>
                <FormDescription>
                    Re-Enter your Password.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button className="bg-secondary-100 text-dark-100 hover:text-white" disabled={loading} type="submit">
                {loading && (<Loader2Icon className="animate-spin" />)}
                Register
            </Button>
        </form>
        </Form>
    </div>
    
  )
}