import {z} from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    if(request.method !== 'GET'){  // allows only get method
        return Response.json({
            success: false,
            message: "only get method allowed"
        }, {
            status: 405
        })
    }

    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        // validate with zod
        const res = UsernameQuerySchema.safeParse(queryParam)
        console.log(res);

        if(!res.success){
            const usernameErrors = res.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(',') : "invalid query parameters"
            }, {
                status: 400
            })
        }

        const { username } = res.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "username is already taken"
            }, {
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: "username is available"
        }, {
            status: 200
        })
        
    } catch (error) {
        console.error("Error checking Username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {
            status: 500
        })
    }
}