import type { ElementType } from "~/builder/types/common";
import { SvgComponent } from "../common/svgComponent";

type ElementDragItemProps = {
    icon: string;
    title: string;
    description: string;
    type: ElementType;
};

export const DRAG_DATA_KEY = "application/x-pagebuilder-element";

export const ElementDragItem = ({ icon, title, description, type }: ElementDragItemProps) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData(DRAG_DATA_KEY, type);
        e.dataTransfer.effectAllowed = "copy";
    };

    return (
        <section
            draggable
            onDragStart={handleDragStart}
            className="w-full h-28 p-4 mb-3 text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-grab active:cursor-grabbing flex flex-col justify-center"
        >
            <SvgComponent img={icon} />
            <h3 className="font-medium text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </section>
    );
};