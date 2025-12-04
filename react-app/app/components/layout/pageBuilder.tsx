import React, { useState } from "react";
import { exportElementsToJson } from "../../builder/utils/export";
import { useBuilder } from "~/builder/context/builderContext";
import { Sidebar } from "./sidebar";
import { Canvas } from "./canvas";
import { ButtonComponent } from "../common/buttonComponent";
import { ExportJsonModal } from "../canvas/edit/exportJsonModal";

export const PageBuilder: React.FC = () => {
    const { elements } = useBuilder();
    const [exportOpen, setExportOpen] = useState(false);
    const [exportJson, setExportJson] = useState("");

    const handleExport = () => {
        const json = exportElementsToJson(elements);
        setExportJson(json);
        setExportOpen(true);
    };

    return (
        <main className="page-builder flex h-screen overflow-hidden">
            <Sidebar />
            <section className="page-cnt flex-1 flex flex-col justify-between overflow-hidden">
                <Canvas />
                <ButtonComponent text="Export JSON" func={handleExport} classN="export-btn w-full px-4 py-2 mb-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white"/>
            </section>
            <ExportJsonModal
                open={exportOpen}
                json={exportJson}
                onClose={() => setExportOpen(false)}
            />
        </main>
    );
};
