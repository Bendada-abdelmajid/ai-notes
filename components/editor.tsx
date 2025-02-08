import { Alert, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'

import TextEditor from './text-editor'
import Constants from 'expo-constants';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAppContext } from '../lib/appContext';
import * as Sharing from 'expo-sharing';

import * as FileSystem from 'expo-file-system';
const Editor = () => {
    const [openImageModal, setOpenImageModal] = useState(true);
    const { open, setOpen, saveNote, editItem, setEditItem, activeFilter, folders } = useAppContext()
    const { width } = useWindowDimensions()
    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState("");
    const [baseColor, setBaseColor] = useState<string>("#fff")
    const OpenStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(open ? 0 : width, { duration: 300 })
                }
            ]
        }
    })
    const handleShare = async (image: string) => {
        // Check if sharing is available
        const base64Data = image.split(",")[1];
        const fileUri = `${FileSystem.documentDirectory}screenshot.png`;
        // const imageurl = await FileSystem.downloadAsync(    image, FileSystem.documentDirectory + 'note.png')
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
        });
        if (await Sharing.isAvailableAsync()) {
            try {
                // Share the PDF
                await Sharing.shareAsync(fileUri);
            } catch (error) {
                console.error('Error sharing PDF:', error);
            }
        } else {
            Alert.alert('Sharing is not available on this platform.');
        }
    };


    return (
        <Animated.View style={[styles.container, { backgroundColor: baseColor }, OpenStyle]}>

            <TextEditor dom={{
                scrollEnabled: false,
                overScrollMode: "never",
            }} setOpenImageModal={setOpenImageModal} handleShare={handleShare} open={open} editItem={editItem} setEditItem={setEditItem} saveNote={saveNote} setOpen={setOpen} setPlainText={setPlainText} setEditorState={setEditorState} />

        </Animated.View>
    )
}

export default Editor

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        zIndex: 30,


    },
})

//"#fcebaf"