export const STANDBY_TIME = 15;

export const microphoneDivInnerHtml = `<div id="microphone-div" class="center spacing10px">
<button type="button" class="btn btn-primary" id="mic-button" disabled>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="30"
  height="30"
  fill="currentColor"
  class="bi bi-mic"
  viewBox="0 0 16 16">
    <path 
      fill-rule="evenodd"
      d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z">
    </path>
    <path
      fill-rule="evenodd"
      d="M10 8V3a2 2 0 1 0-4 0v5a2 2 0 1 0 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z">
    </path>
</svg>
</button>
</div>`;

export const keyboardDivInnerHtml = `<div id="keyboard-div">
<form class="row spacing10px" id="word-form">
    <input type="text" class="form-control" placeholder="write here" id="word-input" readonly/>
</form>
</div>`;

export const gameOverScoreInnerHtml = `Game Over<div id="score">Your score: </div>`;
