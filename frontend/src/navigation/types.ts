import { NavigatorScreenParams } from "@react-navigation/native"
import { SummaryStackParamList } from "./summary/types"
import { AuthStackParamList } from "./auth/types";
import { QuizStackParamList } from "./quiz/types";

export type RootNavigatorParamList = {
  Summary: NavigatorScreenParams<SummaryStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Quiz: NavigatorScreenParams<QuizStackParamList>
}
