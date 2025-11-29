import React from 'react'

type PropsType = {
    classN?: string;
    text: string;
    func: () => void;
};

export const ButtonComponent = ({ classN, text, func }: PropsType) => {
    return (
        <button className={`w-full px-4 py-2 mb-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors ${classN ? classN : ""}`} onClick={func}>
            <span className='text-white'>{text}</span>
        </button>
    )
}
