import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Note } from '../../constante/notes'
import { colors } from '../../constante/colors'
import { formatNumber } from '../../lib/utils'
import { ArrowUpRight } from 'lucide-react-native'


type Props = {
    item: Note,
    index: number
}

const Card = ({ item, index }: Props) => {
    return (
        <View style={styles.card}>
            <View style={styles.border} />
            <Text style={styles.id}>/ {formatNumber(index + 1)}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
            <View style={styles.link}>
                <ArrowUpRight color={colors.gray} size={20} strokeWidth={1.4} />
            </View>
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 40,
        paddingTop: 20,
        width:"100%",
        // backgroundColor:"red"
    },
    border: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        
        height: 1,
        fontSize:14,
        backgroundColor: colors.gray,
        opacity: .7
    },
    id: {
        fontFamily: "Roboto-Light",
        position: "absolute",
        top: 25,
        left: 0,

        color: colors.gray,
        opacity: .5
    },
    link: {
        position: "absolute",
        top: 25,
        right: 3,

        color: colors.gray,
       
    },
    title: {
        fontFamily: "Roboto-Light",
        width: "100%",
    
        fontSize: 24,
        letterSpacing: .5,
        color: colors.gray,
        marginBottom: 10
    },
    desc: {
        fontFamily: "Roboto-Light",
        fontSize: 16,
        opacity: .8,
        color: colors.gray,
    }
})