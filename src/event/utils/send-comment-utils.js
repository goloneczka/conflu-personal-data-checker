export const prepareNewCommentIfNeccesary = (id, verifyResults, currentValidationForPage) => {
  let newCommentBody = null;
  const isThereAnyUnsafeData = verifyResults.filter((item) => item.result.length)?.length;

  if (isThereAnyUnsafeData && (!currentValidationForPage.status || currentValidationForPage.status === "safePage")) {
    newCommentBody = _createFooterComment(id);
  } else if (!isThereAnyUnsafeData && currentValidationForPage?.status === "unsafePage") {
    newCommentBody = _createFooterCommentResponse(id);
  }
  return newCommentBody;
};

const _createFooterComment = (id) => {
  const bodyData = `{
    "pageId": "${id}",
    "body": {
      "representation": "storage",
      "value": "Found potentail sensitive data in that page. Please check it out, or contact your admin."
    }
  }`;

  return _paramRequestComment(bodyData);
};

const _createFooterCommentResponse = (id) => {
  const bodyData = `{
    "pageId": "${id}",
    "body": {
      "representation": "storage",
      "value": "Your page is safe now. Great job!"
    }
  }`;

  return _paramRequestComment(bodyData);
};

const _paramRequestComment = (bodyData) => {
  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: bodyData,
  };
};
