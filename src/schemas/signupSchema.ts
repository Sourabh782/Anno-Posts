import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 char long")
    .max(15, "Username must be max 15 char long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "invalid email address"}),
    password: z.string().min(4, {message: "min length 4"}).max(10, {message: "atmost 10 char"})
})