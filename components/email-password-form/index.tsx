"use client"

import { Button } from "../ui/button";
import { Input } from "../ui/input";


interface Props {
    title?: string;
}

const Form = ({ title }: Props) => {
    return <form className="max-w-lg w-full bg-white flex flex-col gap-5 rounded-lg shadow-sm p-5" >
        <p className="text-center font-bold text-xl">{title || "Login Form"}</p>
        <Input name="email" placeholder="Enter your email" />
        <Input name="password" type="password" placeholder="Enter your password" />
        <div className="flex flex-col  gap-2">
            <span className="text-sm pl-2 hover:underline cursor-pointer" >Forgot Password?</span>
            <Button type="submit">Login</Button>
        </div>
    </form>
}

export default Form;