import React, { useEffect, useState } from 'react';
import { CanvasHeader } from './CanvasHeader';
import { CanvasContent } from './CanvasContent';
import { CanvasFooter } from './CanvasFooter';
import { useCanvas } from '../../hooks/useCanvas';
import { CodeBlockData, ViewMode } from './canvas.types';

interface CanvasProps {
    blocks: CodeBlockData[];
    onClose: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({ blocks, onClose }) => {
    const {
        isOpen,
        activeBlockId,
        setActiveBlock,
        viewMode,
        setViewMode,
        layoutMode,
    } = useCanvas();

    const [isAnimating, setIsAnimating] = useState(false);
    const [activeMode, setActiveMode] = useState<ViewMode>('code');

    useEffect(() => {
        setActiveMode(viewMode);
    }, [viewMode]);

    useEffect(() => {
        if (blocks.length > 0 && !activeBlockId) {
            setActiveBlock(blocks[0].id);
        }
    }, [blocks, activeBlockId, setActiveBlock]);

    const activeBlock = blocks.find(b => b.id === activeBlockId) || blocks[0];

    const handleModeChange = (mode: ViewMode) => {
        setActiveMode(mode);
        setViewMode(mode);
    };

    const handleTabClick = (blockId: string) => {
        setActiveBlock(blockId);
    };

    if (!isOpen || !activeBlock) return null;

    const canvasWidth =
        typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' :
        typeof window !== 'undefined' && window.innerWidth < 1024 ? '50%' : '40%';

    return (
        <>
            <div
                className="canvas-overlay animate-fade-in"
                onClick={onClose}
            />
            <div
                className="canvas-container animate-slide-in"
                style={{ width: canvasWidth }}
            >
                {layoutMode === 'tabs' && blocks.length > 1 && (
                    <div className="flex items-center gap-1 px-4 py-2 bg-background-surface/30 border-b border-white/5 overflow-x-auto">
                        {blocks.map((block, index) => (
                            <button
                                key={block.id}
                                onClick={() => handleTabClick(block.id)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                                    block.id === activeBlockId
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {block.filename || `${block.language} ${index + 1}`}
                            </button>
                        ))}
                    </div>
                )}

                <CanvasHeader
                    block={activeBlock}
                    activeMode={activeMode}
                    onModeChange={handleModeChange}
                    onClose={onClose}
                />

                {layoutMode === 'stack' ? (
                    <div className="flex-1 overflow-y-auto">
                        {blocks.map((block) => (
                            <div key={block.id} className="border-b border-white/10 last:border-0">
                                <div className="sticky top-0 z-10 bg-background-panel/90 backdrop-blur-sm px-4 py-2 border-b border-white/5">
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                        {block.language}
                                    </span>
                                    {block.filename && (
                                        <span className="text-xs text-text-secondary ml-2">
                                            {block.filename}
                                        </span>
                                    )}
                                </div>
                                <div className="min-h-[300px]">
                                    <CanvasContent block={block} mode={activeMode} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <CanvasContent block={activeBlock} mode={activeMode} />
                )}

                <CanvasFooter block={activeBlock} />
            </div>
        </>
    );
};
