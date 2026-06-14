import { loginAdmin } from "@/actions/auth.actions";
import { setCookies } from "@/actions/cookies.action";
import { useAuth } from "@/context/auth.provider";
import { apiHandler } from "@/utils/api-handler";
import { loginValidationSchema } from "@/validation-schema";
import { LoginFormData } from "@/validation-schema/form-data-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
        await apiHandler(() => loginFn(form.getValues()), {
            onSuccess: async (res) => {
                onSuccess?.(res)

            },
            onError: (err: any) => {

                if (err.status == 403) {
                    form.setError("email", {
                        message: err.message || "Forbidden access or user not found"
                    })
                }
                onError?.(err)

            },
            onFinally: () => {
                onFinally?.()
            }
        })
    }

    return { form, onSubmit };
}

export default useLogin;