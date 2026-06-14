import { forgotPasswordAdmin } from "@/actions/auth.actions"
import { useAuth } from "@/context/auth.provider"
import { apiHandler } from "@/utils/api-handler"
import { forgotPasswordValidationSchema } from "@/validation-schema"
import { ForgotPasswordFormData } from "@/validation-schema/form-data-types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


const useForgotPassword = () => {
    const { config } = useAuth()


    const form = useForm<ForgotPasswordFormData>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(forgotPasswordValidationSchema),
        defaultValues: {
            email: ""
        }
    })


    const onSubmit = async () => {
        await apiHandler(() => forgotPasswordAdmin(form.getValues(), config.forgotPasswordUrl, config.apiUrl), {
            onSuccess: () => {
                toast.success("Password reset link sent successfully.")
            }
        })
    }


    return { form, onSubmit }


}

export default useForgotPassword;