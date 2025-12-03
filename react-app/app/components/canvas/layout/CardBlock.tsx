import React from "react";

type CardBlockProps = {
    title?: string;
    description?: string;
};

export const CardBlock: React.FC<CardBlockProps> = ({ title, description }) => {
    return (
        <div className="w-[300px] h-[200px] relative bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center text-sm text-gray-700">
            <div className="flex flex-col items-center gap-2">
                <h3 className="font-semibold text-center max-w-[260px]">
                    {title}
                </h3>
                <p className="text-xs text-gray-500 text-center max-w-[260px]">
                    {description}
                </p>
            </div>
        </div>
    );
};
