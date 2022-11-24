export const runSpeechRecognition = () => {
  // get output div reference
  var output = document.getElementById("output");
  // get action element reference
  var action = document.getElementById("action");
      // new speech recognition object
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      var recognition = new SpeechRecognition();

      // This runs when the speech recognition service starts
      recognition.onstart = function() {
          action.innerHTML = "<small>listening, please speak...</small>";
      };

      recognition.onspeechend = function() {
          action.innerHTML = "<small>stopped listening, hope you are done...</small>";
          recognition.stop();
      }

      // This runs when the speech recognition service returns result
      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        // console.log('confidence', confidence);
        // console.log('transcript', transcript);
        if (confidence > 0.8 && transcript == 'audio') {
          window.location.assign("/audios")
        }
        if (confidence > 0.8 && transcript == 'liste') {
          window.location.assign("/list")
        }
        if (confidence > 0.8 && transcript == 'test') {
          window.location.assign("/test")
        }
        if (confidence > 0.8 && transcript == 'ajouter liste') {
          console.log('ajouter');
        }
          output.innerHTML = "<b>Text:</b> " + transcript + "<br/> <b>Confidence:</b> " + confidence*100+"%";
          output.classList.remove("hide");
      };

        // start recognition
        recognition.start();
}
