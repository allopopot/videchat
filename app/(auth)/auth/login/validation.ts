import z from "zod"

export const LoginValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export type LoginValidator = z.infer<typeof LoginValidator>;