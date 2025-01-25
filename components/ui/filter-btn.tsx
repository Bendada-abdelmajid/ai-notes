import { Dimensions, Pressable, StyleSheet, Text } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '../../constante/colors'
import Animated, { Extrapolation, interpolate, interpolateColor, LinearTransition, SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'


type Props = {
    item: string;
    index: number;
    active: string;
    setActive: React.Dispatch<React.SetStateAction<string>>;
    scrollOffset: SharedValue<number>
}
const { width } = Dimensions.get("window")

const spacing = 30;
const IMG_HEIGHT = width * .5  ;
const AnimatedButton = Animated.createAnimatedComponent(Pressable)


const FilterBtn = ({ item, setActive, active, scrollOffset }: Props) => {
    const activevalue = useSharedValue(0)
    useEffect(() => {
        activevalue.value = withSpring(active == item ? 1 : 0, { damping: 10 })

    }, [active])
    const animtedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                activevalue.value,
                [0, 1],
                [colors.black, colors.orange]
            ),
            borderColor: interpolateColor(
                activevalue.value,
                [0, 0.5, 1],
                [colors.gray, colors.orange, colors.orange]
            ),
            paddingHorizontal:interpolate(
                scrollOffset.value,
                [IMG_HEIGHT, IMG_HEIGHT +spacing],
                [16, 14],
                Extrapolation.CLAMP
            ),
            paddingVertical: interpolate(
                scrollOffset.value,
                [IMG_HEIGHT, IMG_HEIGHT +spacing],
                [7, 5],
                Extrapolation.CLAMP
            ),
        }
    })
    const animtedTextStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                activevalue.value,
                [0, 1],
                [colors.gray, "#000000"]
            ),
            // fontWeight: `${interpolate(
            //     activevalue.value,
            //     [0, 1],
            //     [400, 500],
            //     Extrapolation.CLAMP
            // )}`,
            fontSize: interpolate(
                scrollOffset.value,
                [IMG_HEIGHT, IMG_HEIGHT +spacing],
                [23, 15],
                Extrapolation.CLAMP
            ),
           
        }
    })
    return (
        <AnimatedButton  style={[styles.btn, animtedStyle]} onPress={() => setActive(item)}>
            <Animated.Text style={[styles.text, animtedTextStyle]}>#{item}</Animated.Text>
        </AnimatedButton>
    )
}

export default FilterBtn

const styles = StyleSheet.create({
    btn: {
       
        borderRadius: 30,
        borderWidth: 1

    },
    text: {
        fontFamily: "Roboto-Light",
        // fontSize: 23,
        letterSpacing: .5,

    }
})