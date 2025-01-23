/// <reference types="react/canary" />
"use dom";
import "./styles.css";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListNode, ListItemNode, } from "@lexical/list";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { LexicalContextMenuPlugin } from "@lexical/react/LexicalContextMenuPlugin";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { ImageNode } from "./nodes/image-node";

import { $getRoot, EditorState, LexicalEditor, LexicalNode } from "lexical";
import React, { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import ExcalidrawPlugin from "./plugins/ExcalidrawPlugins";
import { ExcalidrawNode } from "./nodes/ExcalidrawNode";
import Title from "./ui/title";



const placeholder = "Enter some rich text...";

const editorConfig = {
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
    throw error;
  },
  // The editor theme
  theme: ExampleTheme,
};
type Props = {
  baseColor?: string;
  setBaseColor: React.Dispatch<React.SetStateAction<string>>;
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
}
export default function TextEditor({
  baseColor,
  setBaseColor,
  setPlainText,
  setEditorState,
}: Props) {
  const disableContextMenu = (event: { preventDefault: () => void; }) => {
    event.preventDefault(); // Prevents the default context menu
  };
  const [selectedText, setSelectedText] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>("#00")
  const [openThemes, setOpenThemes] = useState<boolean>(false)



  return (
    <div onContextMenu={disableContextMenu} style={{ "--primary": baseColor, "--scondary": textColor }} className="editor-container">
      <div className="space-between">
        <p className="date">16/11/2024</p>
        <button>#work</button>
      </div>
      <Title />

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
          <OnChangePlugin
            onChange={(editorState, editor, tags) => {
              editorState.read(() => {
                const root = $getRoot();
                const textContent = root.getTextContent();
                setPlainText(textContent);
              });
              setEditorState(JSON.stringify(editorState.toJSON()));
            }}
            ignoreHistoryMergeTagChange
            ignoreSelectionChange
          />
          <HistoryPlugin />
          <CheckListPlugin />
          <ListPlugin />
          <ExcalidrawPlugin />
          <AutoFocusPlugin />


        </div>


        <ToolbarPlugin setOpenThemes={setOpenThemes} />
      </LexicalComposer>
      {/* <Thems baseColor={baseColor} setBaseColor={setBaseColor} openThemes={openThemes} setOpenThemes={setOpenThemes} /> */}


    </div>
  );
}

