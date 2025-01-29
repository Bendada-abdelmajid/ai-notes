import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Note } from "../../lib/types";
import { ListChecks, SquareMousePointer, Trash2, X } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  LayoutAnimationConfig,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAppContext } from "../../lib/appContext";
import { colors } from "../../constante/colors";
import { useSQLiteContext } from "expo-sqlite";

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
    style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
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
  showSelected,
}) => {
  const { notes, deleteNotesByIds } = useAppContext();
  const [openDelete, setOpenDelete] = useState(false)
  const isAllSelected = useMemo(
    () => slecteds.length === notes.length,
    [slecteds.length, notes.length]
  );

  const handleClear = useCallback(() => {
    setShowSelected(false);
    setSelecteds([]);
  }, [setShowSelected, setSelecteds]);

  const handleSelectAll = useCallback(() => {
    setSelecteds(isAllSelected ? [] : notes.map((el) => el.id));
  }, [isAllSelected, notes, setSelecteds]);

  const handleDelete = useCallback(() => {
    deleteNotesByIds(slecteds);
    handleClear();
    console.log("Delete selected items:", slecteds);
  }, [slecteds]);

  const handleMove = useCallback(() => {
    // Implement move functionality
    console.log("Move selected items:", slecteds);
  }, [slecteds]);

  const activeStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(slecteds.length > 0 ? 1 : 0.5),
      pointerEvents: slecteds.length > 0 ? "auto" : "none",
    };
  });
  if (!showSelected) {
    return null;
  }
  return (
    <>
   
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
            <X color="#fff" size={24} />
          </Pressable>
          <Text style={styles.selectionText}>
            {slecteds.length} item{slecteds.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <ActionButton
          onPress={()=> setOpenDelete(true)}
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
          accessibilityLabel={
            isAllSelected ? "Deselect all items" : "Select all items"
          }
        />
      </Animated.View>
      <DeleteModal openDelete={openDelete} setOpenDelete={setOpenDelete} handleDelete={handleDelete}/>
    </>
  );
};

type DeleteModalType = {
  openDelete: boolean;
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void
}
const AnimatedButton =  Animated.createAnimatedComponent(Pressable)
const DeleteModal = ({ openDelete, setOpenDelete, handleDelete }: DeleteModalType) => {
  return (
    <LayoutAnimationConfig skipEntering>
      {openDelete && <AnimatedButton entering={FadeIn.duration(200)} exiting={FadeOut.duration(300)}  onPress={()=>setOpenDelete(false)} style={[styles.overlay]} />}
      {openDelete &&  <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutDown.duration(300)} style={styles.modal}>
        <Text style={styles.modalTitle}>Delete 2 items</Text>
        <Text style={styles.modalDesc}>Are you sure to delete Notes</Text>
        <View style={styles.modalBtns}>
          <Pressable onPress={()=>setOpenDelete(false)} style={styles.modalBtn}><Text style={styles.cancel}>Cancel</Text></Pressable>
          <Pressable onPress={handleDelete} style={styles.modalBtn}><Text style={styles.delete}>Delete</Text></Pressable>
        </View>
      </Animated.View>}
    </LayoutAnimationConfig>
  )
}

const styles = StyleSheet.create({
  container: {

    width: "100%",

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
  btns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    padding: 8,
  },
  btnPressed: {
    opacity: 0.7,
  },
  btnText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Roboto-Light",
  },
  selectionText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Roboto-Light",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#00000030",
    zIndex: 20
  },
  modal: {
    position: "absolute",
    bottom: 30,
    right: 20,
    left: 20,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
    borderRadius: 20,
    backgroundColor: colors.black,
    zIndex: 33,
    borderColor: "#0000004f",
    borderWidth: 1
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
  modalDesc: {
    marginTop: 5,
    color: colors.gray,
    fontSize: 16,
    fontFamily: "Roboto-Light",
    opacity: .6
  },
  modalBtns: {
    marginTop: 20,
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-end",

  },
  modalBtn: {
    borderRadius: 15,
    padding: 5,
  },
  cancel: {
    color: "#eee",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
  delete: {
    color: colors.orange,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    letterSpacing: .4,
  }
});

export default ActionButtons;
