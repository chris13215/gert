export type ViewMode = 'code' | 'preview';

export interface CodeBlockData {
    id: string;
    language: string;
    code: string;
    filename?: string;
    description?: string;
    canPreview?: boolean;
}

export interface CanvasProps {
    isOpen: boolean;
    onClose: () => void;
    blocks: CodeBlockData[];
    activeBlockId: string | null;
    onBlockSelect: (id: string) => void;
}
