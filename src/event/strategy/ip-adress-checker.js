import { checkerOption } from "../event-checker-strategy";
import { findWordsAroundNew } from "./shared/words-around-merger";

export const IpAdressTextChecker = async (text) => {
  const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\b/g;
  const ipv6Regex = /\b(?:(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,7}:|::(?:[A-Fa-f0-9]{1,4}:){0,6}[A-Fa-f0-9]{1,4})\b/g;

  // Collect IPv4 matches with indices
  const ipv4Matches = [...text.matchAll(ipv4Regex)].map((m) => ({ match: m[0], index: m.index }));

  // Collect IPv6 matches with indices - keep raw matched text as is (no cleaning)
  const ipv6Matches = [...text.matchAll(ipv6Regex)].map((m) => ({ match: m[0], index: m.index }));

  // Merge all matches
  const allMatches = [...ipv4Matches, ...ipv6Matches];

  if (allMatches.length === 0) {
    return { checkerType: checkerOption.IP_ADDRESS, result: [] };
  }

  return {
    checkerType: checkerOption.IP_ADDRESS,
    result: findWordsAroundNew(text, allMatches),
  };
};
