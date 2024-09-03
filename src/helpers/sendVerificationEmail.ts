import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse>{

    try {
        await resend.emails.send({
            from: "Anno Posts <onboarding@resend.dev>",
            to: email,
            subject: "Anno-Posts Verification Code",
            react: VerificationEmail({username, otp: verificationCode})
        })

        return {success: true, message: "Verification email sent successfully"}
    } catch (emailError) {
        console.error("error sending verification email", emailError);
        return {success: false, message: "Failed to send verification email"}
    }

}
