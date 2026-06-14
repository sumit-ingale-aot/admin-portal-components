"use client"

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EyeOffIcon, EyeIcon } from "lucide-react"
import {
    Field,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import useUtilsStore from "@/store/utils.store";
import useLogin from "@/hooks/use-login";
import { Spinner } from "../ui/spinner";
import ForgotPasswordModal from "./forgot-password-dialog";


interface Props {
    title?: string;
    onSuccess?: (data: any) => void;
    onError?: (data: any) => void;
    onFinally?: () => void;
}

const Form = ({ title, onError, onFinally, onSuccess }: Props) => {
    const { showPassword: showPass, setShowPassword, setOpenForgotPasswordModal } = useUtilsStore();
    const { form, onSubmit } = useLogin({ onError, onFinally, onSuccess });
    const { handleSubmit, register } = form;
    return <>
        <form className="max-w-lg w-full bg-white flex flex-col gap-5 rounded-lg shadow-sm p-5" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-center font-bold text-xl">{title || "Login Form"}</p>
            <Input
                placeholder="Enter your email"
                {...register("email")}
                isError={!!form.formState.errors.email}
                errorMessage={form.formState.errors.email?.message}
            />
            <Field className="w-full">
                <InputGroup isError={!!form.formState.errors.password} errorMessage={form.formState.errors.password?.message}>
                    <InputGroupInput
                        id="inline-end-input"
                        type={showPass ? "text" : "password"}
                        placeholder="Enter password"
                        {...register("password")}
                    />
                    <InputGroupAddon className="cursor-pointer" align="inline-end" onClick={() => setShowPassword(!showPass)}>
                        {showPass ? <EyeIcon /> : <EyeOffIcon />}
                    </InputGroupAddon>
                </InputGroup>
            </Field>
            <div className="flex flex-col  gap-2">
                <span className="text-sm pl-2 hover:underline cursor-pointer" onClick={() => setOpenForgotPasswordModal(true)}>Forgot Password?</span>
                <Button disabled={form.formState.isSubmitting} type="submit">
                    {form.formState.isSubmitting && <Spinner />}&nbsp;
                    Login</Button>
            </div>
        </form>
        <ForgotPasswordModal />
    </>

}

export default Form;