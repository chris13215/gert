import { create } from 'zustand';
import { CodeBlockData } from '../components/Canvas/canvas.types';

interface CanvasStore {
    isOpen: boolean;
    activeBlockId: string | null;
    blocks: CodeBlockData[];
    viewMode: 'code' | 'preview';

    openCanvas: () => void;
    closeCanvas: () => void;
    toggleCanvas: () => void;
    setBlocks: (blocks: CodeBlockData[]) => void;
    setActiveBlock: (id: string) => void;
    setViewMode: (mode: 'code' | 'preview') => void;
    addBlocks: (newBlocks: CodeBlockData[]) => void;
}

export const useCanvas = create<CanvasStore>((set) => ({
    isOpen: false,
    activeBlockId: null,
    blocks: [],
    viewMode: 'code',

    openCanvas: () => set({ isOpen: true }),
    closeCanvas: () => set({ isOpen: false }),
    toggleCanvas: () => set((state) => ({ isOpen: !state.isOpen })),

    setBlocks: (blocks) => set({
        blocks,
        activeBlockId: blocks.length > 0 ? blocks[0].id : null
    }),

    setActiveBlock: (activeBlockId) => set({ activeBlockId }),

    setViewMode: (viewMode) => set({ viewMode }),

    addBlocks: (newBlocks) => set((state) => {
        // Merge new blocks avoiding duplicates
        const currentIds = new Set(state.blocks.map(b => b.id));
        const uniqueNewBlocks = newBlocks.filter(b => !currentIds.has(b.id));

        if (uniqueNewBlocks.length === 0) return state;

        return {
            blocks: [...state.blocks, ...uniqueNewBlocks],
            // Auto-select the first new block if it's the only one, or just keep current
            activeBlockId: uniqueNewBlocks[uniqueNewBlocks.length - 1].id,
            isOpen: true
        };
    })
}));
