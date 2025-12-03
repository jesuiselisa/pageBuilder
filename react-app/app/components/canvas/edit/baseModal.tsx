import React from "react";
import { IconButtonComponent } from "~/components/common/iconButtonComponent";

type BaseModalProps = {
    open: boolean;
    title?: string;
    onCancel: () => void;
    onDone?: () => void;
    children: React.ReactNode;
    showFooter?: boolean;
    cancelLabel?: string;
    doneLabel?: string;
    panelClassName?: string;
};

export const BaseModal: React.FC<BaseModalProps> = ({
    open,
    title,
    onCancel,
    onDone,
    children,
    showFooter = true,
    cancelLabel = "Cancel",
    doneLabel = "Done",
    panelClassName = "max-w-lg",
}) => {
    if (!open) return null;

    const handleBackdropClick = () => {
        onCancel();
    };

    const handleInnerClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/40"
            onClick={handleBackdropClick}
        >
            <div
                className={`w-full ${panelClassName} rounded-xl bg-white shadow-lg p-6 relative`}
                onClick={handleInnerClick}
            >
                <IconButtonComponent
                    onClick={onCancel}
                    ariaLabel="Close"
                    className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600"
                >
                    ×
                </IconButtonComponent>

                {title && (
                    <h3 className="text-sm font-semibold mb-3">
                        {title}
                    </h3>
                )}

                {children}

                {showFooter && (
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        >
                            {cancelLabel}
                        </button>
                        {onDone && (
                            <button
                                type="button"
                                onClick={onDone}
                                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {doneLabel}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

