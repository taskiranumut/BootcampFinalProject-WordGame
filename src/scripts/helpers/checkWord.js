import names from '.../names.json';

export const doWordsMatch = (comparedWord, checkedWord) => {
  //Kontrol edilen kelimenin her zaman ilk karakteri alınır.
  const checkedWordFirstChar = checkedWord.charAt(0);
  //Karşılaştırılan kelimenin her zaman son karakteri alınır.
  const lastIndex = comparedWord.length - 1;
  const comparedWordLastChar = comparedWord.charAt(lastIndex);
  return checkedWordFirstChar === comparedWordLastChar;
  //Değerin true olması istenir.
};

export const isWordInPreviousWordsList = (checkedWord, previousWordsList) => {
  const isThereInList = previousWordsList.some((word) => word === checkedWord);
  return isThereInList;
  //Değerin false olması istenir.
};

export const isWordInDatabase = (checkedWord) => {
  const isThereInDatabase = names.some((word) => word === checkedWord);
  return isThereInDatabase;
  //Değerin true olması istenir.
};
