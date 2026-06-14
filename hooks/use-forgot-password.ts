import { useAuth } from "@/context/auth.provider";
import { apiHandler } from "@/utils/api-handler";
import { forgotPasswordValidationSchema } from "@/validation-schema";
import { ForgotPasswordFormData } from "@/validation-schema/form-data-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useUtilsStore from "@/store/utils.store";

interface Props {
    forgotPasswordFn: (data: ForgotPasswordFormData) => Promise<any>;
}

const useForgotPassword = ({ forgotPasswordFn }: Props) => {
    const { config } = useAuth();
    const { setOpenForgotPasswordModal } = useUtilsStore();
    const form = useForm<ForgotPasswordFormData>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(forgotPasswordValidationSchema),
        defaultValues: { email: "" }
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        await apiHandler(() => forgotPasswordFn(data), {
            onSuccess: () => {
                setOpenForgotPasswordModal(false);
                form.reset();
            },
        });
    };

    return { form, onSubmit };
};

export default useForgotPassword;