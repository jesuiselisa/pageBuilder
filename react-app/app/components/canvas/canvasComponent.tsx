import React from "react";
import type { ElementState } from "~/builder/types/state";
import type { ElementType } from "~/builder/types/common";

type CanvasProps = {
    element: ElementState;
    index: number; 
};

const cardBase =
    "bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center text-sm text-gray-700";

const renderInner = (type: ElementType) => {
    switch (type) {
        case "header":
            return (
                <div className="w-full h-full px-6 flex items-center justify-between bg-gray-900 text-white">
                    <span className="font-semibold">MyWebsite</span>
                    <nav className="space-x-6 text-sm opacity-80">
                        <span>Home</span>
                        <span>About Us</span>
                        <span>Contact</span>
                    </nav>
                </div>
            );
        case "footer":
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xs">
                    jesuiselisa Page Builder
                </div>
            );
        case "card":
            return (
                <div className="flex flex-col items-center gap-2">
                    <h3 className="font-semibold">Content Card</h3>
                    <p className="text-xs text-gray-500 text-center max-w-[280px]">
                        Content description will be placed here…
                    </p>
                </div>
            );
        case "text-content":
            return (
                <div className="w-full h-full p-4 text-sm text-gray-700 text-left">
                    Click to edit this text…
                </div>
            );
        case "slider":
        default:
            return (
                <div className="w-full h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden">
                    <div className="flex-1 bg-gray-700/60" />
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
                        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                            ‹
                        </button>
                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className={
                                        "w-2 h-2 rounded-full " +
                                        (i === 0 ? "bg-white" : "bg-white/30")
                                    }
                                />
                            ))}
                        </div>
                        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                            ›
                        </button>
                    </div>
                </div>
            );
    }
};

export const CanvasComponent: React.FC<CanvasProps> = ({ element, index }) => {
    const { type, zIndex } = element;

    const isHeader = type === "header";
    const isFooter = type === "footer";
    const isSlider = type === "slider";

    const CONTENT_TOP_OFFSET = 140;      
    const CONTENT_VERTICAL_GAP = 260;    

    let style: React.CSSProperties;

    if (isHeader) {
        style = {
            position: "sticky",
            left: 0,
            top: 0,
            width: "100%",
            height: 80,
            zIndex: 5,
        };
    } else if (isFooter) {
        style = {
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 60,
            zIndex,
        };
    } else {
        style = {
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: CONTENT_TOP_OFFSET + index * CONTENT_VERTICAL_GAP,
            width: 640,
            minHeight: isSlider ? 320 : 220,
            zIndex,
        };
    }

    const className =
        isHeader || isFooter
            ? ""
            : cardBase;

    return (
        <div style={style} className={className}>
            {renderInner(type)}
        </div>
    );
};