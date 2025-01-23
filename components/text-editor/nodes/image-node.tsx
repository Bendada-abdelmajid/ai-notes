import { DecoratorNode, LexicalNode, NodeKey, EditorConfig, DOMConversionMap, DOMConversionOutput, SerializedLexicalNode, Spread } from 'lexical';
export type SerializedImageNode = Spread<
  {
    alt: string;
  
  
    src: string;

  },
  SerializedLexicalNode
>;
export class ImageNode extends DecoratorNode<JSX.Element> {
  private src: string;
  private alt: string;

  constructor(src: string, alt: string, key?: NodeKey) {
    super(key);
    this.src = src;
    this.alt = alt;
  }

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.src, node.alt, node.__key);
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const img = document.createElement('img');
    img.src = this.src;
    img.alt = this.alt || '';
    return img;
  }

  updateDOM(prevNode: ImageNode, dom: HTMLElement): boolean {
    if (this.src !== prevNode.src) {
      (dom as HTMLImageElement).src = this.src;
    }
    if (this.alt !== prevNode.alt) {
      (dom as HTMLImageElement).alt = this.alt;
    }
    return false;
  }

  static importJSON(serializedNode: SerializedImageNode) {
    return new ImageNode(serializedNode.src, serializedNode.alt);
  }

  exportJSON(): { type: string; src: string; alt: string; version: number } {
    return {
      type: 'image',
      src: this.src,
      alt: this.alt,
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
          if (domNode instanceof HTMLImageElement) {
            return { node: new ImageNode(domNode.src, domNode.alt) };
          }
          return null;
        },
        priority: 0,
      }),
    };
  }

  decorate(): JSX.Element {
    return <img src={this.src} alt={this.alt} style={{ maxWidth: '100%' }} />;
  }
}
