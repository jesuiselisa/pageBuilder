import {
    createContext,
    useContext,
    useState,
} from "react";
import type { ReactNode } from "react";
import type { ElementType } from "../types/common";
import type { ElementState } from "../types/state";

type BuilderContextValue = {
    elements: ElementState[];
    addElement: (type: ElementType, pos: { x: number; y: number }) => void;
    clearElements: () => void;
    updateElementPos: (id: string, pos: { x: number; y: number }) => void;
    bringToFront: (id: string) => void;
    removeElement: (id: string) => void;
    reorderElement: (id: string, targetIndex: number) => void;
    updateElementContent: (
        id: string,
        content: Partial<NonNullable<ElementState["content"]>>
    ) => void;
};

const BuilderContext = createContext<BuilderContextValue | undefined>(
    undefined
);

let idCounter = 1;

export const BuilderProvider = ({ children }: { children: ReactNode }) => {
    const [elements, setElements] = useState<ElementState[]>([]);

    const addElement = (type: ElementType, pos: { x: number; y: number }) => {
        const id = `elem_${type}_${String(idCounter++).padStart(3, "0")}`;

        setElements(prev => {
            const baseElements = [...prev];
            let next: ElementState[];

            if (type === "header") {
                const withoutHeader = baseElements.filter(el => el.type !== "header");
                const headerElement: ElementState = {
                    id,
                    type,
                    x: 0,
                    y: 0,
                    zIndex: withoutHeader.length + 1,
                    sectionId: "header",
                };

                next = [headerElement, ...withoutHeader];
            } else if (type === "footer") {
                const withoutFooter = baseElements.filter(el => el.type !== "footer");
                const footerElement: ElementState = {
                    id,
                    type,
                    x: 0,
                    y: 0,
                    zIndex: withoutFooter.length + 1,
                    sectionId: "footer",
                };

                next = [...withoutFooter, footerElement];
            } else {
                const footer = baseElements.find(el => el.type === "footer");
                const withoutFooter = baseElements.filter(el => el.type !== "footer");

                const newElement: ElementState = {
                    id,
                    type,
                    x: pos.x,
                    y: pos.y,
                    zIndex: withoutFooter.length + 1,
                    sectionId: "root",
                };

                if (footer) {
                    const withoutFooterAndNew = withoutFooter.filter(el => el.id !== footer.id);
                    next = [...withoutFooterAndNew, newElement, footer];
                } else {
                    next = [...withoutFooter, newElement];
                }
            }

            return next.map((el, index) => ({
                ...el,
                sectionId: el.sectionId ?? (el.type === "header" ? "header" : el.type === "footer" ? "footer" : "root"),
                order: index,
                zIndex: index + 1,
            }));
        });
    };

    const clearElements = () => {
        idCounter = 1;
        setElements([]);
    };

    const updateElementPos = (id: string, pos: { x: number; y: number }) => {
        setElements(prev =>
            prev.map(el =>
                el.id === id ? { ...el, x: pos.x, y: pos.y } : el
            )
        );
    };

    const bringToFront = (id: string) => {
        setElements(prev => {
            const maxZ = prev.length ? Math.max(...prev.map(e => e.zIndex)) : 0;
            return prev.map(el =>
                el.id === id ? { ...el, zIndex: maxZ + 1 } : el
            );
        });
    };

    const removeElement = (id: string) => {
        setElements(prev => prev.filter(el => el.id !== id));
    };

    const reorderElement = (id: string, targetIndex: number) => {
        setElements(prev => {
            const header = prev.find(el => el.type === "header");
            const footer = prev.find(el => el.type === "footer");
            const content = prev.filter(
                el => el.type !== "header" && el.type !== "footer"
            );

            const fromIndex = content.findIndex(el => el.id === id);
            if (fromIndex === -1) return prev;

            const clampedTarget = Math.max(0, Math.min(targetIndex, content.length - 1));

            if (fromIndex === clampedTarget) return prev;

            const updated = [...content];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(clampedTarget, 0, moved);

            let next: ElementState[] = [];

            if (header) {
                next.push(header);
            }

            next = next.concat(updated);

            if (footer) {
                next.push(footer);
            }

            return next.map((el, index) => ({
                ...el,
                sectionId:
                    el.sectionId ??
                    (el.type === "header"
                        ? "header"
                        : el.type === "footer"
                        ? "footer"
                        : "root"),
                order: index,
                zIndex: index + 1,
            }));
        });
    };

    const updateElementContent: BuilderContextValue["updateElementContent"] = (
        id,
        content
    ) => {
        setElements(prev =>
            prev.map(el =>
                el.id === id
                    ? {
                          ...el,
                          content: {
                              ...(el.content ?? {}),
                              ...content,
                          },
                      }
                    : el
            )
        );
    };

    return (
        <BuilderContext.Provider
            value={{
                elements,
                addElement,
                clearElements,
                updateElementPos,
                bringToFront,
                removeElement,
                reorderElement,
                updateElementContent,
            }}
        >
            {children}
        </BuilderContext.Provider>
    );
};

export const useBuilder = () => {
    const cnt = useContext(BuilderContext);
    if (!cnt) throw new Error("useBuilder must be used inside BuilderProvider");
    return cnt;
};
