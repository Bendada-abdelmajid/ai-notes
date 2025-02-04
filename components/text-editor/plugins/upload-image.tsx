import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Modal from "../../ui/modal";
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, LayoutAnimationConfig } from "react-native-reanimated";
import * as ImagePicker from 'expo-image-picker';
import { $insertNodes, LexicalEditor } from "lexical";
import { ImageNode } from "../nodes/image-node";
type Props = {
    isOpen: boolean;
    setOpen: (v: boolean) => void;
    editor: LexicalEditor
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const UploadImage = ({ isOpen, setOpen, editor }: Props) => {
    const onClose = () => setOpen(false);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            //   setImg(result.assets[0].uri);
            console.log({ result })
            editor.update(() => {
                const imageNode = new ImageNode(result.assets[0].uri, "imm", 500);
                $insertNodes([imageNode]);
            });
        }
    };
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            aspect: [1, 1],
            allowsEditing: true,
            quality: 1,
        });
        console.log({ result })
        if (!result.canceled) {
     
            editor.update(() => {
                const imageNode = new ImageNode(result.assets[0].uri, "imm", 500);
                $insertNodes([imageNode]);
            });

        }
    };
    return (
        <LayoutAnimationConfig skipEntering>
            {isOpen && (
                <AnimatedPressable
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(300)}
                    onPress={onClose}
                    style={[StyleSheet.absoluteFill, styles.overlay]}
                />
            )}
            {isOpen && (
                <Animated.View
                    entering={FadeInDown.duration(300)}
                    exiting={FadeOutDown.duration(300)}
                    style={styles.modal}
                >
                    <TouchableOpacity onPress={takePhoto} style={styles.btn}>
                        <Text style={styles.textbtn}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} style={styles.btn}>
                        <Text style={styles.textbtn}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={[styles.btn, styles.cancel]}>
                        <Text style={[styles.textbtn, { textAlign: "center" }]}>cancel</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </LayoutAnimationConfig>
    );
};

export default UploadImage;

const styles = StyleSheet.create({
    overlay: {

        position: "absolute",
        top: -0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "#00000030",
        zIndex: 20,
    },
    modal: {
        position: "absolute",
        bottom: 20,
        right: 10,
        left: 10,
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 15,
        borderRadius: 20,
        backgroundColor: "#fff",
        zIndex: 33,

        overflow: "hidden"
    },
    btn: {
        paddingVertical: 7,
        paddingHorizontal: 16,
        marginBottom: 5
    },
    cancel: {
        paddingVertical: 12,
        borderRadius: 50,
        backgroundColor: "#ddd",
        marginTop: 10,
        marginBottom: 0,
    },
    textbtn: {
        fontSize: 16,
        fontFamily: "Roboto-Light",

    }
});
