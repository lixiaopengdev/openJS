import React, { memo, useEffect, useRef, useState } from "react";
import Prism from 'prismjs'
import "prismjs/components/prism-javascript"
import Clipboard from "clipboard";
import { flip } from "ramda";
import { toast } from "react-hot-toast";

interface codeProps {
    codeContent: string,
}

const CodeBlock = (props: codeProps) => {
    const { codeContent } = props;
    const [showCopyButton, setShowCopyButton] = useState(false);
    const [copyName, setCopyName] = useState('copy');

    useEffect(() => {
        Prism.highlightAll();
    }, []);
    const handleMouseEnter = () => setShowCopyButton(true);
    const handleMouseLeave = () => setShowCopyButton(false);

    const copyCode = () => {
        const el = document.createElement('textarea');
        el.value = codeContent.trim();
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopyName('已复制')
        setTimeout(() => {
            setCopyName('copy')
        }, 2000);
    }

    return (
        <div className="relative">
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <pre className={`text-left`}

                >
                    <code
                        className="language-javascript"
                        dangerouslySetInnerHTML={{ __html: codeContent }}
                    />
                </pre>
                {showCopyButton && (<button className="absolute top-0 right-0 z-10 text-white bg-blue-500 py-1 px-3 rounded-md"
                    id="copy-button"
                    onClick={copyCode}
                >
                    {copyName}
                </button>)}
            </div>
        </div>

    );
}
export default CodeBlock;