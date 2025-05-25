export const findWordsAround = (text, foundTexts) => {
  const seen = new Map();
  const textsWithDupes = foundTexts
    .map((card) => card.trim())
    .map((val) => {
      const count = seen.get(val) || 0;
      seen.set(val, count + 1);
      return { val, duplicate: count };
    });

  const finalResults = [];
  const usedCounts = new Map();

  console.warn("textsWithDupes", textsWithDupes);

  for (const { val, duplicate } of textsWithDupes) {
    const cardRegex = new RegExp(val.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"); // escapujemy znaki specjalne
    let match;
    let count = usedCounts.get(val) || 0;

    while ((match = cardRegex.exec(text)) !== null) {
      console.warn("match", match, "count", count);
      if (count === duplicate) {
        const start = match.index;
        const end = cardRegex.lastIndex;

        const before = text.slice(0, start).trim();
        const wordBefores = before.match(/\S+/g) || [];
        const wordBefore2 = wordBefores[wordBefores.length - 2] || "";
        const wordBefore1 = wordBefores[wordBefores.length - 1] || "";

        const after = text.slice(end).trim();
        const wordAfters = after.match(/\S+/g) || [];
        const wordAfter1 = wordAfters[0] || "";
        const wordAfter2 = wordAfters[1] || "";

        finalResults.push({
          val,
          wordsBefore: wordBefore2 + " " + wordBefore1,
          wordsAfter: wordAfter1 + " " + wordAfter2,
        });
        break;
      }
      count++;
    }

    usedCounts.set(val, count);
  }
  return finalResults;
};

export const findWordsAroundNew = (text, matchesWithIndex) => {
  const results = [];

  for (const { match: val, index: start } of matchesWithIndex) {
    const end = start + val.length;

    const before = text.slice(0, start).trim();
    const wordBefores = before.match(/\S+/g) || [];
    const wordBefore2 = wordBefores[wordBefores.length - 2] || "";
    const wordBefore1 = wordBefores[wordBefores.length - 1] || "";

    const after = text.slice(end).trim();
    const wordAfters = after.match(/\S+/g) || [];
    const wordAfter1 = wordAfters[0] || "";
    const wordAfter2 = wordAfters[1] || "";

    results.push({
      val,
      wordsBefore: wordBefore2 + " " + wordBefore1,
      wordsAfter: wordAfter1 + " " + wordAfter2,
    });
  }

  return results;
};
