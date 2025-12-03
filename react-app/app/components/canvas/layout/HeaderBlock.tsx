import React from "react";

export const HeaderBlock: React.FC = () => {
    return (
        <header className="w-full h-[80px] px-6 flex items-center justify-between bg-gray-900 text-white">
            <span className="font-semibold tracking-tight">MyWebsite</span>
            <nav className="space-x-6 text-sm opacity-80">
                <span>Home</span>
                <span>About Us</span>
                <span>Contact</span>
            </nav>
        </header>
    );
};
