
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ForgotPasswordFormData } from "../validation-schema/form-data-types"
import { forgotPasswordValidationSchema } from "../validation-schema"


const useForgotPassword = (
    { forgotPasswordFn, open, setOpen, onSuccess, onError, onFinally }: {
        forgotPasswordFn: (data: ForgotPasswordFormData) => Promise<any>,
        open: boolean,
        setOpen: (open: boolean) => void,
        onSuccess?: (data: any) => void,
        onError?: (data: any) => void,
        onFinally?: () => void,
    }) => {

    const form = useForm<ForgotPasswordFormData>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(forgotPasswordValidationSchema),
        defaultValues: {
            email: ""
        }
    })


    const onSubmit = async () => {

        try {
            const res = await forgotPasswordFn(form.getValues());
            if (res?.responseCode == 400 || res?.status == 400) {
                form.setError("email", {
                    message: res?.message || "Bad request"
                })
                return;
            }
            setOpen(false)
            onSuccess?.(res);
        } catch (error) {
            onError?.(error);
        } finally {
            onFinally?.();
        }
    }


    return { form, onSubmit }


}

export default useForgotPassword;