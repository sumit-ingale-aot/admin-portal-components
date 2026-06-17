import * as vs from './index'
import z from 'zod'

export type LoginFormData = z.infer<typeof vs.loginValidationSchema>
export type ForgotPasswordFormData = z.infer<typeof vs.forgotPasswordValidationSchema>