import React, { useEffect, useState, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';

export function FloatingMenu() {
    const [editor] = useLexicalComposerContext();
    const [menuStyle, setMenuStyle] = useState<{ display: string; top: number; left: number }>({
        display: 'none',
        top: 0,
        left: 0,
    });
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateMenuPosition = () => {
            // Get the current selection from Lexical.
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // Use the native browser selection to compute the range's bounding rectangle.
                const nativeSelection = window.getSelection();
                if (nativeSelection && nativeSelection.rangeCount > 0) {
                    const range = nativeSelection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    // Only show the menu if the selection has width/height.
                    if (rect.width && rect.height) {
                        setMenuStyle({
                            display: 'block',
                            // Adjust these offsets as needed.
                            top: rect.top + window.scrollY - 50,
                            left: rect.left + window.scrollX,
                        });
                        return;
                    }
                }
            }
            // Hide the menu if no proper range selection is detected.
            setMenuStyle(prev => ({ ...prev, display: 'none' }));
        };

        // Register a Lexical update listener to reposition the menu on editor updates.
        const unregister = editor.registerUpdateListener(() => {
            updateMenuPosition();
        });

        // Also update on window resize and scroll.
        window.addEventListener('resize', updateMenuPosition);
        window.addEventListener('scroll', updateMenuPosition);

        return () => {
            unregister();
            window.removeEventListener('resize', updateMenuPosition);
            window.removeEventListener('scroll', updateMenuPosition);
        };
    }, [editor]);

    // Example command dispatchers for Bold and Italic.
    const handleBoldClick = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    };

    const handleItalicClick = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
    };

    return (
        <div
            ref={menuRef}
            style={{
                position: 'absolute',
                ...menuStyle,
                zIndex: 1000,
                background: '#fff',
                border: '1px solid #ddd',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <button onClick={handleBoldClick}>Bold</button>
            <button onClick={handleItalicClick}>Italic</button>
        </div>
    );
}
