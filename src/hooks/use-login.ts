
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormData } from "../validation-schema/form-data-types";
import { loginValidationSchema } from "../validation-schema";

interface Props {
    onSuccess?: (data: any) => void;
    onError?: (data: any) => void;
    onFinally?: () => void;
    loginFn: (data: LoginFormData) => Promise<any>;
}


const useLogin = ({ onSuccess, onError, onFinally, loginFn }: Props) => {

    const form = useForm<LoginFormData>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(loginValidationSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })


    const onSubmit = async () => {

        try {
            const res = await loginFn(form.getValues());
            if (res?.status == 403) {
                form.setError("email", {
                    message: res.message || "Forbidden access or user not found"
                })
            }

            if (res.status == 400) {
                form.setError("email", {
                    message: res.message || "Bad request"
                })
            }
            onSuccess?.(res)
        } catch (error: any) {
            onError?.(error)
        } finally {
            onFinally?.()
        }
    }

    return { form, onSubmit };
}

export default useLogin;