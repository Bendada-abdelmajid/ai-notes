import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { act, useCallback, useMemo, useState } from "react";
import { colors } from "../constante/colors";
import { Plus, Search } from "lucide-react-native";
import FilterBtn from "./ui/filter-btn";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
// import { notes } from '../constante/notes'
import Card from "./ui/card";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOutLeft,
  FadeOutRight,
  FadeOutUp,
  interpolate,
  LayoutAnimationConfig,
  LinearTransition,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import { useAppContext } from "../lib/appContext";
import { Folder, Note } from "../lib/types";
import ActionButtons from "./home/action-btns";
import DeleteModal from "./home/delete-modal";
import FilesModal from "./home/files-modal";
type Props = {};

const { width } = Dimensions.get("window");
const IMG_HEIGHT = width * 0.5;
const HEADER_HEIGHT = 60;
const spacing = 30;
const AnimatedButton = Animated.createAnimatedComponent(Pressable)
const Home = (props: Props) => {
  const { setOpen, notes, deleteNotesByIds, folders, activeFilter, setActiveFilter } = useAppContext();

  const [activeSearch, setActiveSearch] = useState(false);
  const [showSelected, setShowSelected] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [-IMG_HEIGHT, 0, IMG_HEIGHT],
        [1, 1, 0],
        Extrapolation.CLAMP
      ),
    };
  });
  const filters: Folder[] = [{ title: "all", id: -1 }, { title: "uncategorized", id: 0 }, ...folders];
  const handleDelete = useCallback(() => {
    deleteNotesByIds(selectedIds);
    setShowSelected(false);
    setSelectedIds([]);
    setIsDeleteModalOpen(false);
  }, [selectedIds, deleteNotesByIds]);
  const handleFileChange = useCallback(() => {
    setShowSelected(false);
    setSelectedIds([]);
    setIsFileModalOpen(false);
  }, [selectedIds]);
  const data = useMemo(() => {
    if (search) {
      return notes.filter(el => el.title?.toLowerCase().includes(search.toLowerCase()));
    }

    return activeFilter === -1 ? notes : notes.filter(el => el.folderId === activeFilter);
  }, [notes, activeFilter, search]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          {showSelected ? (
            <ActionButtons
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              setShowSelected={setShowSelected}
              showSelected={showSelected}
              onOpenDelete={() => setIsDeleteModalOpen(true)}
              onOpenFile={() => setIsFileModalOpen(true)}
            />
          ) : (
            <Animated.View entering={FadeInUp.duration(400)}
              exiting={FadeOutUp.duration(200)} style={styles.headerContent}>
              <Animated.View layout={LinearTransition} style={styles.searchBar}>
                <Search size={18} color={"#fff"} />
                <TextInput
                  keyboardAppearance="dark"
                  onPress={() => setActiveSearch(true)}
                  onBlur={() => setActiveSearch(false)}
                  autoFocus={activeSearch}
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor={"#eee"}
                  style={styles.searchInput}
                  placeholder="Search for your Notes"
                />
              </Animated.View>

              {activeSearch ? <AnimatedButton key={"clear-search"} entering={FadeInLeft.duration(300)}
                exiting={FadeOutLeft.duration(300)}
                onPress={() => setActiveSearch(false)} style={styles.cancelBtn}>
                <Text style={{ color: colors.orange, fontSize: 16, }}>Cancel</Text>
              </AnimatedButton>
                : <AnimatedButton key={"add"} entering={FadeInRight.duration(300)}
                  exiting={FadeOutRight.duration(300)} onPress={() => setOpen(true)} style={styles.addBtn}>
                  <Plus size={25} strokeWidth={1.4} color={"#fff"} />
                </AnimatedButton>}


            </Animated.View>
          )}

          <View style={styles.borderBottom} />
        </View>

        <Animated.ScrollView
          style={{ paddingTop: HEADER_HEIGHT }}
          contentContainerStyle={{
            paddingBottom: HEADER_HEIGHT * 2,
            paddingTop: activeSearch ? spacing : 0,
          }}
          ref={scrollRef}
          scrollEventThrottle={16}
          stickyHeaderIndices={[1]}
        >

          <Animated.View style={[styles.hero, imageAnimatedStyle]}>
            <Text style={styles.h1}>{"your\n notes"}</Text>
            <Text style={styles.count}>/{data.length}</Text>
          </Animated.View>



          {!activeSearch &&
            <Animated.View key={"filters"} entering={FadeInUp.duration(300)} exiting={FadeOutUp.duration(200)} style={[styles.filtersCont]}>
              <FlatList
                style={styles.filters}
                data={filters}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
                keyExtractor={(item) => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                renderItem={({ item, index }) => (
                  <FilterBtn
                    scrollOffset={scrollOffset}
                    item={item}
                    index={index}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                )}
              />

            </Animated.View>}


          <FlatList
            style={{ flex: 1, width: "100%" }}
            data={data}
            contentContainerStyle={{ gap: 30, paddingHorizontal: 20 }}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            overScrollMode="never"
            renderItem={({ item, index }) => (
              <Card
                item={item}
                index={index}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                setShowSelected={setShowSelected}
                showSelected={showSelected}
              />
            )}
          />
        </Animated.ScrollView>
        <DeleteModal
          onDelete={handleDelete}
          isOpen={isDeleteModalOpen}
          selectedCount={selectedIds.length}
          onClose={() => setIsDeleteModalOpen(false)}
        />
        <FilesModal

          isOpen={isFileModalOpen}
          selectedIds={selectedIds}

          onClose={() => setIsFileModalOpen(false)}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.black,
    flex: 1,
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: colors.black,
    height: HEADER_HEIGHT,
    width: width,
    zIndex: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: colors.black,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  searchInput: {
    color: colors.gray,
    flex: 1,
    fontFamily: "Roboto-Light",
    fontWeight: "300",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  cancelBtn: {
    width: 100,
    height: 44,
    alignItems: "flex-end",
    justifyContent: "center"
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
    left: 20,
    width: "100%",
    height: 1,
    backgroundColor: colors.gray,
    opacity: 0.7,
  },

  hero: {
    // position: "absolute",
    // top: HEADER_HEIGHT + spacing,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: spacing * 1.5,
    marginBottom: spacing * 0.7,
    paddingHorizontal: 20,
    //    backgroundColor:"red",
  },
  h1: {
    color: colors.gray,
    fontFamily: "Roboto-Light",
    fontSize: width * 0.23,
    lineHeight: width * 0.2,
  },
  count: {
    color: colors.gray,
    verticalAlign: "bottom",
    fontFamily: "Roboto-Light",
    fontSize: width * 0.12,
    opacity: 0.4,
    lineHeight: width * 0.2,
  },
  filtersCont: {
    marginBottom: spacing * 0.5,
  },
  filters: {
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",

    backgroundColor: colors.black,
    paddingVertical: 15,
    zIndex: 2,
  },
  shadow: {
    position: "absolute",
    left: "50%",
    height: 1,
    bottom: -1,
    backgroundColor: "#fff",
    width: width,
    // height:5,

    transform: [{ translateX: "-50%" }],
    // shadowColor: colors.gray,
    // shadowOffset: {
    //     width: 0,
    //     height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,

    // elevation: 10,
  },
});
