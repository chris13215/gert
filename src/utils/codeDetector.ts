import { CodeBlockData } from '../components/Canvas/canvas.types';

interface CodeBlockScore {
    block: CodeBlockData;
    score: number;
    isMajor: boolean;
}

const extractFilename = (code: string, language: string): string | undefined => {
    const patterns = [
        /(?:\/\/|#|<!--)\s*(?:filename|file):\s*([^\s\n]+)/i,
        /(?:\/\/|#|<!--)\s*@file\s+([^\s\n]+)/i,
        /(?:\/\/|#|<!--)\s*([^\s\n]+\.[a-z]{2,5})\s*$/mi,
    ];

    for (const pattern of patterns) {
        const match = code.match(pattern);
        if (match?.[1]) {
            return match[1].trim();
        }
    }

    const firstLine = code.split('\n')[0].trim();
    if (firstLine.match(/^[a-zA-Z0-9_-]+\.[a-z]{2,5}$/)) {
        return firstLine;
    }

    return undefined;
};

const hasFileStructure = (code: string, language: string): boolean => {
    const structurePatterns = {
        javascript: [/\bimport\s+/i, /\bexport\s+/i, /\bfunction\s+\w+/i, /\bclass\s+\w+/i],
        typescript: [/\bimport\s+/i, /\bexport\s+/i, /\binterface\s+\w+/i, /\btype\s+\w+/i, /\bclass\s+\w+/i],
        jsx: [/\bimport\s+.*from/i, /\bexport\s+/i, /\breturn\s*\(/i, /^function\s+[A-Z]/m],
        tsx: [/\bimport\s+.*from/i, /\bexport\s+/i, /\binterface\s+/i, /^function\s+[A-Z]/m],
        react: [/\bimport\s+.*from/i, /\bexport\s+/i, /\breturn\s*\(/i, /^function\s+[A-Z]/m],
        python: [/\bdef\s+\w+/i, /\bclass\s+\w+/i, /\bimport\s+/i, /\bfrom\s+.*\s+import/i],
        java: [/\bpublic\s+class/i, /\bprivate\s+/i, /\bprotected\s+/i, /\bpackage\s+/i],
        cpp: [/\b#include\b/i, /\bclass\s+\w+/i, /\bnamespace\s+/i, /\bint\s+main/i],
        c: [/\b#include\b/i, /\bint\s+main/i, /\bstruct\s+/i],
        go: [/\bpackage\s+/i, /\bfunc\s+/i, /\bimport\s+/i, /\btype\s+/i],
        rust: [/\bfn\s+/i, /\bstruct\s+/i, /\bimpl\s+/i, /\buse\s+/i],
        php: [/\bfunction\s+/i, /\bclass\s+/i, /\bnamespace\s+/i, /\<\?php/i],
        html: [/<html/i, /<head/i, /<body/i, /<!DOCTYPE/i],
        css: [/\{[\s\S]*\}/m, /@media/i, /@import/i],
        pinescript: [/\/\/@version/i, /\bindicator\(/i, /\bstrategy\(/i, /\bplot\(/i],
        mql4: [/\bint\s+OnInit\(/i, /\bvoid\s+OnDeinit\(/i, /\bdouble\s+OnTester\(/i],
        mql5: [/\bint\s+OnInit\(/i, /\bvoid\s+OnDeinit\(/i, /\bvoid\s+OnTick\(/i],
    };

    const lang = language.toLowerCase();
    const patterns = structurePatterns[lang as keyof typeof structurePatterns] || [];

    let matchCount = 0;
    for (const pattern of patterns) {
        if (pattern.test(code)) {
            matchCount++;
        }
    }

    return matchCount >= Math.min(2, patterns.length);
};

const calculateBlockScore = (code: string, language: string, filename?: string): number => {
    let score = 0;

    const lines = code.split('\n');
    const lineCount = lines.length;
    const charCount = code.length;

    if (lineCount >= 30) score += 40;
    else if (lineCount >= 20) score += 30;
    else if (lineCount >= 10) score += 15;
    else if (lineCount >= 5) score += 5;

    if (charCount >= 1500) score += 30;
    else if (charCount >= 800) score += 20;
    else if (charCount >= 400) score += 10;

    if (filename) {
        score += 25;
    }

    if (hasFileStructure(code, language)) {
        score += 30;
    }

    const complexityIndicators = [
        /\bif\s*\(/gi,
        /\bfor\s*\(/gi,
        /\bwhile\s*\(/gi,
        /\bswitch\s*\(/gi,
        /\bfunction\s+\w+/gi,
        /\bclass\s+\w+/gi,
        /\bconst\s+\w+\s*=/gi,
        /\blet\s+\w+\s*=/gi,
    ];

    let complexityCount = 0;
    for (const pattern of complexityIndicators) {
        const matches = code.match(pattern);
        if (matches) {
            complexityCount += matches.length;
        }
    }

    if (complexityCount >= 10) score += 20;
    else if (complexityCount >= 5) score += 10;
    else if (complexityCount >= 2) score += 5;

    return score;
};

export function detectCodeBlocks(content: string, messageIndex?: number): CodeBlockData[] {
    const codeBlockRegex = /```(\w+)?\n([\s\S]+?)```/g;
    const matches = [...content.matchAll(codeBlockRegex)];

    return matches.map((match, index) => {
        const language = (match[1] || 'plaintext').toLowerCase();
        const code = match[2].trim();
        const filename = extractFilename(code, language);

        const id = `code-${Date.now()}-${index}-${code.substring(0, 10).replace(/\s/g, '')}`;

        const canPreview = ['html', 'javascript', 'typescript', 'jsx', 'tsx', 'css', 'svg', 'js', 'ts', 'react'].includes(language);

        const lines = code.split('\n');
        const lineCount = lines.length;
        const charCount = code.length;

        return {
            id,
            language,
            code,
            filename,
            canPreview,
            messageIndex,
            timestamp: Date.now(),
            lineCount,
            charCount,
        };
    });
}

export function filterMajorBlocks(blocks: CodeBlockData[], maxBlocks: number = 3): CodeBlockData[] {
    const scoredBlocks: CodeBlockScore[] = blocks.map(block => {
        const score = calculateBlockScore(block.code, block.language, block.filename);
        const isMajor = score >= 50 || (block.lineCount && block.lineCount >= 15) || !!block.filename;

        return {
            block,
            score,
            isMajor
        };
    });

    const majorBlocks = scoredBlocks
        .filter(sb => sb.isMajor)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxBlocks)
        .map(sb => sb.block);

    return majorBlocks;
}

export function isMajorBlock(block: CodeBlockData): boolean {
    const score = calculateBlockScore(block.code, block.language, block.filename);
    return score >= 50 || (block.lineCount && block.lineCount >= 15) || !!block.filename;
}

export function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}
