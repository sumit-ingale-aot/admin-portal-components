import z from 'zod'

export const loginValidationSchema = z.object({
    email: z.string().min(1, "Please enter email").email("Email is invalid"),
    password: z.string().min(1, "Please enter password"),
})

export const forgotPasswordValidationSchema = z.object({
    email: z.string().min(1, "Please enter email").email("Email is invalid"),

})