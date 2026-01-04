import { CodeBlockData } from '../components/Canvas/canvas.types';

export function detectCodeBlocks(content: string): CodeBlockData[] {
    const codeBlockRegex = /```(\w+)?\n([\s\S]+?)```/g;
    const matches = [...content.matchAll(codeBlockRegex)];

    return matches.map((match, index) => {
        const language = (match[1] || 'plaintext').toLowerCase();
        const code = match[2].trim();
        // Generate a consistent ID based on content hash or similar would be better, but index is okay for now
        const id = `code-${index}-${code.substring(0, 10).replace(/\s/g, '')}`;

        // Simple heuristic for preview capability
        const canPreview = ['html', 'javascript', 'typescript', 'jsx', 'tsx', 'css', 'svg'].includes(language);

        return {
            id,
            language,
            code,
            canPreview
        };
    });
}
