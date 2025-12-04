import { useCallback, useEffect, useRef, useState } from "react";
import type { ElementType } from "~/builder/types/common";
import type { ElementState } from "~/builder/types/state";
import { DRAG_DATA_KEY, DRAG_META_KEY } from "../../sidebar/elementDragItem";

const REORDER_DATA_KEY = "application/x-pagebuilder-reorder";

type UseCanvasDragAndDropParams = {
    elements: ElementState[];
    addElement: (type: ElementType, pos: { x: number; y: number }) => void;
    reorderElement: (id: string, targetIndex: number) => void;
};

export const useCanvasDragAndDrop = ({
    elements,
    addElement,
    reorderElement,
}: UseCanvasDragAndDropParams) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const dragPreviewRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const [isPaletteDragging, setIsPaletteDragging] = useState(false);
    const [hoverIndicator, setHoverIndicator] = useState<{
        id: string;
        position: "before" | "after";
    } | null>(null);

    useEffect(() => {
        const handlePaletteDragStart = () => {
            setIsPaletteDragging(true);
        };
        const handlePaletteDragEnd = () => {
            setIsPaletteDragging(false);
            setHoverIndicator(null);
        };

        window.addEventListener("pb-palette-drag-start", handlePaletteDragStart);
        window.addEventListener("pb-palette-drag-end", handlePaletteDragEnd);

        return () => {
            window.removeEventListener(
                "pb-palette-drag-start",
                handlePaletteDragStart
            );
            window.removeEventListener("pb-palette-drag-end", handlePaletteDragEnd);
        };
    }, []);

    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setHoverIndicator(null);

            const hasPaletteData =
                !!e.dataTransfer.getData(DRAG_DATA_KEY) ||
                (e.dataTransfer.types &&
                    Array.from(e.dataTransfer.types).includes(DRAG_DATA_KEY));

            if (hasPaletteData) {
                e.dataTransfer.dropEffect = "copy";
            } else {
                e.dataTransfer.dropEffect = "none";
            }

            if (!scrollContainerRef.current) return;
            const rect = scrollContainerRef.current.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;
            const threshold = 40;

            if (offsetY < threshold) {
                scrollContainerRef.current.scrollBy({ top: -20, behavior: "auto" });
            } else if (rect.bottom - e.clientY < threshold) {
                scrollContainerRef.current.scrollBy({ top: 20, behavior: "auto" });
            }
        },
        []
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (!canvasRef.current) return;

            const reorderId = e.dataTransfer.getData(REORDER_DATA_KEY);
            if (reorderId) {
                const contentElements = elements.filter(
                    (el) => el.type !== "header" && el.type !== "footer"
                );

                if (contentElements.length === 0) {
                    return;
                }

                const mouseY = e.clientY;
                let targetIndex = contentElements.length - 1;

                for (let i = 0; i < contentElements.length; i += 1) {
                    const el = contentElements[i];
                    const node = elementRefs.current[el.id];
                    if (!node) continue;

                    const rect = node.getBoundingClientRect();
                    const middleY = rect.top + rect.height / 2;

                    if (mouseY < middleY) {
                        targetIndex = i;
                        break;
                    }
                }

                reorderElement(reorderId, targetIndex);
                setHoverIndicator(null);
                return;
            }

            const rawType = e.dataTransfer.getData(DRAG_DATA_KEY);
            if (!rawType) return;

            const type = rawType as ElementType;

            const rect = canvasRef.current.getBoundingClientRect();
            let offsetX = 0;
            let offsetY = 0;
            const metaRaw = e.dataTransfer.getData(DRAG_META_KEY);
            if (metaRaw) {
                try {
                    const parsed = JSON.parse(metaRaw) as {
                        offsetX?: number;
                        offsetY?: number;
                    };
                    offsetX = parsed.offsetX ?? 0;
                    offsetY = parsed.offsetY ?? 0;
                } catch {
                    // ignore
                }
            }

            const rawX = e.clientX - rect.left - offsetX;
            const rawY = e.clientY - rect.top - offsetY;

            const previewWidth = offsetX * 2;
            const previewHeight = offsetY * 2;

            const maxX = previewWidth > 0 ? rect.width - previewWidth : rect.width;
            const maxY =
                previewHeight > 0 ? rect.height - previewHeight : rect.height;

            const x = Math.max(0, Math.min(rawX, maxX));
            const y = Math.max(0, Math.min(rawY, maxY));

            addElement(type, { x, y });
            setHoverIndicator(null);
        },
        [addElement, elements, reorderElement]
    );

    const handleElementClick = useCallback((id: string) => {
        const el = elementRefs.current[id];
        if (!el) return;

        el.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, []);

    const handleItemDragEnd = useCallback(() => {
        setHoverIndicator(null);
    }, []);

    const handleItemDragStart = useCallback((id: string) => {
        return (e: React.DragEvent<HTMLDivElement>) => {
            e.stopPropagation();
            e.dataTransfer.setData(REORDER_DATA_KEY, id);
            e.dataTransfer.effectAllowed = "move";
            const previewNode = dragPreviewRefs.current[id];
            if (previewNode) {
                const rect = previewNode.getBoundingClientRect();
                const offsetX = rect.width / 2;
                const offsetY = rect.height / 2;
                e.dataTransfer.setDragImage(previewNode, offsetX, offsetY);
            }
        };
    }, []);

    const handleItemDragOver = useCallback(
        (targetId: string) => {
            return (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();

                const hasPaletteData =
                    !!e.dataTransfer.getData(DRAG_DATA_KEY) ||
                    (e.dataTransfer.types &&
                        Array.from(e.dataTransfer.types).includes(DRAG_DATA_KEY));
                const hasReorderData =
                    !!e.dataTransfer.getData(REORDER_DATA_KEY) ||
                    (e.dataTransfer.types &&
                        Array.from(e.dataTransfer.types).includes(REORDER_DATA_KEY));

                if (hasPaletteData) {
                    e.dataTransfer.dropEffect = "copy";
                } else if (hasReorderData) {
                    e.dataTransfer.dropEffect = "move";
                } else {
                    e.dataTransfer.dropEffect = "none";
                }

                if (!scrollContainerRef.current) return;
                const rect = scrollContainerRef.current.getBoundingClientRect();
                const offsetY = e.clientY - rect.top;
                const threshold = 40;

                if (offsetY < threshold) {
                    scrollContainerRef.current.scrollBy({
                        top: -20,
                        behavior: "auto",
                    });
                } else if (rect.bottom - e.clientY < threshold) {
                    scrollContainerRef.current.scrollBy({
                        top: 20,
                        behavior: "auto",
                    });
                }

                const node = elementRefs.current[targetId];
                if (!node) return;
                const targetRect = node.getBoundingClientRect();
                const middleY = targetRect.top + targetRect.height / 2;
                const position: "before" | "after" =
                    e.clientY > middleY ? "after" : "before";
                setHoverIndicator({ id: targetId, position });
            };
        },
        []
    );

    const handleItemDrop = useCallback(
        (targetId: string) => {
            return (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();

                const rawType = e.dataTransfer.getData(DRAG_DATA_KEY);
                if (rawType) {
                    if (!canvasRef.current) return;

                    const type = rawType as ElementType;
                    const canvasRect = canvasRef.current.getBoundingClientRect();

                    let offsetX = 0;
                    let offsetY = 0;
                    const metaRaw = e.dataTransfer.getData(DRAG_META_KEY);
                    if (metaRaw) {
                        try {
                            const parsed = JSON.parse(metaRaw) as {
                                offsetX?: number;
                                offsetY?: number;
                            };
                            offsetX = parsed.offsetX ?? 0;
                            offsetY = parsed.offsetY ?? 0;
                        } catch {
                            // ignore
                        }
                    }

                    const rawX = e.clientX - canvasRect.left - offsetX;
                    const rawY = e.clientY - canvasRect.top - offsetY;

                    const previewWidth = offsetX * 2;
                    const previewHeight = offsetY * 2;

                    const maxX =
                        previewWidth > 0
                            ? canvasRect.width - previewWidth
                            : canvasRect.width;
                    const maxY =
                        previewHeight > 0
                            ? canvasRect.height - previewHeight
                            : canvasRect.height;

                    const x = Math.max(0, Math.min(rawX, maxX));
                    const y = Math.max(0, Math.min(rawY, maxY));

                    addElement(type, { x, y });
                    return;
                }

                const draggedId = e.dataTransfer.getData(REORDER_DATA_KEY);
                if (!draggedId) return;

                const contentElements = elements.filter(
                    (el) => el.type !== "header" && el.type !== "footer"
                );

                const targetNode = elementRefs.current[targetId];
                const targetIndex = contentElements.findIndex(
                    (el) => el.id === targetId
                );

                if (!targetNode || targetIndex === -1) {
                    reorderElement(draggedId, contentElements.length - 1);
                    return;
                }

                const rect = targetNode.getBoundingClientRect();
                const middleY = rect.top + rect.height / 2;
                const isAfter = e.clientY > middleY;

                const finalIndex = isAfter ? targetIndex + 1 : targetIndex;

                reorderElement(draggedId, finalIndex);
            };
        },
        [addElement, elements, reorderElement]
    );

    const registerElementRef =
        (id: string) => (node: HTMLDivElement | null) => {
            elementRefs.current[id] = node;
        };

    const registerDragPreviewRef =
        (id: string) => (node: HTMLDivElement | null) => {
            dragPreviewRefs.current[id] = node;
        };

    return {
        canvasRef,
        scrollContainerRef,
        elementRefs,
        dragPreviewRefs,
        isPaletteDragging,
        hoverIndicator,
        handleDragOver,
        handleDrop,
        handleElementClick,
        handleItemDragStart,
        handleItemDragOver,
        handleItemDrop,
        handleItemDragEnd,
        registerElementRef,
        registerDragPreviewRef,
    };
};


