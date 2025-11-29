import type { ElementState } from "../types/state";
import type { ExportElement } from "../types/export";

export function mapStateToExportElement(el: ElementState): ExportElement {
    const defaultsByType = {
        header: { width: "100%", height: 80 },
        footer: { width: "100%", height: 60 },
        card: { width: 300, height: 200 },
        "text-content": { width: "auto", height: "auto" },
        slider: { width: "100%", height: 400 },
    } as const;

    const size = defaultsByType[el.type];

    return {
        id: el.id,
        type: el.type,
        content: {},
        position: {
            x: el.x,
            y: el.y,
            width: size.width,
            height: size.height,
            zIndex: el.zIndex,
            ...(size as any),
        },
        responsive: {},
    };
}

export function exportElementsToJson(elements: ElementState[]): string {
    const exportArray = elements.map(mapStateToExportElement);
    return JSON.stringify(exportArray, null, 2);
}