import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import html from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';

// Register languages
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);

interface CodeBlockProps {
    code: string;
    language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const normalizedLang = language.toLowerCase();
    const lang = normalizedLang === 'react' ? 'tsx' : normalizedLang;

    return (
        <div className="h-full overflow-hidden text-sm relative">
            <SyntaxHighlighter
                language={lang}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    height: '100%',
                    background: 'transparent', // Let parent control bg
                    fontSize: '13px',
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineHeight: '1.6',
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                    minWidth: '3em',
                    paddingRight: '1em',
                    color: 'rgba(255,255,255,0.2)',
                    textAlign: 'right',
                    userSelect: 'none'
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};
