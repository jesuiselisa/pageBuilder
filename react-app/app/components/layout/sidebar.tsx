import type { ElementType } from "~/builder/types/common";
import { ElementDragItem } from "../sidebar/elementDragItem";
import { ButtonComponent } from "../common/buttonComponent";

type PaletteItem = {
    type: ElementType;
    icon: string;
    title: string;
    description: string;
};

const components: PaletteItem[] = [
    {
        type: "header",
        icon: "test",
        title: "Header",
        description: "Page header with navigation",
    },
    {
        type: "slider",
        icon: "test",
        title: "Slider",
        description: "Image slider carousel",
    },
    {
        type: "card",
        icon: "test",
        title: "Card",
        description: "Custom row with 1-3 columns",
    },
    {
        type: "text-content",
        icon: "test",
        title: "Text Content",
        description: "Content cards with text & images",
    },
    {
        type: "footer",
        icon: "test",
        title: "Footer",
        description: "Content cards with text & images",
    },
    
];

export const Sidebar = () => {
    return (
        <aside className="sidebar w-72 bg-gray-900 text-white p-6 overflow-y-auto">
            <h1 className="text-xl mb-6 text-purple-300">Page Builder</h1>
            <ButtonComponent text="New Page" func={()=>{}}/>
            <h2 className="text-xs tracking-wider text-gray-500 mb-4">COMPONENTS</h2>
            <div>
                {components.map((comp) => (
                    <ElementDragItem
                        key={comp.type}
                        icon={comp.icon}
                        title={comp.title}
                        description={comp.description}
                        type={comp.type}
                    />
                ))}
            </div>
        </aside>
    );
};
