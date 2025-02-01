import "../styles.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isTabNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  HeadingTagType,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";
import {
  $isCodeNode,
  getDefaultCodeLanguage,
  registerCodeHighlighting,
} from "@lexical/code";
import { $isListNode, ListNode } from "@lexical/list";
import {
  $isTableRowNode,
  $isTableCellNode,
  $isTableNode,
  TableNode,
} from "@lexical/table";

import {
  AArrowDown,
  AArrowUp,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  ChevronLeft,
  Code,
  EllipsisVertical,
  Highlighter,
  Image,
  Italic,
  List,
  ListOrdered,
  Minus,
  Palette,
  Pen,
  Plus,
  Redo,
  SquareCheck,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Type,
  Underline,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AddCode,
  AddTable,
  DeleteTableRow,
  formatBulletList,
  formatCheckList,
  formatNumberedList,
  formatText,
  InsertTableColumn,
  InsertTableRow,
  MAX_ALLOWED_FONT_SIZE,
  updateFontSize,
  UpdateFontSizeType,
} from "./utils";
import {
  $getSelectionStyleValueForProperty
} from '@lexical/selection';
import React from "react";
import { ImageNode } from "../nodes/image-node";
import { Excalidraw } from "@excalidraw/excalidraw";
import { INSERT_EXCALIDRAW_COMMAND } from "./ExcalidrawPlugins";


const LOW_PRIORIRTY = 1;
type Props = {
  setOpenThemes: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  save: (editor: LexicalEditor) => void;
  open: boolean
}
export default function ToolbarPlugin({ setOpenThemes, setOpen, save, open }: Props) {
  const [editor] = useLexicalComposerContext();
  const [editeTabel, setEditTable] = useState<{
    show: boolean;
    tabel: TableNode | null;
  }>({ show: false, tabel: null });
  const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
    undo: true,
    redo: true,
  });
  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
    {}
  );

  const [blockType, setBlockType] = useState("paragraph");
  const [codeLanguage, setCodeLanguage] = useState(getDefaultCodeLanguage());
  const [selectedElementKey, setSelectedElementKey] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openTextFormat, setOpenTextFormat] = useState(false);
  const [selectionFontSize, setSelectionFontSize] = useState("15px");
  const updateToolbar = () => {
    try {


      const selection = $getSelection();


      if ($isRangeSelection(selection)) {

        const anchorNode = selection.anchor.getNode();
        if (!anchorNode) return
        const parentBlock = anchorNode.getTopLevelElement();
        if (!parentBlock) return
        const alignment: string = parentBlock.getFormatType() ? parentBlock.getFormatType() : parentBlock.getDirection() == "ltr" ? "left" : "right";
        const newSelectionMap = {
          "bold": selection.hasFormat("bold"),
          "italic": selection.hasFormat("italic"),
          "underline": selection.hasFormat("underline"),
          "strikethrough": selection.hasFormat("strikethrough"),
          "superscript": selection.hasFormat("superscript"),
          "subscript": selection.hasFormat("subscript"),
          "highlight": selection.hasFormat("highlight"),
          "center": alignment == "center",
          "left": alignment == "left",
          "right": alignment == "right",
        };
        setSelectionMap(newSelectionMap);
        setSelectionFontSize($getSelectionStyleValueForProperty(selection, "font-size", "15px"))
        const element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();

        setSelectedElementKey(elementKey);
        const elementDOM = editor.getElementByKey(elementKey);
        if (!elementDOM) return;
        if ($isTableCellNode(element.getParent())) {
          const parentTable = $getNearestNodeOfType(anchorNode, TableNode);
          setEditTable({
            show: $isTableCellNode(element.getParent()),
            tabel: parentTable,
          });
        } else {
          setEditTable({ show: false, tabel: null });
          if ($isListNode(element)) {
            const parentList = $getNearestNodeOfType(anchorNode, ListNode);

            const type = parentList
              ? parentList.getListType()
              : element.getListType();

            setBlockType(type);
          } else {
            const type = $isHeadingNode(element)
              ? element.getTag()
              : element.getType();
            setBlockType(type);
            if ($isCodeNode(element)) {
              setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
            }
          }
        }
      }
    } catch (error) {
      console.log("error from updateToolbar: ", error)
    }
  };

  useEffect(() => {
    registerCodeHighlighting(editor);
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payload) => {
          updateToolbar();
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            undo: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            redo: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor]);
  const addExcalidraw = () => {
    editor.dispatchCommand(
      INSERT_EXCALIDRAW_COMMAND,
      undefined,
    );

  }
  const Insertcommandes = [
    {
      name: "checkList",
      Icon: SquareCheck,
      onClick: () => formatCheckList(editor, blockType),
    },
    {
      name: "list",
      Icon: List,
      onClick: () => formatBulletList(editor, blockType),
    },
    {
      name: "orderList",
      Icon: ListOrdered,
      onClick: () => formatNumberedList(editor, blockType),
    },
    { name: "image", Icon: Image, onClick: () => setOpenImageModal(true) },
    { name: "draw", Icon: Pen, onClick: addExcalidraw },
    { name: "table", Icon: Table, onClick: () => AddTable(editor) },
    { name: "code", Icon: Code, onClick: () => AddCode(editor) },

  ];

  useEffect(() => {
    if (open == false) {
      save(editor)
    }
  }, [open])

  return (
    <>
      <div className="header">
        <button onClick={() => { setOpen(false) }} className="back-btn">
          <ArrowLeft size={20} strokeWidth={1.4} />

        </button>
        <div style={{ display: "flex" }}>
          <button >
            <Undo size={20} strokeWidth={1.4} />
          </button>
          <button >
            <Redo size={20} strokeWidth={1.4} />
          </button>
        </div>
        <div style={{ display: "flex" }}>
          <button onClick={() => setOpenThemes(true)}>
            <Palette size={20} strokeWidth={1.4} />
          </button>
          <button >
            <EllipsisVertical size={20} strokeWidth={1.4} />
          </button>
        </div>
      </div>
      <div className={`edit-tabel-btns ${editeTabel.show ? "show" : ""}`}>
        <button onClick={() => editeTabel.tabel && InsertTableColumn(editor, editeTabel.tabel)}>
          Add Columne
        </button>
        <span />
        <button onClick={() => editeTabel.tabel && InsertTableRow(editor, editeTabel.tabel)}>
          Add Row
        </button>
        <span />
        <button onClick={() => DeleteTableRow(editor)}>Delete Row</button>
      </div>
      <div className={`toolbar  ${openTextFormat ? "show-text-format" : ""} `}>



        <>
          <div className={`menu`}>
            <div className="format-menu">
              {Insertcommandes.map(({ Icon, name, onClick }) => (
                <button key={name} className="toolbar-item" onClick={onClick}>
                  <Icon size={24} strokeWidth={1.4} />
                </button>
              ))}
            </div>


            <TextFormatMenu editor={editor} selctions={selectionMap} selectionFontSize={selectionFontSize} />
          </div>
          <div className="nav-btns">
            <button className={openTextFormat ? "" : "active"} onClick={()=> setOpenTextFormat(false)}>Insert</button>
            <button  className={openTextFormat ?"active" :""} onClick={()=> setOpenTextFormat(true)}>text</button>
          </div>

        </>



      </div>
      {/* <ImageModal
        openImageModal={openImageModal}
        setOpenImageModal={setOpenImageModal}
      /> */}
    </>
  );
}

