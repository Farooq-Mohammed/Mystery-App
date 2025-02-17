import {z} from "zod";

export const messageSchema = z.object({
    content: z.string().min(1, "Message cannot be empty").max(600, "Message cannot be longer than 1000 characters"),
});