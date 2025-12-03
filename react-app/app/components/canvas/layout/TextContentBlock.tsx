import React from "react";

type TextContentBlockProps = {
    text: string;
};

export const TextContentBlock: React.FC<TextContentBlockProps> = ({ text }) => {
    return (
        <div className="w-full p-4 text-sm text-gray-700 text-left bg-white rounded-xl border border-gray-200 shadow-sm relative break-words">
            {text}
        </div>
    );
};
