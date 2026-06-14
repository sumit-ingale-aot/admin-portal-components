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
}


const useLogin = ({ onSuccess, onError, onFinally }: Props) => {

    const router = useRouter()
    const { config } = useAuth();
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
        await apiHandler(() => loginAdmin(form.getValues(), config.loginUrl, config.apiUrl), {
            onSuccess: async (res) => {

                const data = res as { accessToken: string }
                await setCookies({ accessToken: data.accessToken })
                onSuccess?.(res)
                router.push(config.redirectUrl || "/dashboard")

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