import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST (req: Request) {
    await connectDB();
    try {
        const { email, username, password } = await req.json();

        if (!email || !username || !password) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        // Check if a verified user already exists with the given username
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Username is already taken",
            }, { status: 400 });
        }

        // Check if a user exists with the given email
        let user = await UserModel.findOne({ email });

        if (user) {
            if (user.isVerified) {
                return NextResponse.json<ApiResponse>({
                    success: false,
                    message: "User with this email already exists",
                }, { status: 400 });
            }

            // Update existing unverified user
            user.password = await bcrypt.hash(password, 10);
        } else {
            // Create new user
            user = new UserModel({
                email,
                username,
                password: await bcrypt.hash(password, 10),
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
        }

        // Generate verification code and expiry date
        user.verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyCodeExpiry = new Date(Date.now() + 1000 * 60 * 60);
        await user.save();

        // Send verification email
        const emailResponse = await sendVerificationEmail(user.email, user.username, user.verifyCode);
        if (!emailResponse.success) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: emailResponse.message,
            }, { status: 500 });
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "User created successfully. Please verify your email to complete registration",
        });
    } catch (error) {
        console.error("Error creating user", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Error creating user",
        }, { status: 500 });
    }
};