import React from "react";
import { BaseModal } from "./BaseModal";

type CardEditorModalProps = {
    open: boolean;
    title: string;
    description: string;
    onChangeTitle: (value: string) => void;
    onChangeDescription: (value: string) => void;
    onCancel: () => void;
    onDone: () => void;
};

const MAX_TITLE_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 180;

export const CardEditorModal: React.FC<CardEditorModalProps> = ({
    open,
    title,
    description,
    onChangeTitle,
    onChangeDescription,
    onCancel,
    onDone,
}) => {
    return (
        <BaseModal
            open={open}
            title="Edit Card"
            onCancel={onCancel}
            onDone={onDone}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        className="w-full text-sm rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={title}
                        maxLength={MAX_TITLE_LENGTH}
                        onChange={(e) =>
                            onChangeTitle(
                                e.target.value.slice(0, MAX_TITLE_LENGTH)
                            )
                        }
                    />
                    <p className="mt-1 text-[10px] text-gray-400 text-right">
                        {title.length}/{MAX_TITLE_LENGTH}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Description
                    </label>
                    <textarea
                        className="w-full min-h-[80px] text-sm rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        value={description}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        onChange={(e) =>
                            onChangeDescription(
                                e.target.value.slice(0, MAX_DESCRIPTION_LENGTH)
                            )
                        }
                    />
                    <p className="mt-1 text-[10px] text-gray-400 text-right">
                        {description.length}/{MAX_DESCRIPTION_LENGTH}
                    </p>
                </div>
            </div>
        </BaseModal>
    );
};
