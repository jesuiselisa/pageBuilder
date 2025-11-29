export type ElementType = 'header' | 'footer' | 'card' | 'textContent' | 'slider';

export type Position = {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
};

export type BuilderElement = {
    id: string;          
    type: ElementType;
    content: any;        
    position: Position;
};

export type BuilderState = {
    elements: BuilderElement[];
};