const isSameError = (a, b) => a.val === b.val && a.wordsBefore === b.wordsBefore && a.wordsAfter === b.wordsAfter;

export const substractValidationByFalsePositive = (arr, arr2) => {
  if (arr2.length === 0) return arr;

  return arr.map((item) => {
    const match = arr2.find((i2) => i2.checkerType === item.checkerType);

    const remainingErrors = match ? item.result.filter((e) => !match.result.some((m) => isSameError(e, m))) : item.result;

    return { checkerType: item.checkerType, result: remainingErrors };
  });
};

export const sumValidationFalsePositive = (allArrays) => {
  const mergedMap = new Map();

  for (const arr of allArrays) {
    for (const { checkerType, result } of arr) {
      if (!mergedMap.has(checkerType)) {
        mergedMap.set(checkerType, []);
      }

      const existing = mergedMap.get(checkerType);

      result.forEach((err) => {
        const exists = existing.some((e) => isSameError(e, err));
        if (!exists) existing.push(err);
      });
    }
  }

  return Array.from(mergedMap, ([checkerType, result]) => ({
    checkerType,
    result,
  }));
};
