export const LEARNING_NOTES_KEY = "manapick:learning-notes:v1";
export const LEARNING_NOTES_EVENT = "manapick:learning-notes-change";

export type LearningNote = {
  ytid: string;
  learned: string;
  nextAction: string;
  reviewAt: string;
  updatedAt: string;
};

export function parseLearningNotes(raw: string | null): LearningNote[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item): LearningNote[] => {
      if (!item || typeof item !== "object") return [];
      const value = item as Partial<LearningNote>;
      if (
        typeof value.ytid !== "string" ||
        typeof value.learned !== "string" ||
        typeof value.nextAction !== "string" ||
        typeof value.reviewAt !== "string" ||
        typeof value.updatedAt !== "string"
      ) {
        return [];
      }
      return [{
        ytid: value.ytid,
        learned: value.learned.slice(0, 160),
        nextAction: value.nextAction.slice(0, 120),
        reviewAt: value.reviewAt,
        updatedAt: value.updatedAt
      }];
    });
  } catch {
    return [];
  }
}

export function reviewDateAfter(days: number) {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function isReviewDue(note: LearningNote, now = Date.now()) {
  const reviewTime = Date.parse(note.reviewAt);
  return Number.isFinite(reviewTime) && reviewTime <= now;
}

