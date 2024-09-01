import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "not authenticated"
        }, {
            status: 401
        })
    }

    const userId = user._id

    const {acceptMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage: acceptMessage}, {new: true})

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "failed to update user accepting message"
            }, {
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: "Message accpetance status updated successfully",
            updatedUser
        }, {
            status: 200
        })
    } catch (error) {
        console.log("failed to update user accepting message");
        return Response.json({
            success: false,
            message: "failed to update user accepting message"
        }, {
            status: 500
        })
    }
}

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "not authenticated"
        }, {
            status: 401
        })
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if(!foundUser){
            return Response.json({
                success: false,
                message: "user not found"
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Message accpetance status updated successfully",
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, {
            status: 200
        })
        
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error retreiving message accepting status"
        }, {
            status: 500
        })
    }

}
