import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request:Request){
    await dbConnect();

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            }, {
                status: 404
            })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {
                status: 200
            })
        } else if(!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has been expired. try again"
            }, {
                status: 400
            })
        } else {
            return Response.json({
                success: false,
                message: "Verification code is incorrect"
            }, {
                status: 400
            })
        }

    } catch (error) {
        console.error("error verifying code", error);
        return Response.json({
            success: false,
            message: "Error verifying code"
        }, {
            status: 500
        })
    }
}