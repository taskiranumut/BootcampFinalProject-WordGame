import names from '../names.json';
import { STANDBY_TIME } from './constants.js';
import { getNow, addSeconds, getRemainingTime } from './helpers/date.js';
import { scpeechRecognition } from './speech.js';
import {
  doWordsMatch,
  isWordInPreviousWordsList,
  isWordInDatabase,
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
    this.previousWordsList = [];
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

  wordWriterToBox() {
    const selectedWord = this.wordSelector();
    this.previousWordsList.push(selectedWord);
    this.$wordBox.innerHTML = selectedWord;
  }

  wordSelector() {
    if (this.previousWordsList.length === 0) {
      const randomIndex = this.randomIndexGenerator(names);
      const randomWord = names[randomIndex];
      this.controlkWordFromPreviousWordsForCpu(randomWord);
      return randomWord;
    } else {
      const userWord = this.$wordInput.value;
      const lastIndex = userWord.length - 1;
      const wordLastLetter = userWord.charAt(lastIndex);
      const wordsList = this.wordGroupDefiner(wordLastLetter);
      const randomIndex = this.randomIndexGenerator(wordsList);
      const randomWord = wordsList[randomIndex];
      this.controlkWordFromPreviousWordsForCpu(randomWord);
      return randomWord;
    }
  }

  wordGroupDefiner(letter) {
    return names.filter((name) => {
      const nameFirstLetter = name.charAt(0);
      if (nameFirstLetter === letter) {
        return name;
      }
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

  checkWordOnDatabase(checkedWord, database) {
    if (isWordInDatabase(checkedWord, database)) {
      this.startTimerAgain();
      this.wordWriterToBox();
      this.previousWordsList.push(checkedWord);
    } else {
      this.handleGameOver();
    }
  }

  checkWordOnPreviousWords(checkedWord, previousWordsList) {
    if (isWordInPreviousWordsList(checkedWord, previousWordsList)) {
      this.handleGameOver();
    } else {
      this.checkWordOnDatabase(checkedWord, names);
    }
  }

  controlkWordFromPreviousWordsForCpu(word) {
    const isThereInList = this.previousWordsList.some((item) => item === word);
    if (isThereInList) {
      this.handleGameOver();
    }
  }

  checkWordAccuracy(comparedWord, checkedWord) {
    if (doWordsMatch(comparedWord, checkedWord)) {
      this.checkWordOnPreviousWords(checkedWord, this.previousWordsList);
    } else {
      this.handleGameOver();
    }
  }

  handleUserInput() {
    this.$wordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userInput = this.$wordInput.value;
      if (userInput) {
        const wordBoxText = this.$wordBox.innerHTML;
        this.checkWordAccuracy(wordBoxText, userInput);
      }
      this.$wordInput.value = '';
    });
  }

  handleGameOver() {
    clearInterval(this.remainingTimeInterval);
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
    scpeechRecognition();
  }
}

export default WordGame;
