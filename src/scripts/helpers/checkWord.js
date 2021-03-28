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

export const setLowerCaseAllChar = (word) => {
  const allChars = word.split('');
  return allChars
    .map((char) => {
      switch (char) {
        case 'İ':
          return 'i';
        case 'I':
          return 'ı';
        case 'Ö':
          return 'ö';
        case 'Ü':
          return 'ü';
        default:
          return char.toLowerCase();
      }
    })
    .join('');
};

export const getUserSpeechWordFromTranscript = (transcript) => {
  let userSpeechWord = '';
  if (isSpecialWord(transcript)) {
    userSpeechWord = 'senagül';
  } else {
    userSpeechWord = getFirstWordOfText(transcript);
  }
  return setLowerCaseAllChar(userSpeechWord);
};

export const getFirstWordOfText = (text) => {
  const textSplitArr = text.split(' ');
  const [firstWord] = textSplitArr;
  return firstWord;
};

const isSpecialWord = (text) => {
  const textSplitArr = text.split(' ');
  if (
    (textSplitArr[0] === 'Sena' || textSplitArr[0] === 'sena') &&
    (textSplitArr[1] === 'Gül' || textSplitArr[1] === 'gül')
  ) {
    return true;
  }
};
