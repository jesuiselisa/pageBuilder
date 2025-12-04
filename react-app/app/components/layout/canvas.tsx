import React from "react";
import { useBuilder } from "~/builder/context/builderContext";
import { CanvasComponent } from "../canvas/canvasComponent";
import { ButtonComponent } from "../common/buttonComponent";
import { TextContentEditorModal } from "../canvas/edit/textContentEditorModal";
import { CardEditorModal } from "../canvas/edit/cardEditorModal";
import { SliderEditorModal } from "../canvas/edit/sliderEditorModal";
import { useCanvasDragAndDrop } from "./hooks/useCanvasDragAndDrop";
import { useCanvasEditors } from "./hooks/useCanvasEditors";

export const Canvas: React.FC = () => {
    const { elements, addElement, reorderElement, removeElement, updateElementContent } =
        useBuilder();
    const {
        canvasRef,
        scrollContainerRef,
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
    } = useCanvasDragAndDrop({ elements, addElement, reorderElement });

    const {
        editingTextId,
        editingTextDraft,
        editingCardId,
        editingCardTitle,
        editingCardDescription,
        editingSliderId,
        setEditingCardTitle,
        setEditingCardDescription,
        handleDeleteClick,
        handleTextEditOpen,
        handleTextEditCancel,
        handleTextEditSave,
        handleTextDraftChange,
        handleCardEditOpen,
        handleCardEditCancel,
        handleCardEditSave,
        handleSliderEditOpen,
        handleSliderEditCancel,
        handleSliderEditDone,
    } = useCanvasEditors({ elements, removeElement, updateElementContent });

    const header = elements.find((el) => el.type === "header");
    const footer = elements.find((el) => el.type === "footer");
    const contentElements = elements.filter(
        (el) => el.type !== "header" && el.type !== "footer"
    );

    const isEmpty = !header && !footer && contentElements.length === 0;
    const isSingleCenteredCard =
        contentElements.length === 1 && contentElements[0].type === "card";

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
                            <ButtonComponent icon="closeWhite" func={handleDeleteClick(header.id)} classN="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"/>
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
                                            <ButtonComponent icon="closeWhite" func={handleDeleteClick(el.id)} classN="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"/>

                                            {(el.type === "text-content" || el.type === "card" || el.type === "slider") && (
                                                <ButtonComponent icon="edit" func={el.type === "text-content" ? handleTextEditOpen(el.id) : el.type === "card" ? handleCardEditOpen(el.id) : handleSliderEditOpen(el.id)} classN="absolute top-2 right-10 w-7 h-7 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md" />
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
                                    <ButtonComponent icon="closeWhite" func={handleDeleteClick(footer.id)} classN="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"/>
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
