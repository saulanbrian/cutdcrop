import { useCallback, useEffect, useRef, useState } from "react";
import ThemedAlert from "./ThemedAlert";
import { NavigationAction, useNavigation } from "@react-navigation/native";

type ExitConfirmationModalProps = {
  title: string;
  text: string;
  primaryTitle?: string;
  secondaryTitle?: string;
  warning?: boolean;
}

function ExitConfirmationModal({
  title,
  text,
  primaryTitle = "continue",
  secondaryTitle = "cancel",
  warning = true,
}: ExitConfirmationModalProps) {

  const [visible, setVisible] = useState(false)
  const navigation = useNavigation()
  const navAction = useRef<NavigationAction>(null)

  const onDispatch = useCallback(() => {
    navigation.dispatch(navAction.current!)
  }, [navigation])

  useEffect(() => {

    const beforeRemove = navigation.addListener("beforeRemove", e => {
      e.preventDefault()
      navAction.current = e.data.action
      setVisible(true)
    })

    return beforeRemove

  }, [navigation])

  return <ThemedAlert
    title={title}
    text={text}
    visible={visible}
    primaryAction={{
      title: primaryTitle,
      warning,
      onDispatch,
    }}
    secondaryAction={{
      title: secondaryTitle,
      onDispatch: () => setVisible(false)
    }}
  />
}

export default ExitConfirmationModal
