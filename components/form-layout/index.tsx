"use client";

import Image from "next/image";
import { ReactNode } from "react";


interface Props {
    classname?: string;
    children: ReactNode;
    bgImage?: string;
    logo?: string;
}


const FormLayout = ({ classname, children, bgImage, logo }: Props) => {
    return <div className="w-screen h-screen relative">
        <div className={`${classname ? classname : "grid grid-cols-12 gap-5"} h-full w-full`} >
            <div className="col-span-12  flex  lg:justify-end justify-center lg:items-start items-end lg:col-span-6 lg:mt-40 p-5">
                {children}
            </div>
            {
                logo &&
                <div className="col-span-12 lg:block flex justify-center items-center lg:col-span-6 lg:mt-35">

                    <Image alt="image" src={logo} className="mt-10" width={400} height={400} />
                </div>
            }
        </div>
        {
            bgImage &&
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <Image alt="bg image" fill src={bgImage} />
            </div>
        }
    </div>
}


export default FormLayout;