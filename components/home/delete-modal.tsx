import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../constante/colors";
import Modal from "../ui/modal";


type Props = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    selectedCount: number;
};


const DeleteModal = ({ isOpen, onClose, onDelete, selectedCount }: Props) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <Text style={styles.modalTitle}>Delete {selectedCount} items</Text>
            <Text style={styles.modalDesc}>
                Are you sure you want to delete these notes?
            </Text>
            <View style={styles.modalBtns}>
                <Pressable onPress={onClose} style={styles.modalBtn}>
                    <Text style={styles.cancel}>Cancel</Text>
                </Pressable>
                <Pressable onPress={onDelete} style={styles.modalBtn}>
                    <Text style={styles.delete}>Delete</Text>
                </Pressable>
            </View>

        </Modal>
    );
};
export default DeleteModal;


const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "#00000030",
        zIndex: 20,
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
        borderWidth: 1,
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
        opacity: 0.6,
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
        letterSpacing: 0.4,
    },
})