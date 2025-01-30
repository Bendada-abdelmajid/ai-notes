import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { colors } from "../../constante/colors";
import Modal from "../ui/modal";

import { useEffect, useState } from "react";
import { Check, FolderPlus, Pencil, Plus, Trash, X } from "lucide-react-native";
import Animated, {
    FadeInLeft,
    FadeInRight,
    FadeOutLeft,
    FadeOutRight,
    interpolate,
    interpolateColor,
    LayoutAnimationConfig,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useAppContext } from "../../lib/appContext";
import { useSQLiteContext } from "expo-sqlite";
import { Folder } from "../../lib/types";
import DeleteModal from "./delete-modal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    selectedIds: number[];
};

const FilesModal = ({ isOpen, onClose, selectedIds }: Props) => {
    const db = useSQLiteContext()
    const { setFolders, setNotes } = useAppContext()
    const { folders } = useAppContext();
    const [active, setActive] = useState(0);
    const [showNewFile, setShowNewFile] = useState(false);
    const [deleteItem, setDeleteItem] = useState<Folder | null>(null);
    const handleMove = async () => {
        const placeholders = selectedIds.map(() => '?').join(',');

        try {
            await db.runAsync(
                `UPDATE notes SET folderId = ? WHERE id IN (${placeholders});`,
                [active, ...selectedIds]
            );
            setNotes(prev => prev.map(el => selectedIds.includes(el.id) ? { ...el, folderId: active } : el))
            onClose()
        } catch (error) {
            console.error('Error moving notes:', error);
        }
    };
    const onDelete = async () => {
        if (!deleteItem) return
        await db
            .runAsync(
                `DELETE FROM folders WHERE id = ?;`,
                [deleteItem.id]
            )
            .then(() => {
                setFolders((prev) => prev.filter(el => el.id != deleteItem.id))
                setDeleteItem(null);
            })
            .catch((error) => console.error("Error deletting note:", error));
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <View style={styles.head}>
                <Text style={styles.modalTitle}>Slecte File</Text>
                <Pressable onPress={onClose} style={styles.modalBtn}>
                    <X color={"#fff"} size={22} />
                </Pressable>
            </View>

            <LayoutAnimationConfig skipEntering key={"jjj"}>
                {showNewFile ? (
                    <AddFile setShowNewFile={setShowNewFile} />
                ) : (
                    <Animated.View
                        layout={LinearTransition}
                        key={"files"}
                        entering={FadeInLeft.duration(300)}
                        exiting={FadeOutLeft.duration(200)}
                    >
                        <View style={styles.filtersCont}>
                            <FlatList
                                style={styles.filters}
                                data={folders}
                                contentContainerStyle={{ gap: 10 }}
                                keyExtractor={(item) => item.id.toString()}
                                overScrollMode="never"
                                renderItem={({ item, index }) => (
                                    <FileField
                                        item={item}
                                        index={index}
                                        active={active}
                                        setActive={setActive}
                                        setDeleteItem={setDeleteItem}
                                    />
                                )}
                            />
                        </View>
                        <View style={styles.modalBtns}>
                            <Pressable
                                onPress={() => setShowNewFile(true)}
                                style={styles.addBtn}
                            >
                                <FolderPlus size={18} color={colors.gray} />
                                <Text style={styles.addBtnText}>Add File</Text>
                            </Pressable>

                            <Pressable onPress={handleMove} style={styles.modalBtn}>
                                <Text style={styles.submit}>Submit</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}
            </LayoutAnimationConfig>
            <DeleteModal isOpen={deleteItem ? true : false} onClose={() => setDeleteItem(null)} onDelete={onDelete} selectedCount={1} />
        </Modal>
    );
};
type FileFieldProps = {
    item: Folder;
    index: number;
    active: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
    setDeleteItem: React.Dispatch<React.SetStateAction<Folder | null>>
};
const AnimatedInput = Animated.createAnimatedComponent(TextInput);
const FileField = ({ item, index, active, setActive, setDeleteItem }: FileFieldProps) => {
    const activevalue = useSharedValue(0);
    const db = useSQLiteContext();
    const { setFolders } = useAppContext();
    const [folder, setFolder] = useState(item.title);
    const [editable, setEditable] = useState(false);
    useEffect(() => {
        activevalue.value = withSpring(active == item.id ? 1 : 0, { damping: 10 });
    }, [active]);
    const animtedStyle = useAnimatedStyle(() => {
        return {
            borderColor: interpolateColor(
                activevalue.value,
                [0, 0.5, 1],
                [colors.gray, colors.orange, colors.orange]
            ),
        };
    });
    const animtedCheckBoxInerStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(activevalue.value, [0, 1], [0, 1]),
            transform: [
                {
                    scale: interpolate(activevalue.value, [0, 1], [0, 1]),
                },
            ],
        };
    });
    const animtedInputStyle = useAnimatedStyle(() => {
        return {
            borderBottomColor: withTiming(editable ? colors.gray : colors.black, {
                duration: 200,
            }),
        };
    });


    const onUpdate = async () => {
        await db
            .runAsync(
                `UPDATE folders SET title = ? WHERE id = ?;`,
                [folder, item.id]
            )
            .then((result) => {
                setFolders((prev) => prev.map(el => el.id == item.id ? { ...el, title: folder } : el));
                setEditable(false);
            })
            .catch((error) => console.error("Error adding note:", error));

    };
    return (
        <Pressable onPress={() => setActive(item.id)} style={styles.row}>
            {!editable && (
                <Animated.View
                    entering={FadeInLeft.duration(300)}
                    exiting={FadeOutLeft.duration(300)}
                >
                    <Animated.View style={[styles.checkBox, animtedStyle]}>
                        <Animated.View
                            style={[styles.checkBoxIner, animtedCheckBoxInerStyle]}
                        />
                    </Animated.View>
                </Animated.View>
            )}
            <Animated.View layout={LinearTransition} style={{ flex: 1 }}>
                <AnimatedInput
                    style={[styles.filed, animtedInputStyle]}
                    value={folder}
                    onChangeText={setFolder}
                    readOnly={!editable}
                />
            </Animated.View>
            <LayoutAnimationConfig skipEntering>
                {editable ? (
                    <Animated.View
                        key={item + "-edit"}
                        entering={FadeInLeft.duration(300)}
                        exiting={FadeOutLeft.duration(300)}
                        style={styles.iconBtns}
                    >
                        <Pressable
                            onPress={() => setEditable(false)}
                            style={styles.iconBtn}
                        >
                            <X size={18} color={colors.gray} />
                        </Pressable>
                        <Pressable onPress={onUpdate} style={styles.iconBtn}>
                            <Check size={18} color={colors.gray} />
                        </Pressable>
                    </Animated.View>
                ) : (
                    <Animated.View
                        key={index + "-actions"}
                        entering={FadeInRight.duration(300)}
                        exiting={FadeOutRight.duration(300)}
                        style={styles.iconBtns}
                    >
                        <Pressable onPress={() => setEditable(true)} style={styles.iconBtn}>
                            <Pencil size={18} color={colors.gray} />
                        </Pressable>
                        <Pressable onPress={() => setDeleteItem(item)} style={styles.iconBtn}>
                            <Trash size={18} color={colors.gray} />
                        </Pressable>
                    </Animated.View>
                )}
            </LayoutAnimationConfig>
        </Pressable>
    );
};

