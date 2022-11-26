import axios from 'axios';

export const addItem = () => {
  const itemRecoButton = document.getElementById("itemRecoButton");

  if (itemRecoButton) {

    itemRecoButton.addEventListener("click", function () {
      // const recoLabel = document.getElementById("reco-label");
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
          const csrfToken = document.getElementsByName("csrf-token")[0].content;
          const listId = itemRecoButton.dataset.listId
          const url = `/lists/${listId}/items`

          axios.post(url, {
              name: transcript
            }, {
              headers: {
              'X-CSRF-Token': csrfToken
            }})
            .then(function (response) {
              if (response.status == 204) {
                location.reload()
              }
            })
            .catch(function (error) {
              console.log(error);
            });
          // window.location.reload()
        }
      };
      recognition.start();

    });
  }
}
