export const speechRecognition = () => {
  const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  const SpeechRecognitionEvent =
    SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  const grammar = '#JSGF V1.0';

  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'tr-TR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const speechTextParag = document.querySelector('#speech-text');
  const microphoneButton = document.querySelector('#mic-button');

  microphoneButton.addEventListener('click', () => {
    recognition.start();
    speechTextParag.innerHTML = '';
    microphoneButton.disabled = true;
    startRecognitionMicButtonColorRed();
  });

  recognition.onresult = function (event) {
    const speechAllText = event.results[0][0].transcript;
    const speechTextSplitArr = speechAllText.split(' ');
    let [speechFirstWord] = speechTextSplitArr;
    if (
      (speechTextSplitArr[0] === 'Sena' || speechTextSplitArr[0] === 'sena') &&
      (speechTextSplitArr[1] === 'Gül' || speechTextSplitArr[1] === 'gül')
    ) {
      speechFirstWord = 'senagül';
    }
    speechTextParag.innerHTML = speechFirstWord;
  };

  recognition.onspeechend = function () {
    recognition.stop();
    microphoneButton.disabled = false;
    stopRecognitionMicButtonColorBlue();
  };

  recognition.onerror = function (event) {
    speechTextParag.innerHTML = 'Error occurred in recognition: ' + event.error;
    microphoneButton.disabled = false;
    stopRecognitionMicButtonColorBlue();
  };
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
