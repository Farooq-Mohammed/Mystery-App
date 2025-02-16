import { Message } from "@/model/User.model";

export type ApiResponse = {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Message[];
}