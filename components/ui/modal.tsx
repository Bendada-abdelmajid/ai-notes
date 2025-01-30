import { Pressable, StyleSheet } from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    FadeOutDown,
    LayoutAnimationConfig,
    LinearTransition,
} from "react-native-reanimated";
import { colors } from "../../constante/colors";
import { ReactNode } from "react";
import { BlurView, ExperimentalBlurMethod } from "expo-blur";




type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Modal = ({ isOpen, onClose, children }: Props) => {
    return (
        <LayoutAnimationConfig skipEntering>
            {isOpen && (
                <AnimatedPressable
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(300)}
                    onPress={onClose}
                    style={[StyleSheet.absoluteFill,styles.overlay]}
                >
                    <BlurView style={{flex:1}} tint="dark"  experimentalBlurMethod={"blur" as ExperimentalBlurMethod} />
                </AnimatedPressable>
            )}
            {isOpen && (
                <Animated.View layout={LinearTransition}
                    entering={FadeInDown.duration(300)}
                    exiting={FadeOutDown.duration(300)}
                    style={styles.modal}
                >
                    {children}
                </Animated.View>
            )}
        </LayoutAnimationConfig>
    );
};
export default Modal;


const styles = StyleSheet.create({
    overlay: {
        
        // position: "absolute",
        // top: -0,
        // bottom: 0,
        // right: 0,
        // left: 0,
        // backgroundColor: "#00000030",
        zIndex: 20,
    },
    modal: {
        position: "absolute",
        bottom: 30,
        right: 10,
        left: 10,
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 15,
        borderRadius: 20,
        backgroundColor: colors.black,
        zIndex: 33,
        borderColor: "#0000004f",
        borderWidth: 1,
        overflow: "hidden"
    }

})