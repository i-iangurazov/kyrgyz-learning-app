import type { Lesson } from "@/content/schemas";

export type Exercise = Lesson["exercises"][number];
export type ExerciseItem = Exercise["items"][number];
export type ExerciseOption = NonNullable<ExerciseItem["options"]>[number];

export function normalizeAnswer(answer: string) {
  return answer.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function getOptionById(item: ExerciseItem, optionId: string) {
  return item.options?.find((option) => option.id === optionId);
}

export function getOptionDisplayText(option: ExerciseOption) {
  return option.text.ky ?? option.text.en;
}

export function getSelectedAnswerText(item: ExerciseItem, optionIds: string[]) {
  return optionIds
    .map((optionId) => {
      const option = getOptionById(item, optionId);
      return option ? getOptionDisplayText(option) : optionId;
    })
    .join(" ");
}

export function getCorrectAnswerText(item: ExerciseItem) {
  const value = item.correctAnswerData.value;

  if (Array.isArray(value)) {
    if (item.correctAnswerData.kind === "ordered_ids") {
      return getSelectedAnswerText(item, value);
    }

    return value.join(" ");
  }

  if (typeof value !== "string") {
    return "";
  }

  if (item.correctAnswerData.kind === "choice_id") {
    const option = getOptionById(item, value);
    return option?.text.ky ?? option?.text.en ?? value;
  }

  return value;
}

export function isCorrectOption(item: ExerciseItem, option: ExerciseOption) {
  const value = item.correctAnswerData.value;

  if (typeof value !== "string") {
    return false;
  }

  if (item.correctAnswerData.kind === "choice_id") {
    return option.id === value;
  }

  const acceptedAnswers = [option.text.ky, option.text.en, option.text.ru ?? ""].map(
    normalizeAnswer,
  );

  return acceptedAnswers.includes(normalizeAnswer(value));
}

export function isCorrectTextAnswer(item: ExerciseItem, answer: string) {
  const value = item.correctAnswerData.value;

  if (typeof value !== "string") {
    return false;
  }

  if (item.correctAnswerData.kind === "choice_id") {
    const option = getOptionById(item, value);
    const acceptedAnswers = [
      option?.text.ky,
      option?.text.en,
      option?.text.ru,
      value,
    ]
      .filter((candidate): candidate is string => Boolean(candidate))
      .map(normalizeAnswer);

    return acceptedAnswers.includes(normalizeAnswer(answer));
  }

  return normalizeAnswer(answer) === normalizeAnswer(value);
}

export function isCorrectSentenceBuilder(
  item: ExerciseItem,
  selectedOptionIds: string[],
) {
  const value = item.correctAnswerData.value;

  if (
    item.correctAnswerData.kind === "ordered_ids" &&
    Array.isArray(value)
  ) {
    return (
      selectedOptionIds.length === value.length &&
      selectedOptionIds.every((optionId, index) => optionId === value[index])
    );
  }

  if (typeof value === "string") {
    return (
      normalizeAnswer(getSelectedAnswerText(item, selectedOptionIds)) ===
      normalizeAnswer(value)
    );
  }

  return false;
}

export function findExerciseItem(
  lessons: Lesson[],
  lessonId: string,
  exerciseId: string,
  itemId: string,
) {
  const lesson = lessons.find((candidate) => candidate.id === lessonId);
  const exercise = lesson?.exercises.find((candidate) => candidate.id === exerciseId);
  const item = exercise?.items.find((candidate) => candidate.id === itemId);

  if (!lesson || !exercise || !item) {
    return null;
  }

  return { lesson, exercise, item };
}
