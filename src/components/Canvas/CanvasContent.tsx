import React from 'react';
import { CodeBlock } from './CodeBlock';
import { PreviewFrame } from './PreviewFrame';
import { CodeBlockData, ViewMode } from './canvas.types';

interface CanvasContentProps {
    block: CodeBlockData;
    mode: ViewMode;
}

export const CanvasContent: React.FC<CanvasContentProps> = ({ block, mode }) => {
    return (
        <div className="flex-1 overflow-hidden relative h-full">
            {mode === 'code' ? (
                <CodeBlock code={block.code} language={block.language} />
            ) : (
                <PreviewFrame code={block.code} language={block.language} />
            )}
        </div>
    );
};
