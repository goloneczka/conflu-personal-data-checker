export const generateSortableId = () => {
  const timestamp = Date.now().toString(); // 13-digit milliseconds timestamp
  const random = Math.random().toString(36).slice(2, 8); // 6-char random string
  return `${timestamp}-${random}`;
};
