import { QuizListItem } from "@/src/api/types/quiz";
import { ThemedText, ThemedView } from "@/src/components/ui";
import { StyleSheet } from "react-native-unistyles";
import { Pressable, PressableProps, View } from "react-native";
import { ScoreContainer } from "./ScoreContainer";
import { ScorePlaceholder } from "./ScorePlaceholder";
import { StatusContainer } from "./StatusContainer";
import { AttachmentButton } from "./AttachmentButton";
import { DeleteButton } from "./DeleteButton";
import { PlayButton } from "./PlayButton";
import QuizContextProvider from "@/src/context/quiz/QuizContext";

type QuizCardProps = QuizListItem &
  Pick<PressableProps, "onPress" | "disabled"> & {
    selected?: boolean;
  };

function QuizCard({ disabled, selected, onPress, ...quiz }: QuizCardProps) {
  styles.useVariants({ selected });

  return (
    <QuizContextProvider {...quiz}>
      <View style={styles.cardContainer}>
        <Pressable style={[styles.mainCard]} onPress={onPress}>
          <View style={styles.titleBlock}>
            <ThemedText numberOfLines={1} fw={"bold"}>
              {quiz.summaryTitle}
            </ThemedText>
            <StatusContainer />
          </View>
          {quiz.status === "success" ? (
            <ScoreContainer />
          ) : (
            <ScorePlaceholder />
          )}
        </Pressable>
        {selected && (
          <ThemedView surface style={styles.actionCard}>
            <DeleteButton />
            <AttachmentButton />
            <PlayButton />
          </ThemedView>
        )}
      </View>
    </QuizContextProvider>
  );
}

const styles = StyleSheet.create((theme) => ({
  titleBlock: {
    flex: 1,
  },
  cardContainer: {
    variants: {
      selected: {
        true: {
          borderColor: theme.colors.primaryLight,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: theme.radii.sm,
        },
      },
    },
  },
  mainCard: {
    borderRadius: theme.radii.sm,
    flexDirection: "row",
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    variants: {
      selected: {
        true: {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          paddingBottom: 0,
        },
      },
    },
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderBottomRightRadius: theme.radii.sm,
    borderBottomLeftRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.md,
  },
}));

export default QuizCard;
