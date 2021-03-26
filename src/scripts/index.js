import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import WordGame from './app.js';

let wordGame = new WordGame({
  startButtonSelector: '#start',
  timerSelector: '#timer',
  wordBoxSelector: '#word-box',
  micRadioSelector: '#microphone',
  keyboardRadioSelector: '#keyboard',
  micKeyboardDivSelector: '#mic-keyboard',
});

wordGame.init();
