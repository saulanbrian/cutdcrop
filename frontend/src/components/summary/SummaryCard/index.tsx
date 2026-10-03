import React, { useCallback, useState } from "react";
import { Modal, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Summary } from "@/src/api/types/summary"
import OpenButton from "./OpenButton";
import DeleteButton from "./DeleteButton";
import SummaryContextProvider, { useSummary } from "@/src/context/summary/SummaryContext";
import ViewPdfButton from "./ViewPdfButton";
import SummaryCardBase from "./SummaryCardBase";
import RetryButton from "./RetryButton";


const INITIAL_ANIMATION_DURATION = 500


function SummaryComponent(summary: Summary) {
  return (
    <SummaryContextProvider {...summary}>
      <MainComponent />
    </SummaryContextProvider>
  )
}

function MainComponent() {

  const [isPressed, setIsPressed] = useState(false)

  const dismiss = useCallback(() => {
    setIsPressed(false)
  }, [])

  return (
    <Pressable onPress={() => setIsPressed(true)}>
      <SummaryCardBase />
      <Modal
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        visible={isPressed}
        animationType={"fade"}
      >
        <Pressable
          onPress={() => setIsPressed(false)}
          style={[styles.modalBackdrop]}
        >
          <TouchableWithoutFeedback>
            <View>
              <AnimatedModalContent>
                <SummaryCardBase />
              </AnimatedModalContent>
              <ActionsContainer
                dismiss={dismiss}
              />
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>
    </Pressable>
  )
}


const ActionsContainer = ({ dismiss }: { dismiss: () => void }) => {

  const { status } = useSummary()

  return (
    <View style={styles.actionsContainer}>
      {
        status === "success"
          ? <OpenButton modalDismissFn={dismiss} />
          : <RetryButton modalDismissFn={dismiss} />
      }
      <ViewPdfButton />
      <DeleteButton modalDismissFn={dismiss} />
    </View>
  )
}


const AnimatedModalContent = ({ children }: { children: React.ReactNode }) => {

  const scale = useSharedValue(0)

  const rStyles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(scale.value, {
          stiffness: 120,
          duration: INITIAL_ANIMATION_DURATION
        })
      }
    ]
  }))

  return (
    <Animated.View style={rStyles} onLayout={() => {
      scale.value = 1
    }}>
      {children}
    </Animated.View>
  )
}


const styles = StyleSheet.create(theme => ({
  actionButton: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radii.xs,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    width: 60
  },
  actionsContainer: {
    flexDirection: "row",
    alignContent: "center",
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center'
  },
}))

export default SummaryComponent
