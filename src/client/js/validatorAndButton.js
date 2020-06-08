function validatorAndButton(formText, resultTitle, containerDiv) {
  // Validating the text input
  const textTooShortDiv = document.querySelector('.text-too-short');
  const textTooShortParagraph = document.querySelector('.text-too-short-p');

  // Checking function for the user input
  const checking = (condition) => {
    if (condition) {
      textTooShortParagraph.textContent = 'Text too short! Please enter text';
      textTooShortDiv.style.display = 'block';
      resultTitle.style.display = 'none';
      containerDiv.style.display = 'none';
      setTimeout(() => {
        textTooShortDiv.style.display = 'none';
      }, 1500);
    } else {
      containerDiv.style.display = 'block';
      textTooShortDiv.style.display = 'none';
    }
  };

  // Checking if input text is just numbers
  checking(formText.match(/^[0-9]+$/));

  // Checking if input text is long enough for good results
  checking(formText.length < 35);

  const buttonShowInstructions = document.querySelector('.button');
  const instructions = document.querySelector('.description');

  buttonShowInstructions.addEventListener('click', () => {
    console.log('Instruction button clicked');
    instructions.style.display = 'block';
    buttonShowInstructions.style.display = 'none';
  });
}

export { validatorAndButton };
