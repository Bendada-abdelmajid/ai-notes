import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import { StatusBar } from 'expo-status-bar'
import TextEditor from './text-editor'
import Constants from 'expo-constants';

const Editor = () => {
    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState("");
    const [baseColor, setBaseColor] = useState<string>("#f6f6f6")
    return (
        <View style={[styles.container, { backgroundColor: baseColor }]}>
            <StatusBar style='dark' />

            <TextEditor setPlainText={setPlainText} setEditorState={setEditorState} baseColor={baseColor} setBaseColor={setBaseColor} />

        </View>
    )
}

export default Editor

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,

    },
})

//"#fcebaf"