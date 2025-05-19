export function extractTextFromProseMirrorJSON(jsonString) {
  const json = JSON.parse(jsonString);
  const textNodes = [];

  function traverse(node) {
    if (Array.isArray(node)) {
      node.forEach(traverse);
    } else if (node && typeof node === "object") {
      if (node.text) {
        textNodes.push(node.text);
      }
      if (node.content) {
        traverse(node.content);
      }
    }
  }

  traverse(json.content);
  return textNodes.join(" ");
}
