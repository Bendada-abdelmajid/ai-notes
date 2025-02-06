import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isTableCellNode, TableNode, TableCellNode } from '@lexical/table';
import { $getSelection, $isRangeSelection } from 'lexical';
import React, { useEffect, useState } from 'react'
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";
import { DeleteTableRow, InsertTableColumn, InsertTableRow } from './utils';
type Props = {}
interface MenuPosition {
    top: number;
    left: number;
}

const TabelMenu = (props: Props) => {
    const [menuPosition, setMenuPosition] = useState<number | null>(null);
      const [editeTabel, setEditTable] = useState<TableNode | null>(null);
    const [editor] = useLexicalComposerContext();


    const updateTabel = () => {
        try {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();
            const tableCell = $getNearestNodeOfType(anchorNode, TableCellNode);
            if (!tableCell) {
                setMenuPosition(null);
                setEditTable(null) // Hide menu if not in a table
                return;
            }

            // Get the parent table
            const table = $getNearestNodeOfType(tableCell, TableNode);
            if (!table) return;

            // Get position of the table cell
            const cellDOM = editor.getElementByKey(table.getKey());
            if (!cellDOM) return;
            setEditTable(table)

            const rect = cellDOM.getBoundingClientRect();
            setMenuPosition(rect.bottom + window.scrollY+10);

        } catch (error) {
            console.log("error from updateToolbar: ", error)
        }
    };
    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateTabel();
                });
            }),

        );
    }, [editor]);

    return (
        menuPosition && editeTabel && (
            <div className='table-menu' style={{
            
                top: `${menuPosition}px`,
              
       
            }}>
                <button onClick={() =>  InsertTableColumn(editor, editeTabel)} >Add Column</button>
                <button onClick={() => InsertTableRow(editor, editeTabel)}>Add Row</button>
                <button onClick={() => DeleteTableRow(editor)}>Delete Row</button>
            </div>
        )
    );
}

export default TabelMenu