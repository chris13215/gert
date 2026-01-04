import React from 'react';
import { CodeBlockData } from './canvas.types';
import { formatTimestamp } from '../../utils/codeDetector';

interface CanvasFooterProps {
    block: CodeBlockData;
}

export const CanvasFooter: React.FC<CanvasFooterProps> = ({ block }) => {
    const lineCount = block.lineCount || block.code.split('\n').length;
    const charCount = block.charCount || block.code.length;
    const timestamp = block.timestamp || Date.now();

    return (
        <div className="px-4 py-2 border-t border-white/10 bg-background-surface/50 backdrop-blur-md flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-4">
                <span className="font-semibold text-primary uppercase tracking-wider">
                    {block.language}
                </span>
                <span>
                    {lineCount} {lineCount === 1 ? 'line' : 'lines'}
                </span>
                <span>
                    {charCount.toLocaleString()} {charCount === 1 ? 'char' : 'chars'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="opacity-70">
                    {formatTimestamp(timestamp)}
                </span>
            </div>
        </div>
    );
};
