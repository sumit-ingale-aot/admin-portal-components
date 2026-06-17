
"use client"

import Image from "next/image";
import { Field } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { EyeIcon, EyeOffIcon, Lock, Mail } from "lucide-react";;
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import ForgotPasswordModal from "./forgot-password-dialog";
import useShowPassword from "@/src/hooks/use-show-password";
import useForgotModal from "@/src/hooks/use-forgot-modal";
import useLogin from "@/src/hooks/use-login";
import { ForgotPasswordFormData, LoginFormData } from "@/src/validation-schema/form-data-types";


interface Props {
    onSuccess?: (data: any) => void;
    onError?: (data: any) => void;
    onFinally?: () => void;
    loginFn: (data: LoginFormData) => Promise<any>;
    forgotPasswordFn: (data: ForgotPasswordFormData) => Promise<any>;
    forgotPasswordOnSuccess?: (data: any) => void;
    forgotPasswordOnFinally?: () => void;
    forgotPasswordOnError?: (data: any) => void;
    logo: string;
}



const Form = (props: Props) => {

    const { showPass, togglePass } = useShowPassword()
    const { setOpenForgotPasswordModal, openForgotPasswordModal } = useForgotModal()
    const { form, onSubmit } = useLogin(
        {
            onError: props.onError,
            onFinally: props.onFinally,
            onSuccess: props.onSuccess,
            loginFn: props.loginFn
        });

    return <div className="max-w-[430px] bg-white dark:bg-black w-full p-[24px] gap-[24px] md:mx-auto md:mt-20 border rounded-[12px] flex flex-col items-center" >
        <Image src={props.logo} alt="logo" width={150} height={50} />
        <div className="flex flex-col gap-1 justify-start w-full">
            <span className="font-[700] text-[20px] leading-[100%]" >Welcome Back</span>
            <span className="font-[500] text-gray-500 text-[12px] leading-[100%]" >Please Sign-In to your Account</span>
        </div>

        <form className="flex w-full flex-col gap-[24px]" onSubmit={form.handleSubmit(onSubmit)}>
            <Field className="w-full">
                <InputGroup isError={!!form.formState.errors.email} errorMessage={form.formState.errors.email?.message}>
                    <InputGroupAddon>
                        <Mail />
                    </InputGroupAddon>
                    <InputGroupInput
                        autoComplete="off"
                        id="inline-end-input"
                        placeholder="Enter your email"
                        {...form.register("email")}
                    />

                </InputGroup>
            </Field>
            <Field className="w-full">
                <InputGroup isError={!!form.formState.errors.password} errorMessage={form.formState.errors.password?.message}>
                    <InputGroupAddon>
                        <Lock />
                    </InputGroupAddon>
                    <InputGroupInput
                        autoComplete="off"
                        id="inline-end-input"
                        type={showPass ? "text" : "password"}
                        placeholder="Enter password"
                        {...form.register("password")}
                    />
                    <InputGroupAddon className="cursor-pointer" align="inline-end" onClick={togglePass}>
                        {showPass ? <EyeIcon /> : <EyeOffIcon />}
                    </InputGroupAddon>
                </InputGroup>
            </Field>
            <div className="flex flex-col  gap-2">
                <span className="text-sm text-end text-xs text-[#3276E4] hover:underline cursor-pointer" onClick={() => setOpenForgotPasswordModal(true)}>Forgot Password?</span>
                <Button disabled={form.formState.isSubmitting} type="submit">
                    {form.formState.isSubmitting && <Spinner />}&nbsp;
                    Login</Button>
            </div>
        </form>

        <ForgotPasswordModal
            onSuccess={props.forgotPasswordOnSuccess}
            onFinally={props.forgotPasswordOnFinally}
            onError={props.forgotPasswordOnError}
            forgotPasswordFn={props.forgotPasswordFn}
            open={openForgotPasswordModal} setOpen={setOpenForgotPasswordModal} />

    </div>
}

export default Form;