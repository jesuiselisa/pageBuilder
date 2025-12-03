import type { ElementType } from "./common";

export type SliderSlideContent = {
    label: string;
    imageUrl?: string; 
    backgroundClass?: string;
};

export type ElementContent = {
    text?: string;
    cardTitle?: string;
    cardDescription?: string;
    slides?: SliderSlideContent[];
    activeSlideIndex?: number;
};

export type ElementState = {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    zIndex: number;
    sectionId?: string | null;
    order?: number;
    content?: ElementContent;
};
