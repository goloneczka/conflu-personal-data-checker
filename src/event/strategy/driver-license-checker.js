import { checkerOption } from "../event-checker-strategy";
import { findWordsAroundNew } from "./shared/words-around-merger";

export const driverLicenseTextChecker = async (text) => {
  const matchesWithIndex = [];

  const seen = new Set();

  for (const config of Object.values(regexes)) {
    const matches = text.matchAll(config.pattern);
    for (const match of matches) {
      const raw = match[0];
      const cleaned = raw.replace(/\s/g, "");
      const uniqueKey = `${match.index}-${cleaned}`;

      if (config.validate(cleaned) && !seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        matchesWithIndex.push({
          match: raw,
          index: match.index,
        });
      }
    }
  }

  if (matchesWithIndex.length === 0) {
    return { checkerType: checkerOption.DRIVER_LICENSE, result: [] };
  }

  return {
    checkerType: checkerOption.DRIVER_LICENSE,
    result: findWordsAroundNew(text, matchesWithIndex),
  };
};

const regexes = {
  USA: {
    pattern: /\b([A-Z]{1}\d{7,8})\b/g,
    validate: (num) => /^[A-Z]{1}\d{7,8}$/.test(num),
  },
  India: {
    pattern: /\b([A-Z]{2}\d{2}\s?\d{11})\b/g,
    validate: (num) => /^[A-Z]{2}\d{2}\d{11}$/.test(num.replace(/\s/g, "")),
  },
  China: {
    pattern: /\b(\d{12})\b/g,
    validate: (num) => /^\d{12}$/.test(num),
  },
  Israel: {
    pattern: /\b(\d{8,9})\b/g,
    validate: (num) => /^\d{8,9}$/.test(num),
  },
  UK: {
    pattern: /\b([A-Z]{5}\d{6}[A-Z]{2}\d{2})\b/g,
    validate: (num) => /^[A-Z]{5}\d{6}[A-Z]{2}\d{2}$/.test(num),
  },
  Germany: {
    pattern: /\b(\d{9,10})\b/g,
    validate: (num) => /^\d{9,10}$/.test(num),
  },
  France: {
    pattern: /\b(\d{2}[A-Z]{2}\d{5})\b/g,
    validate: (num) => /^\d{2}[A-Z]{2}\d{5}$/.test(num),
  },
  Spain: {
    pattern: /\b(\d{8}[A-Z]{1,3})\b/g,
    validate: (num) => /^\d{8}[A-Z]{1,3}$/.test(num),
  },
  Australia: {
    pattern: /\b(\d{9,10})\b/g,
    validate: (num) => /^\d{9,10}$/.test(num),
  },
  Poland: {
    pattern: /\b([A-Z]{3}\d{10})\b/g,
    validate: (num) => /^[A-Z]{3}\d{10}$/.test(num),
  },
  Netherlands: {
    pattern: /\b(\d{9})\b/g,
    validate: (num) => /^\d{9}$/.test(num),
  },
  Italy: {
    pattern: /\b([A-Z]{2}\d{7})\b/g,
    validate: (num) => /^[A-Z]{2}\d{7}$/.test(num),
  },
};
