import names from '../names.json';
import {
  STANDBY_TIME,
  microphoneDivInnerHtml,
  keyboardDivInnerHtml,
  gameOverScoreInnerHtml,
} from './constants.js';
import { getNow, addSeconds, getRemainingTime } from './helpers/date.js';
import { speechRecognition, speechSynthesisUtterance } from './speech.js';
import {
  doWordsMatch,
  isWordInPreviousWordList,
  isWordInDatabase,
  getWordFirstChar,
  getWordLastChar,
  setLowerCaseAllChar,
  getFirstWordOfText,
} from './helpers/checkWord';

import { disabledFunctions, avtivatedFunctions } from './helpers/disAct';

class WordGame {
  constructor(options) {
    let {
      startButtonSelector,
      timerSelector,
      wordBoxSelector,
      micRadioSelector,
      keyboardRadioSelector,
      micKeyboardDivSelector,
      speechVoiceButtonSelector,
    } = options;

    this.$startButton = document.querySelector(startButtonSelector);
    this.$timerEl = document.querySelector(timerSelector);
    this.$wordBox = document.querySelector(wordBoxSelector);
    this.$microphoneRadio = document.querySelector(micRadioSelector);
    this.$keyboardRadio = document.querySelector(keyboardRadioSelector);
    this.$micKeyboardDiv = document.querySelector(micKeyboardDivSelector);
    this.$voiceButton = document.querySelector(speechVoiceButtonSelector);
    this.previousWordList = [];
    this.remainingTimeInterval = null;
    this.scoreCounter = 0;
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
      this.handleSpeechVoiceButton(selectedWordFromDatabase);
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
      const lastCharOfName = getWordLastChar(name);
      if (lastCharOfName !== 'ğ') {
        return getWordFirstChar(name) === char;
      }
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
      this.scoreCounter += 1;
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
      const firstWordOfText = getFirstWordOfText($wordInput.value);
      const userWord = setLowerCaseAllChar(firstWordOfText);
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
    this.$startButton.innerHTML = 'Try Again';
    this.$timerEl.innerHTML = gameOverScoreInnerHtml;
    document.querySelector('#score').innerHTML += this.scoreCounter;
    this.scoreCounter = 0;
  }

  handleMicOrKeyboardOption() {
    this.$keyboardRadio.addEventListener('click', () => {
      this.addKeyboardForm();
      this.handleUserKeyboardInput();
      this.clearSpeechText();
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

  clearSpeechText() {
    const $speechTextEl = document.querySelector('#speech-text');
    $speechTextEl.innerHTML = '';
  }

  handleMicrophoneStart() {
    const microphoneButton = document.querySelector('#mic-button');
    microphoneButton.addEventListener('click', () => {
      this.removeClickLabelElement();
      speechRecognition().then((userSpeechWord) =>
        this.sendWordToCheck(userSpeechWord)
      );
    });
  }

  sendWordToCheck(userSpeechWord) {
    const wordOnBox = this.$wordBox.innerHTML;
    const userWord = userSpeechWord;
    this.checkWordAccuracy(wordOnBox, userWord);
  }

  handleSpeechVoiceButton(word) {
    if (this.$voiceButton.checked) {
      const delayUtterance = setTimeout(() => {
        speechSynthesisUtterance(word);
      }, 150);
    }
  }

  removeClickLabelElement() {
    const $clickLabel = document.querySelector('#click-label');
    if ($clickLabel) {
      $clickLabel.remove();
    }
  }

  init() {
    this.handleStart();
    this.handleMicOrKeyboardOption();
    this.handleMicrophoneStart();
  }
}

export default WordGame;
