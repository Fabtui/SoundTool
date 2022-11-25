export const speek = () => {
  const speekButton = document.getElementById("speekButton");
  if (speekButton) {
    speekButton.addEventListener('click', () => {
      speech()
    })
  }

  const speech = () => {
    const synth = window.speechSynthesis;

    const utterance1 = new SpeechSynthesisUtterance('Hello ya mother fucker!');

    synth.speak(utterance1);
  }
}
