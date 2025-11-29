import type { ElementType } from "./common";

export type ElementState = {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    zIndex: number;
};