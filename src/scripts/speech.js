import { getUserSpeechWordFromTranscript } from './helpers/checkWord';
import { disabledFunctions, avtivatedFunctions } from './helpers/disAct';

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

    recognition.onresult = (event) => {
      const speechTranscript = event.results[0][0].transcript;
      const userSpeechWord = getUserSpeechWordFromTranscript(speechTranscript);
      $speechTextDiv.innerHTML = `Your word: <strong>${userSpeechWord}</strong>`;
      resolve(userSpeechWord);
    };

    recognition.onerror = (event) => {
      avtivatedFunctions.microphoneButtonActivated();
      stopRecognitionMicButtonColorBlue();
      reject('Error occurred in recognition: ' + event.error);
    };

    recognition.onnomatch = () => {
      avtivatedFunctions.microphoneButtonActivated();
      stopRecognitionMicButtonColorBlue();
      reject('No match. Click mic again.');
    };

    recognition.onspeechend = () => {
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

export const speechSynthesisUtterance = (word) => {
  return new Promise((resolve, reject) => {
    if (!SpeechSynthesisUtterance) {
      reject('API not supported');
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'tr-TR';

    utterance.onend = function () {
      resolve();
    };

    utterance.onerror = function () {
      reject('Speech synthesis utterance error');
    };

    speechSynthesis.speak(utterance);
  });
};
