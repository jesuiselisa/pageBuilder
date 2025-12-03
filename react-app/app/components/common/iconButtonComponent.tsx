import React from "react";

type IconButtonProps = {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
    type?: "button" | "submit" | "reset";
};

export const IconButtonComponent: React.FC<IconButtonProps> = ({
    onClick,
    children,
    className = "",
    ariaLabel,
    type = "button",
}) => {
    const baseClasses =
        "w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm hover:shadow-md transition-opacity transition-colors";

    return (
        <button
            type={type}
            onClick={onClick}
            aria-label={ariaLabel}
            className={`${baseClasses} ${className}`}
        >
            {children}
        </button>
    );
};