type ImageModalProps = {
  setOpenImageModal: React.Dispatch<React.SetStateAction<boolean>>;
  openImageModal: boolean;
};
const TextFormatMenu = ({ editor, selctions, selectionFontSize }: { editor: LexicalEditor, selctions: { [id: string]: boolean }, selectionFontSize: string }) => {

  const commandes = [
    {
      name: "highlight",
      Icon: Highlighter,
    },
    {
      name: "bold",
      Icon: Bold,
    },
    {
      name: "italic",
      Icon: Italic,
    },
    {
      name: "underline",
      Icon: Underline,
    },
    { name: "strikethrough", Icon: Strikethrough },
    { name: "superscript", Icon: Superscript },
    { name: "subscript", Icon: Subscript },
    { name: "left", Icon: AlignLeft },
    { name: "center", Icon: AlignCenter },
    { name: "right", Icon: AlignRight },
  ];
  return (
    <div className="text-format-menu">
      <button className={`toolbar-item `} type="button"
        disabled={selectionFontSize !== '' &&
          Number(selectionFontSize.slice(0, -2)) >= MAX_ALLOWED_FONT_SIZE
        }
        onClick={() => updateFontSize(editor, UpdateFontSizeType.increment)}>
        {/* A
        <Plus size={14} color={"#"} /> */}
        <AArrowUp  size={24} strokeWidth={1.4} color={"#000"}/>
      </button>
      <button className={`toolbar-item  `} type="button"
        disabled={selectionFontSize !== '' &&
          Number(selectionFontSize.slice(0, -2)) >= MAX_ALLOWED_FONT_SIZE
        }
        onClick={() => updateFontSize(editor, UpdateFontSizeType.decrement)}>
        {/* A
        <Minus size={14} color={"#000"} /> */}
        <AArrowDown  size={24} strokeWidth={1.4} color={"#000"}/>
      </button>
      {
        commandes.map(({ Icon, name }) => (
          <button key={name} className={`toolbar-item ${selctions[name] ? "active" : ""} `} onClick={() => formatText(editor, name)}>
            <Icon  size={24} strokeWidth={1.4} color={selctions[name] ? "orange" : "#000"} />
          </button>
        ))
      }
    </div >
  );
};

const ImageModal = ({ openImageModal, setOpenImageModal }: ImageModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const close = () => {
    setOpenImageModal(false);
  };
  const [editor] = useLexicalComposerContext();
  // const insertImage = (editor: LexicalEditor, src: string, alt: string): void => {
  //   editor.update(() => {
  //     const imageNode = new ImageNode(src, alt);
  //     editor.insertNode(imageNode);
  //   });
  // };
  const onAddImage = (file: File) => {
    if (!file) return;
    const src = URL.createObjectURL(file);
    console.log({ file });
    editor.update(() => {
      const imageNode = new ImageNode(src, "imm");
      $insertNodes([imageNode]);
    });
    // // editor.update(() => {
    // //   console.log("hi")
    //   const node = $createImageNode({ src, altText: "Dummy text" });
    //   console.log({node})
    //   $insertNodes([node]);
    // });
    // setFile(undefined);

    close();
  };
  return (
    <div className={`image-modal-cont ${openImageModal ? "open" : ""}`}>
      <div className="overlay" onClick={close} />
      <div className="image-modal">
        <button>Camera</button>
        <button onClick={() => inputRef?.current?.click()}>Gallery</button>
        <input
          ref={inputRef}
          accept="image/*"
          onChange={(e) => {
            console.log("files:", e.target.files[0]);
            const file = e.target.files?.[0];
            if (file) {
              onAddImage(file);
            }
            // e.target.files = null;
          }}
          type="file"
        />
        <button className="cancel" onClick={close}>
          Cancel
        </button>
      </div>
    </div>
  );
};
