import { setLowerCaseAllChar } from './helpers/checkWord';
import {
  disabledFunctions,
  avtivatedFunctions,
} from './helpers/disabledActivated';

export const speechRecognition = () => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      SpeechRecognition || webkitSpeechRecognition || null;
    const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    const SpeechRecognitionEvent =
      SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    const grammar = '#JSGF V1.0';

    if (SpeechRecognition === null) {
      reject('API not supported');
    }

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'tr-TR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const $speechTextDiv = document.querySelector('#speech-text');

    recognition.onresult = function (event) {
      const speechAllText = event.results[0][0].transcript;
      const speechTextSplitArr = speechAllText.split(' ');
      let [userSpeechWord] = speechTextSplitArr;
      if (
        (speechTextSplitArr[0] === 'Sena' ||
          speechTextSplitArr[0] === 'sena') &&
        (speechTextSplitArr[1] === 'Gül' || speechTextSplitArr[1] === 'gül')
      ) {
        userSpeechWord = 'senagül';
      }
      $speechTextDiv.innerHTML = `Your word: <strong>${setLowerCaseAllChar(
        userSpeechWord
      )}</strong>`;
      resolve(userSpeechWord);
    };

    recognition.onerror = function (event) {
      $speechTextDiv.innerHTML =
        'Error occurred in recognition: ' + event.error;
      avtivatedFunctions.microphoneButtonActivated();
      stopRecognitionMicButtonColorBlue();
    };

    recognition.onspeechend = function () {
      recognition.stop();
      avtivatedFunctions.microphoneButtonActivated();
      stopRecognitionMicButtonColorBlue();
    };

    recognition.start();
    $speechTextDiv.innerHTML = '';
    disabledFunctions.microphoneButtonDisabled();
    startRecognitionMicButtonColorRed();
  });
};

const startRecognitionMicButtonColorRed = () => {
  const micButton = document.querySelector('#mic-button');
  micButton.classList.remove('btn-primary');
  micButton.classList.add('btn-danger');
};

const stopRecognitionMicButtonColorBlue = () => {
  const micButton = document.querySelector('#mic-button');
  micButton.classList.remove('btn-danger');
  micButton.classList.add('btn-primary');
};
