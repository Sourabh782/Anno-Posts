'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const Page = () => {

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })
  const debounced = useDebounceCallback(setUsername, 500)

  useEffect(() => {
    const checkUsernameUnique = async ()=> {
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const res = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(res.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username availablity")
        } finally {
          setIsCheckingUsername(false)
        }

      }
    }

    checkUsernameUnique()
  }, [username])
  
  const onSubmit = async (data: z.infer<typeof signupSchema>)=>{
    setIsSubmitting(true)

    try {
      data.email = data.email.toLowerCase();
      data.username = data.username.toLowerCase();
      const res = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title: "Success",
        description: res.data.message
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      
      console.error("error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message;

      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Anno-Posts</h1>
          <p className="mb-4">Sign up to start messaging anonymously.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" 
                      {...field} 
                      onChange={(e)=>{
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin"/>}
                  <p className={`text-sm ${(usernameMessage === "Username is available") ? "text-green-500" : "text-red-500"}`}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </> : ("Signup")
              }
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already a member?
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800"> Sign in</Link>
          </p>
        </div>
      </div>
      
    </div>
  )
}

export default Page