// 

import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ListChecks, SquareMousePointer, Trash2, X } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  LayoutAnimationConfig,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAppContext } from "../../lib/appContext";
import { colors } from "../../constante/colors";

interface ActionButtonsProps {
  selectedIds: number[];
  showSelected: boolean;
  setShowSelected: (value: boolean) => void;
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onOpenDelete: () => void;
  onOpenFile:() => void;
}

interface ActionButtonProps {
  onPress?: () => void;
  icon: React.ReactNode;
  accessibilityLabel: string;
}


const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  icon,
  accessibilityLabel,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
  >
    {icon}
  </Pressable>
);

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedIds,
  setShowSelected,
  setSelectedIds,
  showSelected,
  onOpenDelete,
  onOpenFile

}) => {
  const { notes } = useAppContext();


  const isAllSelected = useMemo(
    () => selectedIds.length === notes.length,
    [selectedIds.length, notes.length]
  );

  const handleClearSelection = useCallback(() => {
    setShowSelected(false);
    setSelectedIds([]);
  }, [setShowSelected, setSelectedIds]);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(isAllSelected ? [] : notes.map((note) => note.id));
  }, [isAllSelected, notes, setSelectedIds]);





  const activeStyles = useAnimatedStyle(() => ({
    opacity: withTiming(selectedIds.length > 0 ? 1 : 0.5),
    pointerEvents: selectedIds.length > 0 ? "auto" : "none",
  }));

  if (!showSelected) {
    return null;
  }

  return (
 
      <Animated.View key={"actions"}
        entering={FadeInDown.duration(300)}
        exiting={FadeOutDown.duration(200)}
        style={styles.container}
      >
        <View style={styles.left}>
          <Pressable
            onPress={handleClearSelection}
            hitSlop={10}
            style={({ pressed }) => pressed && styles.btnPressed}
            accessibilityLabel="Clear selection"
            accessibilityRole="button"
          >
            <X color="#fff" size={24} />
          </Pressable>
          <Text style={styles.selectionText}>
            {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <ActionButton
          onPress={onOpenDelete}
          icon={<Trash2 color="#fff" size={22} strokeWidth={1.4} />}
          accessibilityLabel="Delete selected items"
        />
        <ActionButton
          onPress={onOpenFile}
          icon={<SquareMousePointer color="#fff" size={22} strokeWidth={1.4} />}
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
          accessibilityLabel={
            isAllSelected ? "Deselect all items" : "Select all items"
          }
        />
      </Animated.View>

   
  );
};



const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.black,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  btnPressed: {
    opacity: 0.7,
  },
  selectionText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Roboto-Light",
  }
});

export default ActionButtons;