const AddFile = ({
    setShowNewFile,
}: {
    setShowNewFile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const db = useSQLiteContext();
    const { setFolders } = useAppContext();
    const [newFile, setNewFile] = useState("");
    const onSubmit = async () => {
        await db
            .runAsync(
                `INSERT INTO folders (title) VALUES (?);`,
                [newFile]
            )
            .then((result) => {
                setFolders((prev) => [
                    ...prev,
                    { id: result.lastInsertRowId, title: newFile },
                ]);
                setNewFile("");
                setShowNewFile(false);
            })
            .catch((error) => console.error("Error adding note:", error));
        console.log("submit");
    };
    return (
        <Animated.View
            key={"file-form"}
            layout={LinearTransition}
            entering={FadeInRight.duration(300)}
            exiting={FadeOutRight.duration(200)}
        >
            <TextInput
                placeholder="Enter file name"
                placeholderTextColor={"#eee"}
                style={styles.input}
                value={newFile}
                onChangeText={setNewFile}
            />
            <View style={styles.modalBtns}>
                <Pressable onPress={() => setShowNewFile(false)} style={styles.addBtn}>
                    <Text style={styles.addBtnText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={onSubmit} style={styles.modalBtn}>
                    <Text style={styles.submit}>Submit</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
};
export default FilesModal;

const styles = StyleSheet.create({
    head: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomColor: "#555",
        borderBottomWidth: 1,
        paddingBottom: 10,
        marginBottom: 10,
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "Roboto-Regular",
    },
    filtersCont: {
        marginBottom: 20,
    },
    filters: {
        flexGrow: 0,
        flexShrink: 0,
        width: "100%",
        backgroundColor: colors.black,
        paddingVertical: 15,
        zIndex: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    checkBox: {
        width: 22,
        height: 22,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 20,
    },
    checkBoxIner: {
        width: 10,
        height: 10,
        backgroundColor: colors.orange,
        borderRadius: 20,
    },
    modalDesc: {
        marginTop: 5,
        color: colors.gray,
        fontSize: 16,
        fontFamily: "Roboto-Light",
        opacity: 0.6,
    },
    filed: {
        backgroundColor: colors.black,
        zIndex: 2,
        flex: 1,
        color: colors.gray,
        fontSize: 18,
        fontFamily: "Roboto-Light",
        borderBottomWidth: 1,
    },
    iconBtns: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    iconBtn: {
        width: 34,
        height: 34,
        justifyContent: "center",
        alignItems: "center",
    },

    modalBtns: {
        marginTop: 20,
        flexDirection: "row",
        gap: 20,
        justifyContent: "space-between",
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    addBtnText: {
        color: colors.gray,
        fontSize: 16,
        fontFamily: "Roboto-Regular",
        letterSpacing: 0.4,
    },
    modalBtn: {
        borderRadius: 15,
        padding: 5,
    },

    submit: {
        color: colors.orange,
        fontSize: 18,
        fontFamily: "Roboto-Regular",
        letterSpacing: 0.4,
    },
    input: {
        backgroundColor: "#222",
        width: "100%",
        height: 44,
        borderRadius: 5,
        color: colors.gray,
        paddingHorizontal: 10,
        marginTop: 20,
    },
});
