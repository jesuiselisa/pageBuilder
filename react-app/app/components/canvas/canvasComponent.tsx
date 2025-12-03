import React from "react";
import type { ElementState } from "~/builder/types/state";
import { useBuilder } from "~/builder/context/builderContext";
import { HeaderBlock } from "./layout/HeaderBlock";
import { FooterBlock } from "./layout/FooterBlock";
import { CardBlock } from "./layout/CardBlock";
import { TextContentBlock } from "./layout/TextContentBlock";
import { SliderBlock } from "./layout/SliderBlock";

type CanvasComponentProps = {
    element: ElementState;
};

export const CanvasComponent: React.FC<CanvasComponentProps> = ({ element }) => {
    const { updateElementContent } = useBuilder();

    switch (element.type) {
        case "header":
            return <HeaderBlock />;
        case "footer":
            return <FooterBlock />;
        case "card":
            return (
                <CardBlock
                    title={element.content?.cardTitle ?? "Content Card"}
                    description={
                        element.content?.cardDescription ??
                        "Content description will be placed here…"
                    }
                />
            );
        case "text-content": {
            const raw = element.content?.text;
            const text =
                raw && raw.trim().length > 0
                    ? raw
                    : "Click to edit this text…";
            return <TextContentBlock text={text} />;
        }
        case "slider":
        default:
            return (
                <SliderBlock
                    slides={element.content?.slides}
                    activeIndex={element.content?.activeSlideIndex ?? 0}
                    onActiveIndexChange={(index) =>
                        updateElementContent(element.id, {
                            activeSlideIndex: index,
                        })
                    }
                />
            );
    }
};
