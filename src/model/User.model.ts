import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export interface User extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: [true, "Username already exists"],
        required: [true, "Username is required"],
        trim: true,
    },
    email: {
        type: String,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"],
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Expiry date for verification code is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: false,
    },
    messages: [MessageSchema],
});

const UserModel = mongoose.models.user as mongoose.Model<User> || mongoose.model<User>("user", UserSchema);

export default UserModel;