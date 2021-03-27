import names from '../names.json';
import {
  STANDBY_TIME,
  microphoneDivInnerHtml,
  keyboardDivInnerHtml,
} from './constants.js';
import { getNow, addSeconds, getRemainingTime } from './helpers/date.js';
import { speechRecognition } from './speech.js';
import {
  doWordsMatch,
  isWordInPreviousWordList,
  isWordInDatabase,
  getWordFirstChar,
  getWordLastChar,
  setLowerCaseAllChar,
} from './helpers/checkWord';

import {
  disabledFunctions,
  avtivatedFunctions,
} from './helpers/disabledActivated';

class WordGame {
  constructor(options) {
    let {
      startButtonSelector,
      timerSelector,
      wordBoxSelector,
      micRadioSelector,
      keyboardRadioSelector,
      micKeyboardDivSelector,
    } = options;

    this.$startButton = document.querySelector(startButtonSelector);
    this.$timerEl = document.querySelector(timerSelector);
    this.$wordBox = document.querySelector(wordBoxSelector);
    this.$microphoneRadio = document.querySelector(micRadioSelector);
    this.$keyboardRadio = document.querySelector(keyboardRadioSelector);
    this.$micKeyboardDiv = document.querySelector(micKeyboardDivSelector);
    this.previousWordList = [];
    this.remainingTimeInterval = null;
  }

  startTimer() {
    this.$timerEl.innerHTML = STANDBY_TIME;
    const nowDate = getNow();
    const totalSeconds = addSeconds(nowDate, STANDBY_TIME);
    this.remainingTimeInterval = setInterval(() => {
      const remainingTimeSeconds = getRemainingTime(totalSeconds).seconds;
      this.$timerEl.innerHTML = remainingTimeSeconds;
      if (remainingTimeSeconds < 0) {
        this.handleGameOver();
      }
    }, 1000);
  }

  startTimerAgain() {
    clearInterval(this.remainingTimeInterval);
    this.startTimer();
  }

  wordWriterToBox(userWord) {
    const selectedWordFromDatabase = this.wordSelector(userWord);
    if (
      isWordInPreviousWordList(selectedWordFromDatabase, this.previousWordList)
    ) {
      this.wordWriterToBox(userWord);
    } else {
      this.previousWordList.push(selectedWordFromDatabase);
      this.$wordBox.innerHTML = selectedWordFromDatabase;
    }
  }

  wordSelector(userWord) {
    if (userWord) {
      const wordLastChar = getWordLastChar(userWord);
      const wordListAccordingToChar = this.getWordListFromDatabase(
        wordLastChar
      );
      const randomIndex = this.randomIndexGenerator(wordListAccordingToChar);
      return wordListAccordingToChar[randomIndex];
    } else {
      const randomIndex = this.randomIndexGenerator(names);
      return names[randomIndex];
    }
  }

  getWordListFromDatabase(char) {
    return names.filter((name) => {
      return getWordFirstChar(name) === char;
    });
  }

  randomIndexGenerator(array) {
    return Math.floor(Math.random() * array.length);
  }

  handleStart() {
    this.$startButton.addEventListener('click', () => {
      disabledFunctions.startButtonDisabled();
      disabledFunctions.microphoneRadioDisabled();
      disabledFunctions.keyboardRadioDisabled();
      avtivatedFunctions.microphoneButtonActivated();
      avtivatedFunctions.keyboardFormActivated();
      this.$startButton.innerHTML = 'Started';
      this.startTimer();
      this.wordWriterToBox();
    });
  }

  checkWordOnDatabase(userWord, database) {
    if (isWordInDatabase(userWord, database)) {
      this.startTimerAgain();
      this.wordWriterToBox(userWord);
      this.previousWordList.push(userWord);
    } else {
      this.handleGameOver();
    }
  }

  checkWordOnPreviousWords(userWord, previousWordList) {
    if (isWordInPreviousWordList(userWord, previousWordList)) {
      this.handleGameOver();
    } else {
      this.checkWordOnDatabase(userWord, names);
    }
  }

  checkWordAccuracy(wordOnBox, userWord) {
    if (doWordsMatch(wordOnBox, userWord)) {
      this.checkWordOnPreviousWords(userWord, this.previousWordList);
    } else {
      this.handleGameOver();
    }
  }

  handleUserKeyboardInput() {
    const $wordForm = document.querySelector('#word-form');
    $wordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const $wordInput = document.querySelector('#word-input');
      const userWord = setLowerCaseAllChar($wordInput.value);
      if (userWord) {
        const wordOnBox = this.$wordBox.innerHTML;
        this.checkWordAccuracy(wordOnBox, userWord);
      }
      $wordInput.value = '';
    });
  }

  handleGameOver() {
    clearInterval(this.remainingTimeInterval);
    this.previousWordList = [];
    disabledFunctions.microphoneButtonDisabled();
    disabledFunctions.keyboardFormDisabled();
    avtivatedFunctions.microphoneRadioActivated();
    avtivatedFunctions.keyboardRadioActivated();
    avtivatedFunctions.startButtonActivated();
    this.$timerEl.innerHTML = 'Game Over';
    this.$startButton.innerHTML = 'Try Again';
  }

  handleMicOrKeyboardOption() {
    this.$keyboardRadio.addEventListener('click', () => {
      this.addKeyboardForm();
      this.handleUserKeyboardInput();
    });
    this.$microphoneRadio.addEventListener('click', () => {
      this.addMicrophoneButton();
      this.handleMicrophoneStart();
    });
  }

  addMicrophoneButton() {
    this.$micKeyboardDiv.innerHTML = microphoneDivInnerHtml;
  }

  addKeyboardForm() {
    this.$micKeyboardDiv.innerHTML = keyboardDivInnerHtml;
  }

  handleMicrophoneStart() {
    const microphoneButton = document.querySelector('#mic-button');
    microphoneButton.addEventListener('click', () => {
      speechRecognition().then((userSpeechWord) =>
        this.sendWordToCheck(userSpeechWord)
      );
    });
  }

  sendWordToCheck(userSpeechWord) {
    const wordOnBox = this.$wordBox.innerHTML;
    const userWord = setLowerCaseAllChar(userSpeechWord);
    this.checkWordAccuracy(wordOnBox, userWord);
  }

  init() {
    this.handleStart();
    this.handleMicOrKeyboardOption();
    this.handleMicrophoneStart();
  }
}

export default WordGame;
