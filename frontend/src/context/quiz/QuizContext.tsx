import { QuizListItem } from "@/src/api/types/quiz";
import { createContext, PropsWithChildren, useContext } from "react";

const QuizContext = createContext<QuizListItem | undefined>(undefined)

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("Cannot use QuizContext outside its provider")
  }
  return context
}

export default function QuizContextProvider({
  children,
  ...quiz
}: PropsWithChildren<QuizListItem>) {

  return (
    <QuizContext.Provider value={{ ...quiz }}>
      {children}
    </QuizContext.Provider>
  )
} 
