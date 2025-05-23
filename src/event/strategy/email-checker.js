import { checkerOption } from "../event-checker-strategy";
import { findWordsAround } from "./shared/words-around-merger";

export const emailTextChecker = async (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);

  if (!matches) return { checkerType: checkerOption.EMAIL, result: [] };

  return { checkerType: checkerOption.EMAIL, result: findWordsAround(text, matches) };
};
