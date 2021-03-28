export const disabledFunctions = {
  microphoneButtonDisabled: () => {
    const $microphoneButton = document.querySelector('#mic-button');
    if ($microphoneButton) {
      $microphoneButton.disabled = true;
    }
  },
  keyboardFormDisabled: () => {
    const $keyboardForm = document.querySelector('#word-input');
    if ($keyboardForm) {
      const readonly = document.createAttribute('readonly');
      $keyboardForm.setAttributeNode(readonly);
    }
  },
  startButtonDisabled: () => {
    const $startButton = document.querySelector('#start');
    $startButton.disabled = true;
  },
  microphoneRadioDisabled: () => {
    const $microphoneRadio = document.querySelector('#microphone');
    $microphoneRadio.disabled = true;
  },
  keyboardRadioDisabled: () => {
    const $keyboardRadio = document.querySelector('#keyboard');
    $keyboardRadio.disabled = true;
  },
};

export const avtivatedFunctions = {
  microphoneButtonActivated: () => {
    const $microphoneButton = document.querySelector('#mic-button');
    if ($microphoneButton) {
      $microphoneButton.disabled = false;
    }
  },
  keyboardFormActivated: () => {
    const $keyboardForm = document.querySelector('#word-input');
    if ($keyboardForm) {
      $keyboardForm.removeAttribute('readonly');
    }
  },
  startButtonActivated: () => {
    const $startButton = document.querySelector('#start');
    $startButton.disabled = false;
  },
  microphoneRadioActivated: () => {
    const $microphoneRadio = document.querySelector('#microphone');
    $microphoneRadio.disabled = false;
  },

  keyboardRadioActivated: () => {
    const $keyboardRadio = document.querySelector('#keyboard');
    $keyboardRadio.disabled = false;
  },
};
