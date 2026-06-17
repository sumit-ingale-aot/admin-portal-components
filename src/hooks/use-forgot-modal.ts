
import { useState } from "react";


const useForgotModal = () => {

    const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState<boolean>(false);

    const toggleForgotPasswordModal = () => {
        setOpenForgotPasswordModal((prev) => !prev);
    };

    return { openForgotPasswordModal, setOpenForgotPasswordModal, toggleForgotPasswordModal };

}

export default useForgotModal;