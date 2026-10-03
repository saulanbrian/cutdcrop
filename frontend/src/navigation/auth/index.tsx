import { createStackNavigator } from "@react-navigation/stack";
import { AuthStackParamList } from "./types";
import SignInScreen from "@/src/screens/auth/sign-in-screen";
import { useUnistyles } from "react-native-unistyles";
import { darkColors } from "@/src/constants/ui/colors";
import { AppHeader } from "@/src/components/navigation";
import SignUpScreen from "@/src/screens/auth/sign-up-screen";

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStackNavigator() {
  const { colors } = useUnistyles().theme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: darkColors.textPrimary,
        headerStyle: {
          backgroundColor: colors.primaryDark,
        },
      }}
    >
      <Stack.Screen
        options={{
          header: (props) => <AppHeader {...props} />,
        }}
        name={"SignIn"}
        component={SignInScreen}
      />
      <Stack.Screen
        name={"SignUp"}
        component={SignUpScreen}
        options={{
          headerTitle: "Signup",
        }}
      />
    </Stack.Navigator>
  );
}
