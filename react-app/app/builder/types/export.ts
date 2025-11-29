import type { ElementType } from "./common";

export type ExportPosition = {
    x: number | string;
    y: number | string;
    width: number | string;
    height: number | string;
    zIndex: number;
    minHeight?: number;
    fixed?: boolean;
};

export type ExportElement = {
    id: string;
    type: ElementType;
    content: any;
    position: ExportPosition;
    responsive?: any;
};