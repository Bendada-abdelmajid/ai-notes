/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export default  {
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  image: "editor-image",
  link: "editor-link",
  list: {
    checklist: 'PlaygroundEditorTheme__checklist',
    listitem: 'PlaygroundEditorTheme__listItem',
    listitemChecked: 'PlaygroundEditorTheme__listItemChecked',
    listitemUnchecked: 'PlaygroundEditorTheme__listItemUnchecked',
    nested: {
      listitem: 'PlaygroundEditorTheme__nestedListItem',
    },
    olDepth: [
      'PlaygroundEditorTheme__ol1',
      'PlaygroundEditorTheme__ol2',
      'PlaygroundEditorTheme__ol3',
      'PlaygroundEditorTheme__ol4',
      'PlaygroundEditorTheme__ol5',
    ],
    ul: 'PlaygroundEditorTheme__ul',
  },
  ltr: "ltr",
  paragraph: "editor-paragraph",
  placeholder: "editor-placeholder",
  quote: "editor-quote",
  rtl: "rtl",
  text: {
    bold: "editor-text-bold",
    code: "editor-text-code",
    hashtag: "editor-text-hashtag",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    strikethrough: "editor-text-strikethrough",
    underline: "editor-text-underline",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
  },
  table: 'PlaygroundEditorTheme__table',
  tableCell: 'PlaygroundEditorTheme__tableCell',
  tableCellActionButton: 'PlaygroundEditorTheme__tableCellActionButton',
  tableCellActionButtonContainer:
    'PlaygroundEditorTheme__tableCellActionButtonContainer',
  tableCellHeader: 'PlaygroundEditorTheme__tableCellHeader',
  tableCellResizer: 'PlaygroundEditorTheme__tableCellResizer',
  tableCellSelected: 'PlaygroundEditorTheme__tableCellSelected',
  tableRowStriping: 'PlaygroundEditorTheme__tableRowStriping',
  tableScrollableWrapper: 'PlaygroundEditorTheme__tableScrollableWrapper',
  tableSelected: 'PlaygroundEditorTheme__tableSelected',
  tableSelection: 'PlaygroundEditorTheme__tableSelection',

  code: "editorCode",
  codeHighlight: {
    atrule: "editorTokenAttr",
    attr: "editorTokenAttr",
    boolean: "editorTokenProperty",
    builtin: "editorTokenSelector",
    cdata: "editorTokenComment",
    char: "editorTokenSelector",
    class: "editorTokenFunction", // class constructor
    comment: "editorTokenComment", // comment
    constant: "editorTokenProperty",
    deleted: "editorTokenProperty",
    doctype: "editorTokenComment",
    entity: "editorTokenOperator",
    function: "editorTokenFunction", // es5 function
    important: "editorTokenVariable",
    inserted: "editorTokenSelector",
    keyword: "editorTokenAttr", // variable keyword like const/let
    namespace: "editorTokenVariable",
    number: "editorTokenProperty", // number values
    operator: "editorTokenOperator", // operator like +/*-
    prolog: "editorTokenComment",
    property: "editorTokenProperty",
    punctuation: "editorTokenPunctuation", // brackets of array, object
    regex: "editorTokenVariable",
    selector: "editorTokenSelector",
    string: "editorTokenSelector", // string values
    symbol: "editorTokenProperty",
    tag: "editorTokenProperty",
    url: "editorTokenOperator",
    variable: "editorTokenVariable",
  },
};
