import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../constante/colors'
import { Plus, Search } from 'lucide-react-native'
import FilterBtn from './ui/filter-btn'
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar'
import { notes } from '../constante/notes'
import Card from './ui/card'
import Animated, { Extrapolation, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated'
type Props = {}
const filters = ["all", "personal", "work", "home", "study"]
const { width } = Dimensions.get("window")
const IMG_HEIGHT = width * .5;
const HEADER_HEIGHT = 60;
const spacing = 30;
const Home = (props: Props) => {

    const [active, setActive] = useState("")
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollOffset.value,
                [-IMG_HEIGHT, 0, IMG_HEIGHT ],
                [1, 1, 0],
                Extrapolation.CLAMP
            ),
            // transform: [
            //     {
            //         translateY: interpolate(
            //             scrollOffset.value,
            //             [-IMG_HEIGHT, 0, IMG_HEIGHT],
            //             [-IMG_HEIGHT / 2, 0, IMG_HEIGHT*.2]
            //         )
            //     },

            // ]
        };
    });
    // const shadowAnimatedStyle = useAnimatedStyle(() => {
    //     return {
    //         opacity: interpolate(
    //             scrollOffset.value,
    //             [-IMG_HEIGHT, 0, IMG_HEIGHT ],
    //             [0, 0, 1],
    //             Extrapolation.CLAMP
    //         ),
    //         // width: interpolate(
    //         //     scrollOffset.value,
    //         //     [-IMG_HEIGHT, 0, IMG_HEIGHT ],
    //         //     [0, 0, width-40],
    //         //     Extrapolation.CLAMP
    //         // ),
    //         // transform: [
    //         //     {
    //         //         translateY: interpolate(
    //         //             scrollOffset.value,
    //         //             [-IMG_HEIGHT, 0, IMG_HEIGHT],
    //         //             [-IMG_HEIGHT / 2, 0, IMG_HEIGHT*.2]
    //         //         )
    //         //     },

    //         // ]
    //     };
    // });
    return (
        <View style={styles.container}>
            <View style={{flex:1}}>
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Search size={18} color={"#fff"} />
                    <TextInput placeholderTextColor={"#eee"} style={styles.searchInput} placeholder='Search for your Notes' />
                </View>
                <Pressable style={styles.addBtn}>
                    <Plus size={25} strokeWidth={1.4} color={"#fff"} />
                </Pressable>
                <View style={styles.borderBottom} />
            </View>
            {/* hero */}
          
            <StatusBar style='light' />
            <Animated.ScrollView style={{paddingTop:HEADER_HEIGHT}} contentContainerStyle={{paddingBottom:HEADER_HEIGHT*2}} ref={scrollRef} scrollEventThrottle={16} stickyHeaderIndices={[1]} >
            <Animated.View style={[styles.hero, imageAnimatedStyle]}>
                <Text style={styles.h1}>{"your\n notes"}</Text>
                <Text style={styles.count}>/14</Text>
            </Animated.View>
                <View style={styles.filtersCont}><FlatList style={styles.filters}
                    data={filters}
                    contentContainerStyle={{ gap: 10, paddingHorizontal: 20, }}
                    keyExtractor={item => item}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    overScrollMode="never"
                    renderItem={({ item, index }) => <FilterBtn scrollOffset={scrollOffset} item={item} index={index} active={active} setActive={setActive} />}
                />
                {/* <Animated.View style={[styles.shadow]}/> */}
                </View>
                <FlatList style={{ flex:1,width: "100%" }}
                    data={notes}
                    contentContainerStyle={{ gap: 30, paddingHorizontal: 20, }}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                    overScrollMode="never"
                    renderItem={({ item, index }) => <Card item={item} index={index} />}
                />
           
            </Animated.ScrollView>
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        
        backgroundColor: colors.black,
        flex: 1,
        position:"relative"

    },
    header: {
        position: "absolute",
        
        top: 0,
        left:0,
        backgroundColor:colors.black,
        height:HEADER_HEIGHT,
        width:width-40,
    
        zIndex: 20,
        marginHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        display: "flex",
        flexDirection: "row",
    },
    searchBar: {
        backgroundColor: colors.black,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1
    },
    searchInput: {
        color: colors.gray,
        flex: 1,
        fontFamily: "Roboto-Light",
        fontWeight: "300",
        letterSpacing: .5,
        fontSize: 16,


    },
    addBtn: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",


    },
    borderBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 1,
        backgroundColor: colors.gray,
        opacity: .7
    },
    hero: {
        // position: "absolute",
        // top: HEADER_HEIGHT + spacing,
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginTop:spacing *1.5,
        marginBottom:spacing*.5,
        paddingHorizontal: 20,
    //    backgroundColor:"red",
    
    },
    h1: {
        color: colors.gray,
        fontFamily: "Roboto-Light",
        fontSize: width * .23,
        lineHeight: width * .2,
    },
    count: {
        color: colors.gray,
        verticalAlign: "bottom",
        fontFamily: "Roboto-Light",
        fontSize: width * .12,
        opacity: .4,
        lineHeight: width * .2,
    },
    filtersCont:{
        marginBottom: spacing*.5,
    },
    filters: {
        flexGrow: 0,
        flexShrink: 0,
        width: "100%",
   
        backgroundColor:colors.black,
        paddingVertical:15,
        zIndex:2

    },
    shadow:{
        position:"absolute",
        left:"50%",
        height:1,
        bottom:-1,
        backgroundColor:"#fff",
        width:width,
        // height:5,
    
        transform:[
            {translateX:"-50%"}
        ],
        // shadowColor: colors.gray,
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.22,
        // shadowRadius: 2.22,
        
        // elevation: 10,
    }
})