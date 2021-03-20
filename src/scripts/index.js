import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import WordGame from './app.js';

let wordGame = new WordGame({
  startButtonSelector: '#start',
  timerSelector: '#timer',
  wordBoxSelector: '#word-box',
  wordFormSelector: '#word-form',
  formButtonSelector: '#form-button',
  wordInputSelector: '#word-input',
});

wordGame.init();
