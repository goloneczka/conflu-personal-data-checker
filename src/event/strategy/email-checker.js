import { checkerOption } from "../event-checker-strategy";
import { findWordsAroundNew } from "./shared/words-around-merger";

export const emailTextChecker = async (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matchesWithIndex = [];

  for (const match of text.matchAll(emailRegex)) {
    matchesWithIndex.push({
      match: match[0],
      index: match.index,
    });
  }

  if (matchesWithIndex.length === 0) {
    return { checkerType: checkerOption.EMAIL, result: [] };
  }

  return {
    checkerType: checkerOption.EMAIL,
    result: findWordsAroundNew(text, matchesWithIndex),
  };
};
