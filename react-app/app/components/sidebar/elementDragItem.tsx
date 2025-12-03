import React, { useRef, useState } from "react";
import type { ElementType } from "~/builder/types/common";
import { SvgComponent } from "../common/svgComponent";
import { HeaderBlock } from "../canvas/layout/HeaderBlock";
import { FooterBlock } from "../canvas/layout/FooterBlock";
import { CardBlock } from "../canvas/layout/CardBlock";
import { TextContentBlock } from "../canvas/layout/TextContentBlock";
import { SliderBlock } from "../canvas/layout/SliderBlock";

type ElementDragItemProps = {
    icon: string;
    title: string;
    description: string;
    type: ElementType;
};

export const DRAG_DATA_KEY = "application/x-pagebuilder-element";
export const DRAG_META_KEY = "application/x-pagebuilder-element-meta";

export const ElementDragItem = ({ icon, title, description, type }: ElementDragItemProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const previewRef = useRef<HTMLDivElement | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData(DRAG_DATA_KEY, type);
        e.dataTransfer.effectAllowed = "copy";
        setIsDragging(true);

        window.dispatchEvent(
            new CustomEvent("pb-palette-drag-start", { detail: { type } })
        );

        let offsetX = 0;
        let offsetY = 0;

        if (previewRef.current) {
            const node = previewRef.current;
            const rect = node.getBoundingClientRect();
            offsetX = rect.width / 2;
            offsetY = rect.height / 2;
            e.dataTransfer.setDragImage(node, offsetX, offsetY);
        }

        const meta = JSON.stringify({ offsetX, offsetY });
        e.dataTransfer.setData(DRAG_META_KEY, meta);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        window.dispatchEvent(new CustomEvent("pb-palette-drag-end"));
    };

    const baseClasses =
        "relative w-full h-28 p-4 mb-3 text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col justify-center";

    const cursorAndStateClasses = isDragging
        ? " cursor-grabbing opacity-50"
        : " cursor-grab";

    return (
        <section
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={baseClasses + cursorAndStateClasses}
        >
            <SvgComponent img={icon} />
            <h3 className="font-medium text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
            <div
                ref={previewRef}
                className="pointer-events-none absolute -left-[9999px] -top-[9999px]"
            >
                {type === "header" && <HeaderBlock />}
                {type === "footer" && <FooterBlock />}
                {type === "card" && <CardBlock />}
                {type === "text-content" && (
                    <TextContentBlock text="Start typing your content..." />
                )}
                {type === "slider" && <SliderBlock />}
            </div>
        </section>
    );
};
