import { create } from "zustand";

interface UtilsState {
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;

    openForgotPasswordModal: boolean;
    setOpenForgotPasswordModal: (val: boolean) => void;
}


const useUtilsStore = create<UtilsState>((set) => ({
    showPassword: false,
    setShowPassword: (val) => set({ showPassword: val }),

    openForgotPasswordModal: false,
    setOpenForgotPasswordModal: (val) => set({ openForgotPasswordModal: val }),
}));


export default useUtilsStore;