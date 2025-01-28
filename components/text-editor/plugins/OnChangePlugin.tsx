import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { EditorState } from 'lexical'
import { useCallback, useEffect, useState } from 'react'
type Props = {
    setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
    editorState: string | null
}
const  CustomOnChangePlugin = ({ editorState, setEditorState }: Props) => {
    const [editor] = useLexicalComposerContext()
    useEffect(() => {
        try {
            if (editorState) {
             console.log({editorState})
                const initialEditorState = editor.parseEditorState(editorState)
                editor.setEditorState(initialEditorState)
            } 
        } catch (error) {
            console.log("error form CustomOnChangePlugin: ", error)
        }
       
    }, [editorState, editor])

    const onChange = useCallback(
        (editorState: EditorState) => {
            // setEditorState(JSON.stringify(editorState.toJSON()))
        },
        [setEditorState]
    )

    // TODO: add ignoreSelectionChange
    return <OnChangePlugin onChange={onChange}   ignoreHistoryMergeTagChange
    ignoreSelectionChange />
}
export default CustomOnChangePlugin