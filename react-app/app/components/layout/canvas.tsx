import React, { useCallback, useRef } from "react";
import { useBuilder } from "~/builder/context/builderContext";
import type { ElementType } from "~/builder/types/common";
import { DRAG_DATA_KEY } from "../sidebar/elementDragItem";
import { CanvasComponent } from "../canvas/canvasComponent";

export const Canvas: React.FC = () => {
    const { elements, addElement } = useBuilder();
    const canvasRef = useRef<HTMLDivElement | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (!canvasRef.current) return;

            const rawType = e.dataTransfer.getData(DRAG_DATA_KEY);
            if (!rawType) return;

            const type = rawType as ElementType;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            addElement(type, { x, y });
        },
        [addElement]
    );

    return (
        <div className="flex-1 h-[80vh] bg-slate-100 rounded-xl overflow-auto">
            <div
                ref={canvasRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative h-full bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-xl overflow-auto"
            >
                {elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400 pointer-events-none">
                        Drag and drop a component from the left
                    </div>
                )}
                {elements.map((el, index) => (
                    <CanvasComponent key={el.id} element={el} index={index} />
                ))}
            </div>
        </div>
    );
};