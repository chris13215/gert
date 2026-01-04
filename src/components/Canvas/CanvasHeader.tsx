import React from 'react';
import { X, Copy, Code2, Eye, Check } from 'lucide-react';
import { CodeBlockData, ViewMode } from './canvas.types';

interface CanvasHeaderProps {
    block: CodeBlockData;
    activeMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    onClose: () => void;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
    block,
    activeMode,
    onModeChange,
    onClose
}) => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(block.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-background-panel/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/20">
                    <Code2 size={18} />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-text-main">
                        {block.filename || 'Generated Code'}
                    </h3>
                    <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-1.5 rounded-sm w-fit mt-0.5">
                        {block.language}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {block.canPreview && (
                    <div className="flex bg-background-surface rounded-lg p-1 mr-2 border border-white/5">
                        <button
                            onClick={() => onModeChange('code')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${activeMode === 'code'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Code2 size={14} />
                            Code
                        </button>
                        <button
                            onClick={() => onModeChange('preview')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${activeMode === 'preview'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Eye size={14} />
                            Preview
                        </button>
                    </div>
                )}

                <div className="h-6 w-px bg-white/10 mx-1" />

                <button
                    onClick={copyToClipboard}
                    className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors relative group"
                    title="Copy Code"
                >
                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>

                <button
                    onClick={onClose}
                    className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};
