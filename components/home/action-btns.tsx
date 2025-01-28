import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { Note } from '../../lib/types';
import { ListChecks, SquareMousePointer, Trash2, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown, useAnimatedProps, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAppContext } from '../../lib/appContext';
import { colors } from '../../constante/colors';
import { useSQLiteContext } from 'expo-sqlite';

interface ActionButtonsProps {
    slecteds: number[];
    showSelected: boolean;
    setShowSelected: (value: boolean) => void;
    setSelecteds: React.Dispatch<React.SetStateAction<number[]>>;
}

interface ActionButtonProps {
    onPress?: () => void;
    icon: React.ReactNode;
    label: string;
    accessibilityLabel: string;
}

const ANIMATION_DURATION = 300;

const ActionButton: React.FC<ActionButtonProps> = ({
    onPress,
    icon,
    label,
    accessibilityLabel,
}) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.btn,
            pressed && styles.btnPressed
        ]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
    >
        {icon}
        {/* <Text style={styles.btnText}>{label}</Text> */}
    </Pressable>
);

const ActionButtons: React.FC<ActionButtonsProps> = ({
    slecteds,
    setShowSelected,
    setSelecteds,
    showSelected
}) => {
    const { notes, deleteNotesByIds } = useAppContext();


    const isAllSelected = useMemo(() =>
        slecteds.length === notes.length,
        [slecteds.length, notes.length]
    );

    const handleClear = useCallback(() => {
        setShowSelected(false);
        setSelecteds([]);
    }, [setShowSelected, setSelecteds]);

    const handleSelectAll = useCallback(() => {
        setSelecteds(isAllSelected ? [] : notes.map(el => el.id));
    }, [isAllSelected, notes, setSelecteds]);

    const handleDelete = useCallback(async () => {
        deleteNotesByIds(slecteds)
        handleClear()
        console.log('Delete selected items:', slecteds);
    }, [slecteds]);

    const handleMove = useCallback(() => {
        // Implement move functionality
        console.log('Move selected items:', slecteds);
    }, [slecteds]);


    const activeStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(slecteds.length > 0 ? 1 : .5),
            pointerEvents: slecteds.length > 0 ? "auto" : "none"
        }
    })
    if (!showSelected) {
        return null;
    }
    return (
        <Animated.View
            entering={FadeInDown.duration(ANIMATION_DURATION)}
            exiting={FadeOutDown.duration(ANIMATION_DURATION)}
            style={styles.container}
        >
            <View style={styles.left}>
                <Pressable
                    onPress={handleClear}
                    hitSlop={10}
                    style={({ pressed }) => pressed && styles.btnPressed}
                    accessibilityLabel="Clear selection"
                    accessibilityRole="button"
                >
                    <X color="#fff" size={24}  />
                </Pressable>
                <Text style={styles.selectionText}>
                    {slecteds.length} item{slecteds.length !== 1 ? 's' : ''}
                </Text>
            </View>

     
                <ActionButton
                    onPress={handleDelete}
                    icon={<Trash2 color="#fff" size={22} strokeWidth={1.4} />}
                    label="Delete"
                    accessibilityLabel="Delete selected items"
                />
                <ActionButton
                    onPress={handleMove}
                    icon={<SquareMousePointer color="#fff" size={22} strokeWidth={1.4} />}
                    label="Move"
                    accessibilityLabel="Move selected items"
                />
                <ActionButton
                    onPress={handleSelectAll}
                    icon={
                        <ListChecks
                            color={isAllSelected ? colors.orange : "#fff"}
                            size={22}
                            strokeWidth={1.4}
                        />
                    }
                    label="All"
                    accessibilityLabel={isAllSelected ? "Deselect all items" : "Select all items"}
                />
           
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#000',
        flexDirection: 'row',
        gap:15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex:1,
    },
    btns: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        padding: 8,
    },
    btnPressed: {
        opacity: 0.7,
    },
    btnText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Roboto-Light',
    },
    selectionText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Roboto-Light',
    },
});

export default ActionButtons;