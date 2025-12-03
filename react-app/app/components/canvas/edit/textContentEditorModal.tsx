import React from "react";
import { BaseModal } from "./BaseModal";

type TextContentEditorModalProps = {
    open: boolean;
    value: string;
    onChange: (value: string) => void;
    onCancel: () => void;
    onDone: () => void;
};

export const TextContentEditorModal: React.FC<TextContentEditorModalProps> = ({
    open,
    value,
    onChange,
    onCancel,
    onDone,
}) => {
    const handleTextareaChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
        e
    ) => {
        onChange(e.target.value);
    };

    return (
        <BaseModal
            open={open}
            title="Edit Text Content"
            onCancel={onCancel}
            onDone={onDone}
        >
            <textarea
                className="w-full min-h-[160px] text-sm rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Start typing your content..."
                value={value}
                onChange={handleTextareaChange}
            />
        </BaseModal>
    );
};
