import React from "react";

import * as ImagePicker from "expo-image-picker";
import { $insertNodes, LexicalEditor } from "lexical";
import { ImageNode } from "../nodes/image-node";
type Props = {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  editor: LexicalEditor;
};

const UploadImage = ({ isOpen, setOpen, editor }: Props) => {
  const onClose = () => setOpen(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      editor.update(() => {
        const imageNode = new ImageNode(result.assets[0].uri, "imm", 500);
        $insertNodes([imageNode]);
        onClose();
      });
    }
  };
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1,
    });
    console.log({ result });
    if (!result.canceled) {
      editor.update(() => {
        const imageNode = new ImageNode(result.assets[0].uri, "imm", 500);
        $insertNodes([imageNode]);
        onClose();
      });
    }
  };
  return (
    <div className={`image-modal-cont ${isOpen ? "open" : ""}`}>
      <div className="overlay" onClick={onClose} />
      <div className="image-modal">
        <button onClick={takePhoto}>Camera</button>
        <button onClick={pickImage}>Gallery</button>

        <button className="cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UploadImage;


