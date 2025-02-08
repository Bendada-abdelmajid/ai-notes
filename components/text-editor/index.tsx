/// <reference types="react/canary" />
"use dom";
import "./styles.css";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { createEmptyHistoryState, HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListNode, ListItemNode, } from "@lexical/list";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";

import { CodeNode, CodeHighlightNode } from "@lexical/code";
import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { ImageNode } from "./nodes/image-node";

import { $getRoot, CLEAR_EDITOR_COMMAND, CLEAR_HISTORY_COMMAND, EditorState, LexicalEditor, LexicalNode } from "lexical";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ExcalidrawPlugin from "./plugins/ExcalidrawPlugins";
import { ExcalidrawNode } from "./nodes/ExcalidrawNode";
import Title from "./ui/title";

import { Note, SaveNoteProps } from "../../lib/types";

import { $canShowPlaceholderCurry } from "@lexical/text";
import CustomOnChangePlugin from "./plugins/OnChangePlugin";

import Header from "./plugins/header";
import TabelMenu from "./plugins/tabel-menu";
import { WebViewProps } from "react-native-webview";
import html2canvas from "html2canvas";




const placeholder = "Enter some rich text...";


type Props = {
  dom: WebViewProps;

  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveNote: ({ id, title, content, desc }: SaveNoteProps) => void;
  open: boolean;
  editItem: Note | null;
  setEditItem: React.Dispatch<React.SetStateAction<Note | null>>
  setOpenImageModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleShare: (pdfUri: string) => Promise<void>
}
export default function TextEditor({

  setPlainText,
  setOpen,
  saveNote,
  open,
  editItem,
  setEditItem,
  setOpenImageModal,
  handleShare
}: Props) {
  const captureRef = useRef(null);
  const disableContextMenu = (event: { preventDefault: () => void; }) => {

    event.preventDefault(); // Prevents the default context menu
  };
  const [editorState, setEditorState] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [textColor, setTextColor] = useState<string>("#000")

  const [openThemes, setOpenThemes] = useState<boolean>(false)
  const editorConfig = useMemo(() => {
    return {
      editorState: (editor: LexicalEditor) => {
        console.log({ editItem })
        if (editItem?.content) {
          try {
            // Parse the stored content and apply it to the editor
            const parsedState = editor.parseEditorState(editItem.content);
            console.log({ parsedState })
            editor.setEditorState(parsedState);
          } catch (error) {
            console.error("Error parsing editor state:", error);

          }
        } else {
          console.log("empty state:");

        }
      },
      namespace: "React.js Demo",
      nodes: [
        ListNode,
        ListItemNode,
        TableNode, TableCellNode, TableRowNode,
        CodeNode, CodeHighlightNode,
        ImageNode,
        ExcalidrawNode,
      ],
      onError(error: Error) {
        console.log("error for lexicale ", error)
      },
      // The editor theme
      theme: ExampleTheme,
    }

  }, [editItem]);
  useEffect(() => {
    console.log(editItem)
    if (editItem && editItem?.title) {
      setTitle(editItem.title)
    } else {
      setTitle("")
    }
    if (editItem && editItem?.content) {
      console.log(JSON.parse(editItem.content))
      setEditorState(JSON.parse(editItem.content))
    } else {
      setEditorState("")
    }
  }, [editItem])

  const save = (editor: LexicalEditor) => {
    // Check if editor is empty
    const isEmpty = editor.getEditorState().read($canShowPlaceholderCurry(editor.isComposing()));
    if (isEmpty && !(title?.trim())) return;

    // Serialize editor state to JSON
    const editorStateJSON = editor.getEditorState().toJSON();
    const serializedState: string = JSON.stringify(editorStateJSON);

    // Read editor content and set plain text
    editor.update(() => {
      try {
        const root = $getRoot();
        const textContent = root.getTextContent();
        setPlainText(textContent);
        // Simulated database save
        // console.log("Saving to database:", serializedState);
        // console.log("Plain text content:", textContent);
        saveNote({
          id: editItem ? editItem.id : null,
          title,
          content: serializedState,
          desc: textContent,
        });

        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);

        root.clear();

        editor.focus();
        setEditItem(null)
        setEditorState("")
        setTitle("");

      } catch (error) {
        console.error("Error during editor update:", error);
      }
    });
  };



  const handleCapture = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      const image = canvas.toDataURL("image/png");
      

      // Create a download link
      const link = document.createElement("a");
      link.href = image;
      link.download = "screenshot.png";
      link.click();
    }
  };

  return (
    <div id="editor" onContextMenu={disableContextMenu} className="editor-container">
      <hr style={{ marginBottom: "20px" }} />
      <div className="space-between">
        <p className="date">16/11/2024</p>
        <button>#work</button>
      </div>
      <Title title={title} setTitle={setTitle} />

      {/* <span role="textbox" contentEditable  onInput={handleTitle} onChange={handleTitle} value={title} className="title-input" placeholder="Title"></span> */}
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-inner">

          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          {/* <OnChangePlugin
            // onChange={(editorState, editor, tags) => {
            //   console.log(editor._nodes)
            //   debouncedChangeHandler(editorState, editor)

            // }}
            ignoreHistoryMergeTagChange
            ignoreSelectionChange
          /> */}
          {/* <OnChangePlugin onDebouncedChange={handleEditorChange} debounceTime={2000}/> */}
          <CustomOnChangePlugin editorState={editItem?.content} />
          <HistoryPlugin />
          <CheckListPlugin />
          <ListPlugin />
          <ExcalidrawPlugin />
          <AutoFocusPlugin />
          <ClearEditorPlugin />

        </div>
        <Header setOpen={setOpen} handleShare={handleShare} />
        <TabelMenu />
        <ToolbarPlugin setOpenImageModal={setOpenImageModal} save={save} open={open} setOpenThemes={setOpenThemes} setOpen={setOpen} />
      </LexicalComposer>
      {/* <Thems baseColor={baseColor} setBaseColor={setBaseColor} openThemes={openThemes} setOpenThemes={setOpenThemes} /> */}


    </div>
  );
}

