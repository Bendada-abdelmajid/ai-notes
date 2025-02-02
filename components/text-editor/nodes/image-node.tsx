// import { DecoratorNode, LexicalNode, NodeKey, EditorConfig, DOMConversionMap, DOMConversionOutput, SerializedLexicalNode, Spread } from 'lexical';
// export type SerializedImageNode = Spread<
//   {
//     alt: string;


//     src: string;

//   },
//   SerializedLexicalNode
// >;
// export class ImageNode extends DecoratorNode<JSX.Element> {
//   private src: string;
//   private alt: string;

//   constructor(src: string, alt: string, key?: NodeKey) {
//     super(key);
//     this.src = src;
//     this.alt = alt;
//   }

//   static getType(): string {
//     return 'image';
//   }

//   static clone(node: ImageNode): ImageNode {
//     return new ImageNode(node.src, node.alt, node.__key);
//   }

//   createDOM(_config: EditorConfig): HTMLElement {
//     const img = document.createElement('img');
//     img.src = this.src;
//     img.alt = this.alt || '';
//     return img;
//   }

//   updateDOM(prevNode: ImageNode, dom: HTMLElement): boolean {
//     if (this.src !== prevNode.src) {
//       (dom as HTMLImageElement).src = this.src;
//     }
//     if (this.alt !== prevNode.alt) {
//       (dom as HTMLImageElement).alt = this.alt;
//     }
//     return false;
//   }

//   static importJSON(serializedNode: SerializedImageNode) {
//     return new ImageNode(serializedNode.src, serializedNode.alt);
//   }

//   exportJSON(): { type: string; src: string; alt: string; version: number } {
//     return {
//       type: 'image',
//       src: this.src,
//       alt: this.alt,
//       version: 1,
//     };
//   }

//   static importDOM(): DOMConversionMap | null {
//     return {
//       img: () => ({
//         conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
//           if (domNode instanceof HTMLImageElement) {
//             return { node: new ImageNode(domNode.src, domNode.alt) };
//           }
//           return null;
//         },
//         priority: 0,
//       }),
//     };
//   }

//   decorate(): JSX.Element {
//     return <img src={this.src} alt={this.alt} style={{ maxWidth: '100%' }} />;
//   }
// }


/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,

  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,

  SerializedLexicalNode,
  Spread,
} from 'lexical';
import type { JSX } from 'react';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

type Dimension = number | 'inherit';
const ImageComponent = React.lazy(() => import('./ImageComponent'));

export interface ImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number;

}


function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement;

  const { alt: altText, src, width, height } = img;
  const node = $createImageNode({ altText, height, src, width });
  return { node };
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    maxWidth: number;

    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;


  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src } = serializedNode;
    return $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    }).updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    const node = super.updateFromJSON(serializedNode);
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('width', this.__width.toString());
    element.setAttribute('height', this.__height.toString());
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,

      src: this.getSrc(),
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }


  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }
  getWidth(): Dimension {
    return this.getLatest().__width;
  }

  setWidth(width: Dimension): void {
    const self = this.getWritable();
    self.__width = width;
  }

  getHeight(): Dimension {
    return this.getLatest().__height;
  }

  setHeight(height: Dimension): void {
    const self = this.getWritable();
    self.__height = height;
  }
  decorate(): JSX.Element {
    return (
      <Suspense fallback={<h1>Loading</h1>}>
        <ImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          maxWidth={this.__maxWidth}
          nodeKey={this.getKey()}
          resizable={true}
        />
      </Suspense>
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      altText,
      maxWidth,
      width,
      height,
      key
    ),
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}