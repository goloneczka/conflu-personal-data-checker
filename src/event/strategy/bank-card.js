import { checkerOption } from "../event-checker-strategy";
import { findWordsAround } from "./shared/words-around-merger";

export const bankCardTextChecker = async (text) => {
  const matches = [];
  const possibleNumbers = text.match(/(?:\d[\s-]?){13,19}/g); // Szukamy 13-19 cyfr z opcjonalnymi spacjami lub myślnikami

  if (!possibleNumbers) {
    return { checkerType: checkerOption.BANK_CARD, result: [] };
  }

  for (let raw of possibleNumbers) {
    const sanitized = raw.replace(/[^\d]/g, "");

    // Długość musi pasować
    if (sanitized.length < 13 || sanitized.length > 19) continue;

    // Luhn check
    if (!luhnCheck(sanitized)) continue;

    // Czy to Visa lub Mastercard?
    if (isVisa(sanitized) || isMastercard(sanitized)) {
      matches.push(raw);
    }
  }

  return { checkerType: checkerOption.BANK_CARD, result: findWordsAround(text, matches) };
};

function luhnCheck(number) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isVisa(number) {
  return /^4\d{12}(\d{3})?(\d{3})?$/.test(number);
}

function isMastercard(number) {
  return /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/.test(number);
}
