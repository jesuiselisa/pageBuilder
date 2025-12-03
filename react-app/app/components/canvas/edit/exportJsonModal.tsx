import React from "react";
import { BaseModal } from "./BaseModal";

type ExportJsonModalProps = {
    open: boolean;
    json: string;
    onClose: () => void;
};

export const ExportJsonModal: React.FC<ExportJsonModalProps> = ({
    open,
    json,
    onClose,
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(json);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <BaseModal
            open={open}
            title="Exported JSON"
            onCancel={onClose}
            showFooter={false}
            panelClassName="max-w-3xl"
        >
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <pre className="w-full max-h-80 overflow-auto rounded-md bg-gray-900 text-[11px] leading-relaxed text-gray-100 p-4">
                        {json}
                    </pre>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

