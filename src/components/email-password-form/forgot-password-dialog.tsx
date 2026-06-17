
import { ForgotPasswordFormData } from "@/src/validation-schema/form-data-types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Mail } from "lucide-react";
import useForgotPassword from "@/src/hooks/use-forgot-password";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

interface Props {
    forgotPasswordFn: (data: ForgotPasswordFormData) => Promise<any>,
    open: boolean;
    setOpen: (open: boolean) => void;
    onSuccess?: (data: any) => void;
    onFinally?: () => void;
    onError?: (data: any) => void;
}

const ForgotPasswordModal = ({ forgotPasswordFn, open, setOpen, onSuccess, onError, onFinally }: Props) => {
    const { form, onSubmit } = useForgotPassword({ forgotPasswordFn, open, setOpen, onSuccess, onError, onFinally });

    const handleClose = () => {
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <form className="space-y-5 py-[22px] px-[16px]" onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <div className="flex items-center flex-col justify-center gap-5">
                            <Mail />
                            <div className="flex flex-col gap-2">
                                <span className="font-[700] text-[20px] leading-[100%] text-center" >Forgot Password?</span>
                                <span className="font-[500] text-center text-gray-500 text-[12px] leading-[100%]" >Enter your Registered email address and we’ll send you a link to rest your password.</span>
                            </div>
                        </div>
                    </DialogHeader>
                    <Input
                        placeholder="Enter your email"
                        {...form.register("email")}
                        isError={!!form.formState.errors.email}
                        errorMessage={form.formState.errors.email?.message}
                    />
                    <div className="flex items-center gap-2 mt-4">
                        <Button type="button" className="flex-1" onClick={handleClose} variant="outline">Cancel</Button>
                        <Button type="submit" className="flex-1">Reset</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordModal;