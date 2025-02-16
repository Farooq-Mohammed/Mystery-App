import {z} from "zod";

export const verifyCodeValidation = z
        .string()
        .min(6, "Verification code must be at least 6 characters long")
        .max(6, "Verification code must be at most 6 characters long")

export const verifySchema = z.object({
    verifyCode: verifyCodeValidation,
});