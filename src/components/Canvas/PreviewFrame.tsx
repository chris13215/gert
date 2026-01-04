import React, { useEffect, useRef } from 'react';

interface PreviewFrameProps {
    code: string;
    language: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ code, language }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();

                let content = '';
                const lowerLang = language.toLowerCase();

                if (lowerLang === 'html') {
                    content = code;
                } else if (lowerLang === 'javascript' || lowerLang === 'js') {
                    content = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <script src="https://cdn.tailwindcss.com"></script>
                    </head>
                    <body class="bg-white min-h-screen p-4">
                        <div id="app"></div>
                        <script>
                            try {
                                ${code}
                            } catch (e) {
                                document.body.innerHTML = '<pre style="color:red; font-family:monospace">' + e.toString() + '</pre>';
                            }
                        </script>
                    </body>
                </html>
             `;
                } else if (lowerLang === 'react' || lowerLang === 'tsx' || lowerLang === 'jsx' || lowerLang === 'typescript') {
                    // React Support via Babel standalone
                    // Fix simple imports (remove them for standalone)
                    const cleanedCode = code
                        .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
                        .replace(/export\s+default\s+function/g, 'function')
                        .replace(/export\s+default\s+class/g, 'class')
                        .replace(/export\s+const/g, 'const')
                        .replace(/export\s+function/g, 'function');

                    content = `
                <!DOCTYPE html>
                <html>
                <head>
                    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { background-color: #0F1014; color: white; }
                        ::-webkit-scrollbar { width: 8px; height: 8px; }
                        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <div id="root"></div>
                    <script type="text/babel">
                        try {
                            ${cleanedCode}
                            
                            // Try to find the component to render
                            // 1. Check for 'App'
                            // 2. Check for 'Example'
                            // 3. Fallback to finding the last defined function/class
                            
                            let ComponentToRender = null;
                            if (typeof App !== 'undefined') ComponentToRender = App;
                            else if (typeof Example !== 'undefined') ComponentToRender = Example;
                            else if (typeof Demo !== 'undefined') ComponentToRender = Demo;
                            
                            if (ComponentToRender) {
                                const root = ReactDOM.createRoot(document.getElementById('root'));
                                root.render(<ComponentToRender />);
                            } else {
                                console.log('No component found to render. Make sure your component is named App, Example, or Demo.');
                            }
                        } catch (err) {
                            document.getElementById('root').innerHTML = '<div style="color:#ef4444; padding:20px; font-family:monospace; background:rgba(239,68,68,0.1); border-radius:8px"><strong>Runtime Error:</strong><br/>' + err.message + '</div>';
                            console.error(err);
                        }
                    </script>
                </body>
                </html>
             `;
                }

                doc.write(content);
                doc.close();
            }
        }
    }, [code, language]);

    return (
        <div className="h-full w-full bg-[#0F1014]">
            <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-popups allow-modals allow-forms allow-same-origin"
            />
        </div>
    );
};
