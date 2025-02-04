import { StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'

import TextEditor from './text-editor'
import Constants from 'expo-constants';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAppContext } from '../lib/appContext';



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


    return (
        <Animated.View style={[styles.container, { backgroundColor: baseColor }, OpenStyle]}>

            <TextEditor dom={{
                scrollEnabled: false,
            }} setOpenImageModal={setOpenImageModal} open={open} editItem={editItem} setEditItem={setEditItem} saveNote={saveNote} setOpen={setOpen} setPlainText={setPlainText} setEditorState={setEditorState} baseColor={baseColor} setBaseColor={setBaseColor} />

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