import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
} from "lexical";
import { $wrapNodes } from "@lexical/selection";
import { $createCodeNode } from "@lexical/code";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $isAtNodeEnd } from "@lexical/selection";
import { ElementNode, RangeSelection, TextNode } from "lexical";
import {
  $createTableNodeWithDimensions,
  $deleteTableRow__EXPERIMENTAL,
  $insertTableColumn__EXPERIMENTAL,
  $insertTableRow__EXPERIMENTAL,
  TableNode,
} from "@lexical/table";
import { $insertNodeToNearestRoot } from "@lexical/utils";

export const formatCheckList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== "check") {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};
export const formatBulletList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== "bullet") {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatNumberedList = (
  editor: LexicalEditor,
  blockType: string
) => {
  if (blockType !== "number") {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode());
    }
  });
};

export const AddCode = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $wrapNodes(selection, () => $createCodeNode("javascript"));
    }
  });
};
export const AddTable = (editor: LexicalEditor) => {
  editor.update(() => {
    const tableNode = $createTableNodeWithDimensions(1, 2, true);
    $insertNodeToNearestRoot(tableNode);
  });
};
export const InsertTableRow = (
  editor: LexicalEditor,
  parentTable: TableNode
) => {
  try {
    editor.update(() => {
      parentTable.selectEnd();
      $insertTableRow__EXPERIMENTAL(true);
    });
  } catch (error) {
    console.log(error);
  }
};
export const DeleteTableRow = (editor: LexicalEditor) => {
  try {
    editor.update(() => {
      $deleteTableRow__EXPERIMENTAL();
    });
  } catch (error) {
    console.log(error);
  }
};
export const InsertTableColumn = (
  editor: LexicalEditor,
  parentTable: TableNode
) => {
  try {
    editor.update(() => {
      parentTable.selectEnd();
      $insertTableColumn__EXPERIMENTAL(true);
    });
  } catch (error) {
    console.log(error);
  }
};

export const formatText = (editor: LexicalEditor, id: string) => {
  switch (id) {
    case "bold": {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      break;
    }
    case "italic": {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
      break;
    }
    case "underline": {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
      break;
    }
    case "strikethrough": {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
      break;
    }
    case "superscript": {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
      break;
    }
    case "subscript": {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
      break;
    }
    case "highlight": {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
      break;
    }

    case "left": {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
      break;
    }
    case "right": {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
      break;
    }
    case "center": {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
      break;
    }
  }
};

export enum UpdateFontSizeType {
  increment = 1,
  decrement,
}

export const calculateNextFontSize = (
  currentFontSize: number,
  updateType: UpdateFontSizeType | null
) => {
  if (!updateType) {
    return currentFontSize;
  }

  let updatedFontSize: number = currentFontSize;
  switch (updateType) {
    case UpdateFontSizeType.decrement:
      switch (true) {
        case currentFontSize > MAX_ALLOWED_FONT_SIZE:
          updatedFontSize = MAX_ALLOWED_FONT_SIZE;
          break;
        case currentFontSize >= 48:
          updatedFontSize -= 12;
          break;
        case currentFontSize >= 24:
          updatedFontSize -= 4;
          break;
        case currentFontSize >= 14:
          updatedFontSize -= 2;
          break;
        case currentFontSize >= 9:
          updatedFontSize -= 1;
          break;
        default:
          updatedFontSize = MIN_ALLOWED_FONT_SIZE;
          break;
      }
      break;

    case UpdateFontSizeType.increment:
      switch (true) {
        case currentFontSize < MIN_ALLOWED_FONT_SIZE:
          updatedFontSize = MIN_ALLOWED_FONT_SIZE;
          break;
        case currentFontSize < 12:
          updatedFontSize += 1;
          break;
        case currentFontSize < 20:
          updatedFontSize += 2;
          break;
        case currentFontSize < 36:
          updatedFontSize += 4;
          break;
        case currentFontSize <= 60:
          updatedFontSize += 12;
          break;
        default:
          updatedFontSize = MAX_ALLOWED_FONT_SIZE;
          break;
      }
      break;

    default:
      break;
  }
  return updatedFontSize;
};

export const MIN_ALLOWED_FONT_SIZE = 8;
export const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 16;
export const updateFontSizeInSelection = (
  editor: LexicalEditor,
  newFontSize: string | null,
  updateType: UpdateFontSizeType | null
) => {
  const getNextFontSize = (prevFontSize: string | null): string => {
    if (!prevFontSize) {
      prevFontSize = `${DEFAULT_FONT_SIZE}px`;
    }
    prevFontSize = prevFontSize.slice(0, -2);
    const nextFontSize = calculateNextFontSize(
      Number(prevFontSize),
      updateType
    );
    return `${nextFontSize}px`;
  };

  editor.update(() => {
    if (editor.isEditable()) {
      const selection = $getSelection();
      if (selection !== null) {
        $patchStyleText(selection, {
          "font-size": newFontSize || getNextFontSize,
        });
      }
    }
  });
};

export const updateFontSize = (
  editor: LexicalEditor,
  updateType: UpdateFontSizeType
) => {
  // if (inputValue !== '') {
  //   const nextFontSize = calculateNextFontSize(Number(inputValue), updateType);
  //   updateFontSizeInSelection(editor, String(nextFontSize) + 'px', null);

  updateFontSizeInSelection(editor, null, updateType);
};
