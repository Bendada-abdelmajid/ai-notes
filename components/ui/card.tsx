import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { colors } from '../../constante/colors';
import { formatNumber } from '../../lib/utils';
import { ArrowUpRight, Check } from 'lucide-react-native';
import { Note } from '../../lib/types';
import { useAppContext } from '../../lib/appContext';
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    LayoutAnimationConfig,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface CardProps {
    item: Note;
    index: number;
    setShowSelected: (value: boolean) => void;
    showSelected: boolean;
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
    selectedIds: number[];
}

interface CheckButtonProps {
    selected: boolean;
}

const ANIMATION_DURATION = 60;
const SCALE_VALUE = 0.95;

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const CheckButton: React.FC<CheckButtonProps> = ({ selected }) => {
    const animationStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(
            selected ? colors.orange : "#222222",
            { duration: ANIMATION_DURATION }
        ),
    }));

    return (
        <Animated.View
            entering={FadeIn.duration(ANIMATION_DURATION).easing(Easing.ease)}
            exiting={FadeOut.duration(ANIMATION_DURATION).easing(Easing.ease)}
            style={[styles.checkbox, animationStyle]}
        >
            {selected && <Check color="#fff" size={18} strokeWidth={1.4} />}
        </Animated.View>
    );
};

const Card: React.FC<CardProps> = ({
    item,
    index,
    setShowSelected,
    selectedIds,
    setSelectedIds,
    showSelected,
}) => {
    const { setEditItem, setOpen } = useAppContext();
    const scaleValue = useSharedValue(1);

    const selected = useMemo(() => selectedIds.includes(item.id), [selectedIds, item.id]);

    const handlePress = useCallback(() => {
        setSelectedIds(prev =>
            prev.includes(item.id)
                ? prev.filter(el => el !== item.id)
                : [...prev, item.id]
        );
    }, [item.id, setSelectedIds]);

    const handleLongPress = useCallback(() => {
        setSelectedIds(prev => [...prev, item.id]);
        setShowSelected(true);

    }, [item.id, setSelectedIds, setShowSelected]);;

    const handlePressIn = useCallback(() => {
        scaleValue.value = withTiming(SCALE_VALUE);
    }, [scaleValue]);

    const handlePressOut = useCallback(() => {
        scaleValue.value = withTiming(1);
    }, [scaleValue]);

    const animationStyle = useAnimatedStyle(() => ({
        opacity: withSpring(selected ? 0.7 : 1, { duration: 100 }),
    }));

    const hoverStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleValue.value }],
    }));

    return (
        <View style={styles.container}>
            <View style={styles.border} />
            <AnimatedButton
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onLongPress={handleLongPress}
                delayLongPress={100}
                style={[styles.card, hoverStyle]}
            >
                <Animated.View style={[animationStyle, styles.contentContainer]}>
                    <Text style={styles.id}>/ {formatNumber(index + 1)}</Text>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                    </Text>
                    <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
                        {item.desc}
                    </Text>
                </Animated.View>
                <View style={styles.link}>
                    <LayoutAnimationConfig skipEntering>
                        {showSelected ? (
                            <Animated.View
                                entering={FadeIn.duration(ANIMATION_DURATION).easing(Easing.ease)}
                                exiting={FadeOut.duration(ANIMATION_DURATION).easing(Easing.ease)}
                            >
                                <CheckButton selected={selected} />
                            </Animated.View>
                        ) : (
                            <ArrowUpRight color={colors.gray} size={20} strokeWidth={1.4} />
                        )}
                    </LayoutAnimationConfig>
                </View>
            </AnimatedButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    card: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        width: '100%',
    },
    contentContainer: {
        position: 'static',
    },
    border: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.gray,
        opacity: 0.7,
    },
    id: {
        fontFamily: 'Roboto-Light',
        position: 'absolute',
        top: 25,
        left: 0,
        color: colors.gray,
        opacity: 0.5,
    },
    link: {
        position: 'absolute',
        top: 10,
        right: -10,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Roboto-Light',
        fontSize: 24,
        letterSpacing: 0.5,
        color: colors.gray,
        marginBottom: 10,
    },
    desc: {
        fontFamily: 'Roboto-Light',
        fontSize: 16,
        color: colors.gray,
        opacity: 0.8,
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Card;
