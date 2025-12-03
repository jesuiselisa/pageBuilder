import type { ElementContent, ElementState } from "../types/state";
import type { ExportElement } from "../types/export";

function buildExportContent(el: ElementState): Record<string, unknown> {
    const content: ElementContent | undefined = el.content;

    if (el.type === "slider") {
        const slides =
            (content?.slides && content.slides.length > 0
                ? content.slides
                : [
                    { label: "Slider 1" },
                    { label: "Slider 2" },
                    { label: "Slider 3" },
                ]) ?? [];

        const mapped: Record<string, { title: string }> = {};
        slides.forEach((slide, index) => {
            mapped[String(index + 1)] = {
                title: slide.label,
            };
        });

        return mapped;
    }

    if (el.type === "card") {
        const title =
            content?.cardTitle && content.cardTitle.trim().length > 0
                ? content.cardTitle
                : "Content Card";
        const text =
            content?.cardDescription &&
                content.cardDescription.trim().length > 0
                ? content.cardDescription
                : "Content description will be placed here…";

        return {
            title,
            text,
        };
    }

    if (el.type === "text-content") {
        return {
            text:
                content?.text && content.text.trim().length > 0
                    ? content.text
                    : "Click to edit this text…",
        };
    }

    return {};
}

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
        content: buildExportContent(el),
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
