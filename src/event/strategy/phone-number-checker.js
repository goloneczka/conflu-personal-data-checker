import { checkerOption } from "../event-checker-strategy";
import { findWordsAround } from "./shared/words-around-merger";

export const phoneNumberTextChecker = async (text) => {
  const foundPhones = [];

  // Regex do wyszukiwania:
  // - numery z prefixem + lub 00
  // - lokalne numery (NANP, Indie itd.) w różnych formatach
  const phoneRegex = /(?:\+|00)?\d{1,4}[\s\-]?\(?\d{1,4}\)?(?:[\s\-]?\d{2,5}){2,5}|\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}|\b\d{9,10}\b/g;

  const matches = text.match(phoneRegex);
  if (!matches) return [];

  for (const match of matches) {
    const cleaned = match.trim();

    // Zamiana '00' na '+'
    let standardized = cleaned;
    if (standardized.startsWith("00")) {
      standardized = "+" + standardized.slice(2);
    } else if (!standardized.startsWith("+")) {
      // Spróbuj dodać prefix jeśli możliwe
      const prefixes = ["1", "91", "86", "972", "44", "49", "33", "34", "61", "48", "31", "39"];
      for (const prefix of prefixes) {
        if (standardized.startsWith(prefix)) {
          standardized = "+" + standardized;
          break;
        }
      }
    }

    if (validateInternationalPhone(standardized)) {
      foundPhones.push(cleaned);
    }
  }

  return { checkerType: checkerOption.PHONE_NUMBER, result: findWordsAround(text, foundPhones) };
};

function validateInternationalPhone(number) {
  const digits = number.replace(/\D/g, "");

  // USA / Kanada (z prefixem +1)
  if (number.startsWith("+1")) {
    return /^\+1\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/.test(number);
  }

  // Indie (+91)
  if (number.startsWith("+91")) {
    return /^\+91[\s\-]?[6-9]\d{4}[\s\-]?\d{5}$/.test(number);
  }

  // Chiny (+86)
  if (number.startsWith("+86")) {
    return /^\+86[\s\-]?1\d{2}[\s\-]?\d{4}[\s\-]?\d{4}$/.test(number);
  }

  // Izrael (+972)
  if (number.startsWith("+972")) {
    return /^\+972[\s\-]?[2-9]\d{1}[\s\-]?\d{3}[\s\-]?\d{4}$/.test(number);
  }

  // UK (+44)
  if (number.startsWith("+44")) {
    return /^\+44[\s\-]?[1-9]\d{1,3}[\s\-]?\d{3,4}[\s\-]?\d{3,4}$/.test(number);
  }

  // Niemcy (+49)
  if (number.startsWith("+49")) {
    return /^\+49[\s\-]?[1-9]\d{1,4}[\s\-]?\d{3,5}[\s\-]?\d{3,5}$/.test(number);
  }

  // Kanada (lokalne numery mają ten sam format co USA, prefix +1 sprawdzony wyżej)

  // Francja (+33)
  if (number.startsWith("+33")) {
    return /^\+33[\s\-]?[1-9](?:[\s\-]?\d{2}){4}$/.test(number);
  }

  // Hiszpania (+34)
  if (number.startsWith("+34")) {
    return /^\+34[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{3}$/.test(number);
  }

  // Australia (+61)
  if (number.startsWith("+61")) {
    return /^\+61[\s\-]?[2-478]\d[\s\-]?\d{3}[\s\-]?\d{3,4}$/.test(number);
  }

  // Polska (+48)
  if (number.startsWith("+48")) {
    return /^\+48[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{3}$/.test(number);
  }

  // Holandia (+31)
  if (number.startsWith("+31")) {
    return /^\+31[\s\-]?[1-9]\d{1,2}[\s\-]?\d{6,7}$/.test(number);
  }

  // Włochy (+39)
  if (number.startsWith("+39")) {
    return /^\+39[\s\-]?\d{2,4}[\s\-]?\d{6,8}$/.test(number);
  }

  // Lokalna walidacja dla poszczególnych krajów (bez prefixu)

  // USA / Kanada (NANP lokalne)
  if (/^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/.test(number)) {
    return true;
  }

  // Indie (10 cyfr, zaczyna się od 6-9)
  if (/^[6-9]\d{9}$/.test(digits) && digits.length === 10) {
    return true;
  }

  // Chiny (11 cyfr, zaczyna się od 1)
  if (/^1\d{10}$/.test(digits)) {
    return true;
  }

  // Izrael (9 cyfr, zaczyna się od 2-9)
  if (/^[2-9]\d{8}$/.test(digits)) {
    return true;
  }

  // UK (10 cyfr, różne formaty, bez prefixu)
  if (/^(?:0|\()?7\d{3}[\s\-]?\d{6}$/.test(number) || /^\(?0\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}$/.test(number)) {
    return true;
  }

  // Niemcy (min 7 cyfr lokalnie, bez prefixu, zwykle zaczyna się od 0)
  if (/^0\d{6,11}$/.test(digits)) {
    return true;
  }

  // Francja (9 cyfr, zaczyna się od 1-9)
  if (/^[1-9]\d{8}$/.test(digits)) {
    return true;
  }

  // Hiszpania (9 cyfr)
  if (/^\d{9}$/.test(digits)) {
    return true;
  }

  // Australia (9 cyfr, zaczyna się od 2-9)
  if (/^[2-9]\d{8}$/.test(digits)) {
    return true;
  }

  // Polska (9 cyfr)
  if (/^\d{9}$/.test(digits)) {
    return true;
  }

  // Holandia (9 cyfr)
  if (/^\d{9}$/.test(digits)) {
    return true;
  }

  // Włochy (9-10 cyfr)
  if (/^\d{9,10}$/.test(digits)) {
    return true;
  }

  return false;
}
