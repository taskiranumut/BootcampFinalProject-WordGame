export const doWordsMatch = (comparedWord, checkedWord) => {
  const checkedWordFirstChar = checkedWord.charAt(0);
  const lastIndex = comparedWord.length - 1;
  const comparedWordLastChar = comparedWord.charAt(lastIndex);
  return checkedWordFirstChar === comparedWordLastChar;
};

export const isWordInPreviousWordsList = (checkedWord, previousWordsList) => {
  const isThereInList = previousWordsList.some((word) => word === checkedWord);
  return isThereInList;
};

export const isWordInDatabase = (checkedWord, database) => {
  const isThereInDatabase = database.some((word) => word === checkedWord);
  return isThereInDatabase;
};
