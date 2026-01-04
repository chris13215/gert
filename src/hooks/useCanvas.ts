import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CodeBlockData, Artifact, ArtifactVersion, LayoutMode } from '../components/Canvas/canvas.types';

interface CanvasStore {
    isOpen: boolean;
    activeBlockId: string | null;
    blocks: CodeBlockData[];
    viewMode: 'code' | 'preview';
    layoutMode: LayoutMode;
    artifacts: Artifact[];
    activeArtifactId: string | null;

    openCanvas: () => void;
    closeCanvas: () => void;
    toggleCanvas: () => void;
    setBlocks: (blocks: CodeBlockData[]) => void;
    setActiveBlock: (id: string) => void;
    setViewMode: (mode: 'code' | 'preview') => void;
    setLayoutMode: (mode: LayoutMode) => void;
    addBlocks: (newBlocks: CodeBlockData[]) => void;

    createArtifact: (block: CodeBlockData, messageIndex: number) => string;
    updateArtifact: (artifactId: string, newCode: string, messageIndex: number) => void;
    setActiveArtifact: (id: string | null) => void;
    getArtifact: (id: string) => Artifact | undefined;
    getActiveArtifact: () => Artifact | undefined;
    deleteArtifact: (id: string) => void;
    clearHistory: () => void;
}

const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const createArtifactFromBlock = (block: CodeBlockData, messageIndex: number): Artifact => {
    const artifactId = generateId();
    const versionId = generateId();
    const now = Date.now();

    const version: ArtifactVersion = {
        id: versionId,
        artifactId,
        code: block.code,
        timestamp: now,
        messageIndex,
    };

    return {
        id: artifactId,
        title: block.filename || `${block.language} code`,
        language: block.language,
        filename: block.filename,
        currentVersionId: versionId,
        versions: [version],
        createdAt: now,
        updatedAt: now,
        canPreview: block.canPreview || false,
    };
};

const findSimilarArtifact = (artifacts: Artifact[], block: CodeBlockData): Artifact | undefined => {
    return artifacts.find(artifact => {
        if (block.filename && artifact.filename === block.filename) return true;
        if (artifact.language === block.language && artifact.title === `${block.language} code`) return true;
        return false;
    });
};

export const useCanvas = create<CanvasStore>()(
    persist(
        (set, get) => ({
            isOpen: false,
            activeBlockId: null,
            blocks: [],
            viewMode: 'code',
            layoutMode: 'tabs',
            artifacts: [],
            activeArtifactId: null,

            openCanvas: () => set({ isOpen: true }),
            closeCanvas: () => set({ isOpen: false }),
            toggleCanvas: () => set((state) => ({ isOpen: !state.isOpen })),

            setBlocks: (blocks) => set({
                blocks,
                activeBlockId: blocks.length > 0 ? blocks[0].id : null
            }),

            setActiveBlock: (activeBlockId) => set({ activeBlockId }),

            setViewMode: (viewMode) => set({ viewMode }),

            setLayoutMode: (layoutMode) => set({ layoutMode }),

            addBlocks: (newBlocks) => set((state) => {
                const currentIds = new Set(state.blocks.map(b => b.id));
                const uniqueNewBlocks = newBlocks.filter(b => !currentIds.has(b.id));

                if (uniqueNewBlocks.length === 0) return state;

                return {
                    blocks: [...state.blocks, ...uniqueNewBlocks],
                    activeBlockId: uniqueNewBlocks[uniqueNewBlocks.length - 1].id,
                    isOpen: true
                };
            }),

            createArtifact: (block, messageIndex) => {
                const similarArtifact = findSimilarArtifact(get().artifacts, block);

                if (similarArtifact) {
                    get().updateArtifact(similarArtifact.id, block.code, messageIndex);
                    return similarArtifact.id;
                }

                const newArtifact = createArtifactFromBlock(block, messageIndex);

                set((state) => ({
                    artifacts: [...state.artifacts, newArtifact],
                    activeArtifactId: newArtifact.id
                }));

                return newArtifact.id;
            },

            updateArtifact: (artifactId, newCode, messageIndex) => {
                set((state) => {
                    const artifact = state.artifacts.find(a => a.id === artifactId);
                    if (!artifact) return state;

                    const lastVersion = artifact.versions[artifact.versions.length - 1];
                    if (lastVersion.code === newCode) {
                        return state;
                    }

                    const versionId = generateId();
                    const now = Date.now();

                    const newVersion: ArtifactVersion = {
                        id: versionId,
                        artifactId,
                        code: newCode,
                        timestamp: now,
                        messageIndex,
                    };

                    const updatedArtifact: Artifact = {
                        ...artifact,
                        currentVersionId: versionId,
                        versions: [...artifact.versions, newVersion],
                        updatedAt: now,
                    };

                    return {
                        artifacts: state.artifacts.map(a =>
                            a.id === artifactId ? updatedArtifact : a
                        )
                    };
                });
            },

            setActiveArtifact: (id) => set({ activeArtifactId: id }),

            getArtifact: (id) => {
                return get().artifacts.find(a => a.id === id);
            },

            getActiveArtifact: () => {
                const { activeArtifactId, artifacts } = get();
                if (!activeArtifactId) return undefined;
                return artifacts.find(a => a.id === activeArtifactId);
            },

            deleteArtifact: (id) => {
                set((state) => ({
                    artifacts: state.artifacts.filter(a => a.id !== id),
                    activeArtifactId: state.activeArtifactId === id ? null : state.activeArtifactId
                }));
            },

            clearHistory: () => {
                set({ artifacts: [], activeArtifactId: null });
            }
        }),
        {
            name: 'canvas-storage',
            partialize: (state) => ({
                artifacts: state.artifacts,
                layoutMode: state.layoutMode
            })
        }
    )
);
