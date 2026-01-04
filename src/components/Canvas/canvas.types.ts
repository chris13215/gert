export type ViewMode = 'code' | 'preview';
export type LayoutMode = 'tabs' | 'stack';

export interface CodeBlockData {
    id: string;
    language: string;
    code: string;
    filename?: string;
    description?: string;
    canPreview?: boolean;
    messageIndex?: number;
    timestamp?: number;
    lineCount?: number;
    charCount?: number;
}

export interface ArtifactVersion {
    id: string;
    artifactId: string;
    code: string;
    timestamp: number;
    messageIndex: number;
    changes?: string;
}

export interface Artifact {
    id: string;
    title: string;
    language: string;
    filename?: string;
    currentVersionId: string;
    versions: ArtifactVersion[];
    createdAt: number;
    updatedAt: number;
    canPreview: boolean;
}

export interface CanvasProps {
    isOpen: boolean;
    onClose: () => void;
    blocks: CodeBlockData[];
    activeBlockId: string | null;
    onBlockSelect: (id: string) => void;
}
