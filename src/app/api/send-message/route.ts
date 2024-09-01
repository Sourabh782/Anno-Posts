import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request: Request){
    await dbConnect()
    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            }, {
                status: 404
            })
        }

        // is user accepting messages ?
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "user is not accepting messages"
            }, {
                status: 403
            })
        }
        // new message
        const newMessage = {
            content,
            createdAt: new Date()
        }
        // adding message
        user.messages.push(newMessage as Message);

        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Something went wrong while sending messages", error);
        
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {
            status: 500
        })
    }
}