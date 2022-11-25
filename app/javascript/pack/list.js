import axios from 'axios';

export const list = () => {
  const listRecoButton = document.getElementById("listRecoButton");

  if (listRecoButton) {
    listRecoButton.addEventListener("click", function () {
      console.log(('list'));
      const recoLabel = document.getElementById("reco-label");
      const recordSign = document.querySelector('.gg-record')

      // get action element reference
      // new speech recognition object
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

    //   // This runs when the speech recognition service starts
      recognition.onstart = function() {
          recordSign.classList.remove('hidden');
      };

      recognition.onspeechend = function() {
          recordSign.classList.add('hidden');
          recognition.stop();
      }

    //   // This runs when the speech recognition service returns result
      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        // console.log('confidence', confidence);
        // console.log('transcript', transcript);
        if (confidence > 0.8) {
          console.log(transcript);
          // window.location.reload()
        }
      };
      recognition.start();

    });
  }
}
