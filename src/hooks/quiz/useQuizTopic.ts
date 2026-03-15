import { useEffect } from "react";
import { useQuizStore } from "../../store/quizStore";

export interface QuizTopic {
  id: string;
  name: string;
  shortName: string;
}

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: "AWS_DVA",
    name: "Associate(DVA-C02)",
    shortName: "AWS Certified Developer",
  },
  {
    id: "AWS_SAA",
    name: "Associate(SAA-C03)",
    shortName: "AWS Certified Solutions Architect",
  },
  {
    id: "AWS_SOA",
    name: "Associate(SOA-C02)",
    shortName: "AWS Certified SysOps Administrator",
  },
  {
    id: "AWS_DOP",
    name: "Professional(DOP-C02)",
    shortName: "AWS Certified DevOps Engineer",
  },
];

export function useQuizTopic() {
  const setScrollIndex = useQuizStore((state) => state.setScrollIndex);

  useEffect(() => {
    setScrollIndex(0);
  }, [setScrollIndex]);

  return {
    topics: QUIZ_TOPICS,
  };
}

