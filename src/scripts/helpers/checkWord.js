export const doWordsMatch = (comparedWord, checkedWord) => {
  return getWordFirstChar(checkedWord) === getWordLastChar(comparedWord);
};

export const isWordInPreviousWordList = (checkedWord, previousWordList) => {
  const isThereInList = previousWordList.some((word) => word === checkedWord);
  return isThereInList;
};

export const isWordInDatabase = (checkedWord, database) => {
  const isThereInDatabase = database.some((word) => word === checkedWord);
  return isThereInDatabase;
};

export const getWordFirstChar = (word) => {
  return word.charAt(0);
};

export const getWordLastChar = (word) => {
  const lastIndex = word.length - 1;
  return word.charAt(lastIndex);
};
