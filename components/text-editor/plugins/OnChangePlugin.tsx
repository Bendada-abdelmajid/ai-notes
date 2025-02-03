import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { EditorState } from 'lexical'
import { useCallback, useEffect, useState } from 'react'
import { Folder } from '../../../lib/types';
type Props = {
    editorState:string | null | undefined
}
const CustomOnChangePlugin = ({ editorState}: Props) => {
    const [editor] = useLexicalComposerContext()
    useEffect(() => {
        if (!editorState) {
            return; // Skip if editor or editorState is not available
        }

        try {
            const initialEditorState = editor.parseEditorState(editorState);
            editor.setEditorState(initialEditorState);
        } catch (error) {
            console.error("Error in CustomOnChangePlugin: ", error);
            // Optionally, handle the error (e.g., set a fallback state or show a message)
        }
    }, [editorState, editor]); // Ensure editor is stable


    // TODO: add ignoreSelectionChange
    return null
}
export default CustomOnChangePlugin