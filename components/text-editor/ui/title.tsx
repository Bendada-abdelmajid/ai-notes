import React, { useRef, useState } from "react";

type Props = {
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    title:string;
}

const Title = ({ setTitle, title}: Props) => {


    const handleTitle = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setTitle(e.currentTarget.value);
    };
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "30px"; // Reset height to initial value
            textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to fit content
        }
    };

    return (
        <textarea className="title-input"
            ref={textareaRef}
            rows={1}
            value={title}
            onChange={handleTitle}
            placeholder="Title"
            onInput={handleInput}

        />
    );
};





export default Title