import React from 'react'
import { SvgComponent } from './svgComponent';

type PropsType = {
    classN?: string;
    text?: string;
    icon?: string;
    func: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ButtonComponent = ({ classN, text, func, icon }: PropsType) => {
    return (
        text !== undefined ?
        <button className={`${classN ? classN : ""}`} onClick={func}>
            <span>{text}</span>
        </button>
        :
        <button className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm hover:shadow-md transition-opacity transition-colors ${classN ? classN : ""}`} onClick={func}>
            <SvgComponent img={icon}/>
        </button>
    )
}
