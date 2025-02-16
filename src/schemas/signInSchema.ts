import {z} from "zod";

export const emailValidation = z
        .string()
        .email("Invalid email")

export const passwordValidation = z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must be at most 20 characters long")

export const signInSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
});