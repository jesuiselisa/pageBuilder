import React, { useState, useEffect } from "react";
import type { SliderSlideContent } from "~/builder/types/state";
import { BaseModal } from "./BaseModal";

type SliderEditorModalProps = {
    open: boolean;
    slides: SliderSlideContent[];
    initialIndex?: number;
    onCancel: () => void;
    onDone: (slides: SliderSlideContent[]) => void;
};

export const SliderEditorModal: React.FC<SliderEditorModalProps> = ({
    open,
    slides,
    initialIndex,
    onCancel,
    onDone,
}) => {
    const [localSlides, setLocalSlides] = useState<SliderSlideContent[]>(slides);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setLocalSlides(slides);
        setActiveIndex(initialIndex ?? 0);
    }, [slides, initialIndex]);

    const handleFieldChange = (field: "label" | "imageUrl", value: string) => {
        setLocalSlides((prev) =>
            prev.map((slide, idx) =>
                idx === activeIndex ? { ...slide, [field]: value } : slide
            )
        );
    };

    const handleDone = () => {
        onDone(localSlides);
    };

    const currentSlide = localSlides[activeIndex] ?? { label: "", imageUrl: "" };

    return (
        <BaseModal
            open={open}
            title="Edit Slider"
            onCancel={onCancel}
            onDone={handleDone}
            panelClassName="max-w-xl"
        >
            <div className="mb-4 flex gap-2">
                {localSlides.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={
                            "px-3 py-1 text-xs rounded-full border " +
                            (idx === activeIndex
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50")
                        }
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Label
                    </label>
                    <input
                        type="text"
                        className="w-full text-sm rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentSlide.label}
                        onChange={(e) =>
                            handleFieldChange("label", e.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Slide Image
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const result = reader.result;
                                    if (typeof result === "string") {
                                        handleFieldChange("imageUrl", result);
                                    }
                                };
                                reader.readAsDataURL(file);
                            }}
                        />
                        {currentSlide.imageUrl && (
                            <button
                                type="button"
                                className="text-xs text-red-500 hover:underline"
                                onClick={() => handleFieldChange("imageUrl", "")}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    {currentSlide.imageUrl && (
                        <div className="mt-3">
                            <img
                                src={currentSlide.imageUrl}
                                alt={currentSlide.label}
                                className="w-full max-h-40 object-cover rounded-md border border-gray-200"
                            />
                        </div>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};
