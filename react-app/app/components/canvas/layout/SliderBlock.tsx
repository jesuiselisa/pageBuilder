import React, { useState, useCallback } from "react";
import type { SliderSlideContent } from "~/builder/types/state";

type SliderBlockProps = {
    slides?: SliderSlideContent[];
    activeIndex?: number;
    onActiveIndexChange?: (index: number) => void;
};

const DEFAULT_SLIDES: SliderSlideContent[] = [
    {
        label: "Slider 1",
        imageUrl: "",
        backgroundClass: "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
    {
        label: "Slider 2",
        imageUrl: "",
        backgroundClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
        label: "Slider 3",
        imageUrl: "",
        backgroundClass: "bg-gradient-to-r from-orange-500 to-pink-500",
    },
];

export const SliderBlock: React.FC<SliderBlockProps> = ({
    slides,
    activeIndex,
    onActiveIndexChange,
}) => {
    const effectiveSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

    const [internalIndex, setInternalIndex] = useState(0);
    const currentIndex = activeIndex ?? internalIndex;

    const goTo = useCallback(
        (index: number) => {
            const total = effectiveSlides.length;
            const next = ((index % total) + total) % total;
            if (onActiveIndexChange) {
                onActiveIndexChange(next);
            } else {
                setInternalIndex(next);
            }
        },
        [effectiveSlides.length, onActiveIndexChange]
    );

    const handlePrev = useCallback(() => {
        goTo(currentIndex - 1);
    }, [currentIndex, goTo]);

    const handleNext = useCallback(() => {
        goTo(currentIndex + 1);
    }, [currentIndex, goTo]);

    return (
        <div className="w-full h-[400px] relative flex flex-col bg-gray-900 rounded-xl overflow-hidden">
            <div className="flex-1 relative overflow-hidden">
                <div
                    className="absolute inset-0 flex transition-transform duration-500"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {effectiveSlides.map((slide, idx) => {
                        const hasImage =
                            slide.imageUrl && slide.imageUrl.trim().length > 0;

                        const fallbackBackground =
                            slide.backgroundClass ??
                            (idx === 0
                                ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                : idx === 1
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                : "bg-gradient-to-r from-orange-500 to-pink-500");

                        return (
                            <div
                                key={idx}
                                className="relative flex-shrink-0 w-full h-full text-white text-lg font-semibold"
                            >
                                {hasImage ? (
                                    <img
                                        src={slide.imageUrl}
                                        alt={slide.label}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                        onDragStart={(e) => e.preventDefault()}
                                    />
                                ) : (
                                    <div
                                        className={
                                            "w-full h-full " + fallbackBackground
                                        }
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] tracking-tight px-6 text-center">
                                        {slide.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
                <button
                    type="button"
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm"
                >
                    ‹
                </button>
                <div className="flex gap-2">
                    {effectiveSlides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            className={
                                "w-2 h-2 rounded-full transition-colors " +
                                (i === currentIndex
                                    ? "bg-white"
                                    : "bg-white/30 hover:bg-white/60")
                            }
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm"
                >
                    ›
                </button>
            </div>
        </div>
    );
};
