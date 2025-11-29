import React from "react";
import { exportElementsToJson } from "../../builder/utils/export";
import { useBuilder } from "~/builder/context/builderContext";
import { Sidebar } from "./sidebar";
import { Canvas } from "./canvas";
import { ButtonComponent } from "../common/buttonComponent";

export const PageBuilder: React.FC = () => {
    const { elements } = useBuilder();

    const handleExport = () => {
        const json = exportElementsToJson(elements);
        console.log(json);
    };

    return (
        <main className="page-builder flex">
            <Sidebar />
            <section className="page-cnt flex-1 flex flex-col content-between">
                <Canvas />
                <ButtonComponent text="Export JSON" func={handleExport}/>
            </section>
        </main>
    );
};