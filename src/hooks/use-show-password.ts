import { useState } from "react";


const useShowPassword = () => {

    const [showPass, setShowPass] = useState<boolean>(false);


    const togglePass = () => {
        setShowPass((p) => !p)
    };

    return { showPass, togglePass };

}

export default useShowPassword;