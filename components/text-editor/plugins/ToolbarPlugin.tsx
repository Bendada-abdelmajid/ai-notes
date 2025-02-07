import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";

import {
  $isCodeNode,
  getDefaultCodeLanguage,
  registerCodeHighlighting,
} from "@lexical/code";
import { $isListNode, ListNode } from "@lexical/list";

import {
  AArrowDown,
  AArrowUp,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Camera,
  Code,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  LucideIcon,
  Pencil,
  Plus,
  SquareCheck,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Underline,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AddCode,
  AddTable,
  formatBulletList,
  formatCheckList,
  formatNumberedList,
  formatText,
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE,
  updateFontSize,
  UpdateFontSizeType,
} from "./utils";
import { $getSelectionStyleValueForProperty } from "@lexical/selection";
import React from "react";

import { INSERT_EXCALIDRAW_COMMAND } from "./ExcalidrawPlugins";
import UploadImage from "./upload-image";

const LOW_PRIORIRTY = 1;
type Props = {
  setOpenThemes: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  save: (editor: LexicalEditor) => void;
  open: boolean;
  setOpenImageModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ToolbarPlugin({ save, open }: Props) {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [editor] = useLexicalComposerContext();
  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [blockType, setBlockType] = useState("paragraph");
  const [codeLanguage, setCodeLanguage] = useState(getDefaultCodeLanguage());
  const [selectedElementKey, setSelectedElementKey] = useState("");
  const [openTextFormat, setOpenTextFormat] = useState(false);
  const [selectionFontSize, setSelectionFontSize] = useState("15px");

  const updateToolbar = () => {
    try {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        if (!anchorNode) return;
        const parentBlock = anchorNode.getTopLevelElement();
        if (!parentBlock) return;
        const alignment: string = parentBlock.getFormatType()
          ? parentBlock.getFormatType()
          : parentBlock.getDirection() == "ltr"
          ? "left"
          : "right";
        const newSelectionMap = {
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          underline: selection.hasFormat("underline"),
          strikethrough: selection.hasFormat("strikethrough"),
          superscript: selection.hasFormat("superscript"),
          subscript: selection.hasFormat("subscript"),
          highlight: selection.hasFormat("highlight"),
          center: alignment == "center",
          left: alignment == "left",
          right: alignment == "right",
        };
        setSelectionMap(newSelectionMap);
        setSelectionFontSize(
          $getSelectionStyleValueForProperty(selection, "font-size", "15px")
        );
        const element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();

        // setSelectedElementKey(elementKey);
        const elementDOM = editor.getElementByKey(elementKey);
        if (!elementDOM) return;

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
          // if ($isCodeNode(element)) {
          //   setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          // }
        }
      }
    } catch (error) {
      console.log("error from updateToolbar: ", error);
    }
  };

  useEffect(() => {
    registerCodeHighlighting(editor);
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
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
      )
    );
  }, [editor]);

  const addExcalidraw = () => {
    editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
  };
  useEffect(() => {
    if (open == false) {
      save(editor);
    }
  }, [open]);

  const handleToggleTextFormat = () => {
    editor.focus();
    setOpenTextFormat((prev) => !prev);
    setShowMore(false);
  };
  const Insertcommandes = [
    { name: "draw", Icon: Pencil, onClick: addExcalidraw },
    { name: "image", Icon: Camera, onClick: () => setOpenImageModal(true) },
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

    { name: "table", Icon: Table, onClick: () => AddTable(editor) },
    { name: "code", Icon: Code, onClick: () => AddCode(editor) },
  ];

  type Command = {
    name: string;
    Icon: LucideIcon;
    onClick: () => void;
    disabled?: boolean;
  };

  const commandes: Command[] = useMemo(() => {
    const getFontSizeNumber = (fontSize: string) => {
      const size = Number(fontSize.replace("px", "").trim());
      return isNaN(size) ? 15 : size;
    };

    const textCommandes = [
      {
        name: "increment-fontSize",
        Icon: AArrowUp,
        onClick: () => updateFontSize(editor, UpdateFontSizeType.increment),
        disabled: getFontSizeNumber(selectionFontSize) >= MAX_ALLOWED_FONT_SIZE,
      },
      {
        name: "decrement-fontSize",
        Icon: AArrowDown,
        onClick: () => updateFontSize(editor, UpdateFontSizeType.decrement),
        disabled: getFontSizeNumber(selectionFontSize) <= MIN_ALLOWED_FONT_SIZE,
      },
      {
        name: "highlight",
        Icon: Highlighter,
        onClick: () => formatText(editor, "highlight"),
      },
      { name: "bold", Icon: Bold, onClick: () => formatText(editor, "bold") },
      {
        name: "italic",
        Icon: Italic,
        onClick: () => formatText(editor, "italic"),
      },
      {
        name: "underline",
        Icon: Underline,
        onClick: () => formatText(editor, "underline"),
      },
      {
        name: "strikethrough",
        Icon: Strikethrough,
        onClick: () => formatText(editor, "strikethrough"),
      },
      {
        name: "superscript",
        Icon: Superscript,
        onClick: () => formatText(editor, "superscript"),
      },
      {
        name: "subscript",
        Icon: Subscript,
        onClick: () => formatText(editor, "subscript"),
      },
      {
        name: "left",
        Icon: AlignLeft,
        onClick: () => formatText(editor, "left"),
      },
      {
        name: "center",
        Icon: AlignCenter,
        onClick: () => formatText(editor, "center"),
      },
      {
        name: "right",
        Icon: AlignRight,
        onClick: () => formatText(editor, "right"),
      },
    ];

    return openTextFormat
      ? textCommandes
      : showMore
      ? Insertcommandes
      : Insertcommandes.slice(0, 2);
  }, [openTextFormat, showMore, selectionFontSize]);

  return (
    <>
      <div
        style={{ opacity: isEditable ? 1 : 0.4 }}
        className={`toolbar ${
          openTextFormat ? "show-text-format expand" : ""
        } ${showMore ? "show-more expand" : ""} `}
      >
        <div className={`menu`}>
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className={`toolbar-item more`}
          >
            <Plus size={30} strokeWidth={1.5} color="#fff" />
          </button>
          {commandes.map(({ Icon, name, onClick, disabled }) => (
            <button
              key={name}
              className="toolbar-item"
              disabled={disabled}
              onClick={onClick}
            >
              {disabled ? "hj" : ""}
              <Icon
                size={24}
                strokeWidth={1.5}
                color={selectionMap[name] ? "orange" : "#000"}
              />
            </button>
          ))}
          <button
            onClick={handleToggleTextFormat}
            className={`t-button toolbar-item ${
              openTextFormat ? "clicked" : ""
            }`}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className="t-shape"
                id="x"
                d="M 7 7 L 17 17 M 17 7 L 7 17"
              />
              <path className="t-shape" id="t" d="M 6 6 H 18 M 12 6 V 18" />
            </svg>
          </button>
        </div>
      </div>
      <UploadImage
        isOpen={openImageModal}
        setOpen={setOpenImageModal}
        editor={editor}
      />
    </>
  );
}
