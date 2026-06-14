import { create } from "zustand";

interface UtilsState {
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
}


const useUtilsStore = create<UtilsState>((set) => ({
    showPassword: false,
    setShowPassword: (val) => set({ showPassword: val }),
}));


export default useUtilsStore;