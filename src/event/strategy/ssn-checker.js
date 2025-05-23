import { checkerOption } from "../event-checker-strategy";
import { findWordsAround } from "./shared/words-around-merger";

export const SSNTextChecker = async (text) => {
  const foundSSNs = [];

  // Match formatted SSNs: XXX-XX-XXXX
  const dashedPattern = /\b(\d{3})-(\d{2})-(\d{4})\b/g;
  let match;
  while ((match = dashedPattern.exec(text)) !== null) {
    const [full, areaStr, groupStr, serialStr] = match;
    const area = parseInt(areaStr, 10);
    const group = parseInt(groupStr, 10);
    const serial = parseInt(serialStr, 10);
    if (isValidSSN(area, group, serial)) {
      foundSSNs.push(full);
    }
  }

  // Match unformatted SSNs: XXXXXXXXX
  const plainPattern = /\b\d{9}\b/g;
  while ((match = plainPattern.exec(text)) !== null) {
    const ssn = match[0];
    const area = parseInt(ssn.substring(0, 3), 10);
    const group = parseInt(ssn.substring(3, 5), 10);
    const serial = parseInt(ssn.substring(5, 9), 10);
    if (isValidSSN(area, group, serial)) {
      foundSSNs.push(ssn);
    }
  }
  console.log("matches", foundSSNs);

  return { checkerType: checkerOption.SSN, result: findWordsAround(text, foundSSNs) };
};

function isValidSSN(area, group, serial) {
  return !(area === 0 || area === 666 || area >= 900 || group === 0 || serial === 0);
}
