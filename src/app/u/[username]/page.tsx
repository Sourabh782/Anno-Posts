"use client"
import { useParams } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { messageSchema } from "@/schemas/messageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const page = () => {
  const params = useParams<{username: string}>()
  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })
  
  const {reset} = form;

  const {toast} = useToast()

  const onSubmit = async(data: z.infer<typeof messageSchema>)=>{
    try {
      setIsSending(true)
      const res = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content
      })

      toast({
        title: "Success",
        description: res.data.message
      })
    } catch (error) {
      console.error("error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message;

      toast({
        title: "Message not sent",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
      reset({content: ""})
    }
  }

  return (
    <div className="container mx-auto max-w-4xl my-8 p-6 rounded">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

      <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Send anonymous message to {params.username}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your message..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex justify-center">
                  <Button type="submit" className="items-center">
                    {isSending ? ( <p className="flex"> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</p> ) : ("Send Message")}
                    
                  </Button>
                </div>
            </form>
      </Form>

      <div className="text-center mt-8">
        <div className="mb-4">Get Your Own Message Board</div>
        <Link href="/sign-up">
            <Button>Get yout Account</Button>
        </Link>
      </div>

    </div>
  )
}

export default page