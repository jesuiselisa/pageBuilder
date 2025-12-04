import { useCallback, useState } from "react";
import type { ElementState } from "~/builder/types/state";

type UpdateElementContentFn = (
    id: string,
    content: Partial<NonNullable<ElementState["content"]>>
) => void;

type UseCanvasEditorsParams = {
    elements: ElementState[];
    removeElement: (id: string) => void;
    updateElementContent: UpdateElementContentFn;
};

export const useCanvasEditors = ({
    elements,
    removeElement,
    updateElementContent,
}: UseCanvasEditorsParams) => {
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [editingTextDraft, setEditingTextDraft] = useState<string>("");
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [editingCardTitle, setEditingCardTitle] = useState<string>("");
    const [editingCardDescription, setEditingCardDescription] = useState<string>("");
    const [editingSliderId, setEditingSliderId] = useState<string | null>(null);

    const handleDeleteClick = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            removeElement(id);
            if (editingTextId === id) {
                setEditingTextId(null);
            }
            if (editingCardId === id) {
                setEditingCardId(null);
            }
            if (editingSliderId === id) {
                setEditingSliderId(null);
            }
        },
        [removeElement, editingTextId, editingCardId, editingSliderId]
    );

    const handleTextEditOpen = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setEditingTextId(id);
            const el = elements.find((item) => item.id === id);
            setEditingTextDraft(el?.content?.text ?? "");
        },
        [elements]
    );

    const handleTextEditCancel = useCallback(() => {
        setEditingTextId(null);
        setEditingTextDraft("");
    }, []);

    const handleTextEditSave = useCallback(() => {
        if (!editingTextId) return;
        updateElementContent(editingTextId, { text: editingTextDraft });
        setEditingTextId(null);
        setEditingTextDraft("");
    }, [editingTextId, editingTextDraft, updateElementContent]);

    const handleTextDraftChange = useCallback((value: string) => {
        setEditingTextDraft(value);
    }, []);

    const handleCardEditOpen = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setEditingCardId(id);
            const el = elements.find((item) => item.id === id);
            setEditingCardTitle(el?.content?.cardTitle ?? "");
            setEditingCardDescription(el?.content?.cardDescription ?? "");
        },
        [elements]
    );

    const handleCardEditCancel = useCallback(() => {
        setEditingCardId(null);
        setEditingCardTitle("");
        setEditingCardDescription("");
    }, []);

    const handleCardEditSave = useCallback(() => {
        if (!editingCardId) return;
        updateElementContent(editingCardId, {
            cardTitle: editingCardTitle,
            cardDescription: editingCardDescription,
        });
        setEditingCardId(null);
        setEditingCardTitle("");
        setEditingCardDescription("");
    }, [
        editingCardId,
        editingCardTitle,
        editingCardDescription,
        updateElementContent,
    ]);

    const handleSliderEditOpen = useCallback(
        (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setEditingSliderId(id);
        },
        []
    );

    const handleSliderEditCancel = useCallback(() => {
        setEditingSliderId(null);
    }, []);

    const handleSliderEditDone = useCallback(
        (slides: { label: string; imageUrl?: string; backgroundClass?: string }[]) => {
            if (!editingSliderId) return;
            updateElementContent(editingSliderId, { slides });
            setEditingSliderId(null);
        },
        [editingSliderId, updateElementContent]
    );

    return {
        editingTextId,
        editingTextDraft,
        editingCardId,
        editingCardTitle,
        editingCardDescription,
        editingSliderId,
        setEditingCardTitle,
        setEditingCardDescription,
        handleDeleteClick,
        handleTextEditOpen,
        handleTextEditCancel,
        handleTextEditSave,
        handleTextDraftChange,
        handleCardEditOpen,
        handleCardEditCancel,
        handleCardEditSave,
        handleSliderEditOpen,
        handleSliderEditCancel,
        handleSliderEditDone,
    };
};


