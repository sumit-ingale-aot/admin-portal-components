import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import useUtilsStore from "@/store/utils.store";
import { Button } from "../ui/button";
import useForgotPassword from "@/hooks/use-forgot-password";
import { Input } from "../ui/input";

const ForgotPasswordModal = () => {
    const { openForgotPasswordModal, setOpenForgotPasswordModal } = useUtilsStore();
    const { form, onSubmit } = useForgotPassword();

    const handleClose = () => {
        setOpenForgotPasswordModal(false);
        form.reset();
    };

    return (
        <Dialog open={openForgotPasswordModal} onOpenChange={setOpenForgotPasswordModal}>
            <DialogContent className="sm:max-w-sm">
                <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Forgot Password</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Enter your email"
                        {...form.register("email")}
                        isError={!!form.formState.errors.email}
                        errorMessage={form.formState.errors.email?.message}
                    />
                    <div className="flex items-center gap-2 mt-4">
                        <Button type="submit" className="flex-1" variant="destructive">Reset</Button>
                        <Button type="button" className="flex-1" onClick={handleClose} variant="outline">Cancel</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordModal;