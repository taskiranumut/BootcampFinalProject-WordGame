import names from '../names.json';
import { STANDBY_TIME } from './constants.js';
import { getNow, addSeconds, getRemainingTime } from './helpers/date.js';
import { speechRecognition } from './speech.js';
import {
  doWordsMatch,
  isWordInPreviousWordList,
  isWordInDatabase,
  getWordFirstChar,
  getWordLastChar,
} from './helpers/checkWord';

class WordGame {
  constructor(options) {
    let {
      startButtonSelector,
      timerSelector,
      wordBoxSelector,
      wordFormSelector,
      formButtonSelector,
      wordInputSelector,
      micRadioSelector,
      keyboardRadioSelector,
      microphoneButtonSelector,
    } = options;
    this.previousWordList = [];
    this.$startButton = document.querySelector(startButtonSelector);
    this.$timerEl = document.querySelector(timerSelector);
    this.$wordBox = document.querySelector(wordBoxSelector);
    this.$wordForm = document.querySelector(wordFormSelector);
    this.$wordFormButton = document.querySelector(formButtonSelector);
    this.$wordInput = document.querySelector(wordInputSelector);
    this.$microphoneRadio = document.querySelector(micRadioSelector);
    this.$keyboardRadio = document.querySelector(keyboardRadioSelector);
    this.$microphoneButton = document.querySelector(microphoneButtonSelector);
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
      this.$wordFormButton.disabled = false;
      this.$startButton.disabled = true;
      this.$microphoneRadio.disabled = true;
      this.$keyboardRadio.disabled = true;
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

  handleUserInput() {
    this.$wordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userWord = this.$wordInput.value;
      if (userWord) {
        const wordOnBox = this.$wordBox.innerHTML;
        this.checkWordAccuracy(wordOnBox, userWord);
      }
      this.$wordInput.value = '';
    });
  }

  handleGameOver() {
    clearInterval(this.remainingTimeInterval);
    this.previousWordList = [];
    this.$wordFormButton.disabled = true;
    this.$microphoneRadio.disabled = false;
    this.$keyboardRadio.disabled = false;
    this.$timerEl.innerHTML = 'Game Over';
    this.$startButton.disabled = false;
    this.$startButton.innerHTML = 'Start Game';
  }

  handleMicKeyboardOption() {
    const keyboardDiv = document.querySelector('#keyboard-div');
    const microphoneDiv = document.querySelector('#microphone-div');
    this.$keyboardRadio.addEventListener('click', () => {
      microphoneDiv.classList.add('hidden');
      keyboardDiv.classList.remove('hidden');
    });
    this.$microphoneRadio.addEventListener('click', () => {
      keyboardDiv.classList.add('hidden');
      microphoneDiv.classList.remove('hidden');
    });
  }

  init() {
    this.handleStart();
    this.handleUserInput();
    this.handleMicKeyboardOption();
    speechRecognition();
  }
}

export default WordGame;
