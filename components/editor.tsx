import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { StatusBar } from 'expo-status-bar'
import TextEditor from './text-editor'
import Constants from 'expo-constants';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAppContext } from '../lib/appContext';


const Editor = () => {
    const {open, setOpen, saveNote, editItem, setEditItem}= useAppContext()
    const {width}= useWindowDimensions()
    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState("");
    const [baseColor, setBaseColor] = useState<string>("#f6f6f6")
    const OpenStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(open ? 0 :width , { duration: 300 })
                }
            ]
        }
    })
 useEffect(() => {
    if (open == false) {
        setEditItem(null)
    }
  }, [open])
    return (
        <Animated.View style={[styles.container, { backgroundColor: baseColor }, OpenStyle]}>
            {/* <StatusBar style='dark' /> */}

            <TextEditor open={open} editItem={editItem} saveNote={saveNote} setOpen={setOpen} setPlainText={setPlainText} setEditorState={setEditorState} baseColor={baseColor} setBaseColor={setBaseColor} />

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