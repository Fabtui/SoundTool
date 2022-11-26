export const listSpeek = () => {
  const listSpeekButtons = document.querySelectorAll(".list-speek");
  if (listSpeekButtons) {
    listSpeekButtons.forEach(listSpeekButton => {
      listSpeekButton.addEventListener('click', (e) => {
        const items = e.currentTarget.dataset.items;
        speech(items)
      })
    });
  }

  const speech = (items) => {
    const synth = window.speechSynthesis;
    const utterance1 = new SpeechSynthesisUtterance(items);
    synth.speak(utterance1);
  }
}
