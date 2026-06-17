import Image from "next/image";
import { ReactNode } from "react";


interface Props {
    classname?: string;
    children: ReactNode;
    bgImage?: string;
}

const FormLayout = (props: Props) => {

    return <div className="w-screen h-screen relative flex items-center justify-center md:block" >
        {props.children}
        {
            props.bgImage &&
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <Image alt="bg image" fill src={props.bgImage} />
            </div>
        }

    </div>

}

export default FormLayout;