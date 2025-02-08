import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { EllipsisVertical, Redo, Share2, Undo } from "lucide-react";
import React, { useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import html2canvas from "html2canvas";
type Props = {
    setOpen: (v: boolean) => void;
    handleShare: (pdfUri: string) => Promise<void>
};

const LOW_PRIORIRTY = 1;
const Header = ({ setOpen , handleShare}: Props) => {
    const [editor] = useLexicalComposerContext();
    const [disableMap, setDisableMap] = useState<{
        undo: boolean;
        redo: boolean;
    }>({
        undo: true,
        redo: true,
    });
    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setDisableMap((prevDisableMap) => ({
                        ...prevDisableMap,
                        undo: !payload,
                    }));
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
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
                COMMAND_PRIORITY_CRITICAL
            ),

        );
    }, [editor]);
    const onShare = async () => {
        const pdfUrl = 'https://beq.ebooksgratuits.com/vents/mirbeau-journal.pdf';
        const canvas = await html2canvas(document.getElementById("editor") as HTMLElement);
        const image = canvas.toDataURL("image/png");
        // console.log({image})
        handleShare(image);
        // if (navigator.share) {
        //   navigator.share({
        //     title: 'My Note',
        //     text: 'Check out this note from my app!',
        //     url: pdfUrl,
        //   })
        //   .then(() => console.log('Shared successfully'))
        //   .catch((error) => console.error('Error sharing:', error));
        // } else {
        //   // Fallback for browsers that don't support the Web Share API:
        //   const link = document.createElement('a');
        //   link.href = pdfUrl;
        //   link.download = 'note.pdf';
        //   link.click();
        // }
      };
    return (
        <div className="header">
            <button
                onClick={() => {
                    setOpen(false);
                }}
                className="back-btn"
            >
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 16 16"
                    height="24"
                    width="24"
                >
                    <path
                        fillRule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                    ></path>
                </svg>
            </button>
            <div style={{ display: "flex" }}>
                <button disabled={disableMap.undo} onClick={()=> editor.dispatchCommand(UNDO_COMMAND, undefined)}>
                    <Undo size={20} strokeWidth={1.4} />
                </button>
                <button disabled={disableMap.undo}  onClick={()=> editor.dispatchCommand(REDO_COMMAND, undefined)}>
                    <Redo size={20} strokeWidth={1.4} />
                </button>
            </div>
            <div style={{ display: "flex" }}>
                <button onClick={onShare}>
                    <Share2 size={20} strokeWidth={1.4} />
                </button>
                <button>
                    <EllipsisVertical size={20} strokeWidth={1.4} />
                </button>
            </div>
            {/* <hr /> */}
        </div>
    );
};

export default Header;
