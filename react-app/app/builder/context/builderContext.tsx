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
    updateElementPos: (id: string, pos: { x: number; y: number }) => void;
    bringToFront: (id: string) => void;
    removeElement: (id: string) => void;
};

const BuilderContext = createContext<BuilderContextValue | undefined>(
    undefined
);

let idCounter = 1;

export const BuilderProvider = ({ children }: { children: ReactNode }) => {
    const [elements, setElements] = useState<ElementState[]>([]);

    const addElement = (type: ElementType, pos: { x: number; y: number }) => {
        const id = `elem_${type}_${String(idCounter++).padStart(3, "0")}`;

        setElements(prev => [
            ...prev,
            {
                id,
                type,
                x: pos.x,
                y: pos.y,
                zIndex: prev.length + 1,
            },
        ]);
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

    return (
        <BuilderContext.Provider
            value={{ elements, addElement, updateElementPos, bringToFront, removeElement }}
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