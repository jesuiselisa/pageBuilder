import React from "react";
import { exportElementsToJson } from "../../utils/export";
import { useBuilder } from "~/builder/context/builderContext";
import { Sidebar } from "./sideBar";
import { Canvas } from "./canvas";

export const PageBuilder: React.FC = () => {
    const { elements } = useBuilder();

    const handleExport = () => {
        const json = exportElementsToJson(elements);
        console.log(json);
    };

    return (
        <div>
            <Sidebar />
            <div>
                <div>
                    <button onClick={handleExport}>Export JSON</button>
                </div>
                <Canvas />
            </div>
        </div>
    );
};