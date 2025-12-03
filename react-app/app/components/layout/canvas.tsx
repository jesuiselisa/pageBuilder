import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBuilder } from "~/builder/context/builderContext";
import type { ElementType } from "~/builder/types/common";
import { DRAG_DATA_KEY, DRAG_META_KEY } from "../sidebar/elementDragItem";
import { CanvasComponent } from "../canvas/canvasComponent";
import { TextContentEditorModal } from "../canvas/edit/TextContentEditorModal";
import { CardEditorModal } from "../canvas/edit/CardEditorModal";
import { SliderEditorModal } from "../canvas/edit/SliderEditorModal";

const REORDER_DATA_KEY = "application/x-pagebuilder-reorder";

export const Canvas: React.FC = () => {
    const { elements, addElement, reorderElement, removeElement, updateElementContent } =
        useBuilder();
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const dragPreviewRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [editingTextDraft, setEditingTextDraft] = useState<string>("");
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [editingCardTitle, setEditingCardTitle] = useState<string>("");
    const [editingCardDescription, setEditingCardDescription] = useState<string>("");
    const [editingSliderId, setEditingSliderId] = useState<string | null>(null);
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
            window.removeEventListener(
                "pb-palette-drag-end",
                handlePaletteDragEnd
            );
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
        [setHoverIndicator]
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
                }
            }

            const rawX = e.clientX - rect.left - offsetX;
            const rawY = e.clientY - rect.top - offsetY;

            const previewWidth = offsetX * 2;
            const previewHeight = offsetY * 2;

            const maxX =
                previewWidth > 0 ? rect.width - previewWidth : rect.width;
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

    const handleDeleteClick = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            removeElement(id);
            if (editingTextId === id) {
                setEditingTextId(null);
            }
            if (editingCardId === id) {
                setEditingCardId(null);
            }
            if (editingSliderId === id) {
                setEditingSliderId(null);
            }
        },
        [removeElement, editingTextId, editingCardId, editingSliderId]
    );

    const handleTextEditOpen = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setEditingTextId(id);
            const el = elements.find(item => item.id === id);
            setEditingTextDraft(el?.content?.text ?? "");
        },
        [elements]
    );

    const handleTextEditCancel = useCallback(() => {
        setEditingTextId(null);
        setEditingTextDraft("");
    }, []);

    const handleTextEditSave = useCallback(() => {
        if (!editingTextId) return;
        updateElementContent(editingTextId, { text: editingTextDraft });
        setEditingTextId(null);
        setEditingTextDraft("");
    }, [editingTextId, editingTextDraft, updateElementContent]);

    const handleTextDraftChange = useCallback((value: string) => {
        setEditingTextDraft(value);
    }, []);

    const handleCardEditOpen = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setEditingCardId(id);
            const el = elements.find(item => item.id === id);
            setEditingCardTitle(el?.content?.cardTitle ?? "");
            setEditingCardDescription(el?.content?.cardDescription ?? "");
        },
        [elements]
    );

    const handleCardEditCancel = useCallback(() => {
        setEditingCardId(null);
        setEditingCardTitle("");
        setEditingCardDescription("");
    }, []);

    const handleCardEditSave = useCallback(() => {
        if (!editingCardId) return;
        updateElementContent(editingCardId, {
            cardTitle: editingCardTitle,
            cardDescription: editingCardDescription,
        });
        setEditingCardId(null);
        setEditingCardTitle("");
        setEditingCardDescription("");
    }, [editingCardId, editingCardTitle, editingCardDescription, updateElementContent]);

    const handleSliderEditOpen = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setEditingSliderId(id);
        },
        []
    );

    const handleSliderEditCancel = useCallback(() => {
        setEditingSliderId(null);
    }, []);

    const handleSliderEditDone = useCallback(
        (slides: { label: string; imageUrl?: string; backgroundClass?: string }[]) => {
            if (!editingSliderId) return;
            updateElementContent(editingSliderId, { slides });
            setEditingSliderId(null);
        },
        [editingSliderId, updateElementContent]
    );

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
                    scrollContainerRef.current.scrollBy({ top: -20, behavior: "auto" });
                } else if (rect.bottom - e.clientY < threshold) {
                    scrollContainerRef.current.scrollBy({ top: 20, behavior: "auto" });
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
                            console.log("Failed to parse drag meta");
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

    const header = elements.find((el) => el.type === "header");
    const footer = elements.find((el) => el.type === "footer");
    const contentElements = elements.filter(
        (el) => el.type !== "header" && el.type !== "footer"
    );

    const isEmpty = !header && !footer && contentElements.length === 0;
    const isSingleCenteredCard =
        contentElements.length === 1 && contentElements[0].type === "card";

    const registerElementRef = (id: string) => (node: HTMLDivElement | null) => {
        elementRefs.current[id] = node;
    };

    const registerDragPreviewRef =
        (id: string) => (node: HTMLDivElement | null) => {
            dragPreviewRefs.current[id] = node;
        };

    return (
        <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
            <div className="h-full flex items-start justify-center py-6">
                <div
                    ref={canvasRef}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={
                        "relative w-full max-w-4xl h-full bg-white rounded-xl overflow-hidden transition-all " +
                        (isPaletteDragging
                            ? "border-2 border-purple-400 shadow-md shadow-purple-200/60"
                            : "border border-slate-200 shadow-sm")
                    }
                >
                    {header && (
                        <div className="absolute top-0 left-0 right-0 z-20 cursor-default group">
                            <CanvasComponent element={header} />
                            <button
                                type="button"
                                onClick={handleDeleteClick(header.id)}
                                className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div
                        ref={scrollContainerRef}
                        className={
                            "flex flex-col h-full min-h-0 bg-white overflow-y-auto" +
                            (header ? " pt-[80px]" : "")
                        }
                    >
                        <main
                            className={
                                isSingleCenteredCard
                                    ? "flex-1 flex px-6 py-6 bg-slate-50 justify-center items-center"
                                    : "flex-1 flex flex-wrap gap-4 px-6 py-6 bg-slate-50 justify-center items-start"
                            }
                        >
                            {isEmpty && (
                                <div className="flex-1 flex items-center justify-center text-sm text-slate-400 pointer-events-none">
                                    Drag and drop a component from the left
                                </div>
                            )}
                            {contentElements.map((el, index) => {
                                const isEditingText = editingTextId === el.id;
                                const isHoverTarget = hoverIndicator?.id === el.id;
                                const showBeforeIndicator =
                                    isHoverTarget && hoverIndicator?.position === "before";
                                const showAfterIndicator =
                                    isHoverTarget && hoverIndicator?.position === "after";
                                return (
                                    <div
                                        key={el.id}
                                        onClick={() => handleElementClick(el.id)}
                                        className={
                                            "cursor-grab" +
                                            (el.type === "card" ? "" : " w-full")
                                        }
                                    >
                                        <div
                                            ref={registerElementRef(el.id)}
                                            className="relative group"
                                            draggable
                                            onDragStart={handleItemDragStart(el.id)}
                                            onDragOver={handleItemDragOver(el.id)}
                                            onDrop={handleItemDrop(el.id)}
                                            onDragEnd={handleItemDragEnd}
                                        >
                                            <div
                                                ref={registerDragPreviewRef(el.id)}
                                                className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-80"
                                            >
                                                <div
                                                    className={
                                                        el.type === "slider"
                                                            ? "w-[360px]"
                                                            : el.type === "card"
                                                                ? "w-[300px]"
                                                                : el.type === "text-content"
                                                                    ? "w-[360px]"
                                                                    : "w-[320px]"
                                                    }
                                                >
                                                    <CanvasComponent element={el} />
                                                </div>
                                            </div>
                                            {showBeforeIndicator && (
                                                <div className="absolute -top-1 left-0 right-0 h-0.5 bg-purple-400" />
                                            )}
                                            {showAfterIndicator && (
                                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-400" />
                                            )}

                                            <CanvasComponent element={el} />

                                            <button
                                                type="button"
                                                onClick={handleDeleteClick(el.id)}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
                                            >
                                                ×
                                            </button>

                                            {el.type === "text-content" && (
                                                <button
                                                    type="button"
                                                    onClick={handleTextEditOpen(el.id)}
                                                    className="absolute top-2 right-10 w-7 h-7 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
                                                >
                                                    ✎
                                                </button>
                                            )}
                                            {el.type === "card" && (
                                                <button
                                                    type="button"
                                                    onClick={handleCardEditOpen(el.id)}
                                                    className="absolute top-2 right-10 w-7 h-7 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
                                                >
                                                    ✎
                                                </button>
                                            )}
                                            {el.type === "slider" && (
                                                <button
                                                    type="button"
                                                    onClick={handleSliderEditOpen(el.id)}
                                                    className="absolute top-2 right-10 w-7 h-7 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
                                                >
                                                    ✎
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </main>

                        {footer && (
                            <div
                                ref={registerElementRef(footer.id)}
                                className="cursor-default group"
                            >
                                <div className="relative">
                                    <CanvasComponent element={footer} />
                                    <button
                                        type="button"
                                        onClick={handleDeleteClick(footer.id)}
                                        className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TextContentEditorModal
                open={Boolean(editingTextId)}
                value={editingTextDraft}
                onChange={handleTextDraftChange}
                onCancel={handleTextEditCancel}
                onDone={handleTextEditSave}
            />

            <CardEditorModal
                open={Boolean(editingCardId)}
                title={editingCardTitle}
                description={editingCardDescription}
                onChangeTitle={setEditingCardTitle}
                onChangeDescription={setEditingCardDescription}
                onCancel={handleCardEditCancel}
                onDone={handleCardEditSave}
            />

            <SliderEditorModal
                open={Boolean(editingSliderId)}
                slides={
                    (editingSliderId &&
                        elements.find((el) => el.id === editingSliderId)?.content
                            ?.slides) || [
                        { label: "Slider 1", imageUrl: "" },
                        { label: "Slider 2", imageUrl: "" },
                        { label: "Slider 3", imageUrl: "" },
                    ]
                }
                initialIndex={
                    editingSliderId
                        ? (elements.find((el) => el.id === editingSliderId)?.content
                            ?.activeSlideIndex ?? 0)
                        : 0
                }
                onCancel={handleSliderEditCancel}
                onDone={handleSliderEditDone}
            />
        </div>
    );
};
