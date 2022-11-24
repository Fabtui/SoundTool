import axios from 'axios';

export const audioRecord = () => {
  const startRecordingButton = document.getElementById("startRecordingButton");
  const stopRecordingButton = document.getElementById("stopRecordingButton");
  const playButton = document.getElementById("playButton");
  const downloadButton = document.getElementById("downloadButton");
  const viewButton = document.getElementById("viewButton");
  const saveButton = document.getElementById("saveButton");
  const recoButton = document.getElementById("recoButton");

  let leftchannel = [];
  let rightchannel = [];
  let recorder = null;
  let recordingLength = 0;
  let volume = null;
  let mediaStream = null;
  let sampleRate = 44100;
  let context = null;
  let blob = null;

  startRecordingButton.addEventListener("click", function () {
    if (blob != null) {
      blob = null;
      leftchannel = [];
      rightchannel = [];
      recorder = null;
    }
      // Initialize recorder
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      navigator.getUserMedia(
      {
          audio: true
      },
      function (e) {
          console.log("user consent");

          // creates the audio context
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          context = new AudioContext();

          // creates an audio node from the microphone incoming stream
          mediaStream = context.createMediaStreamSource(e);

          // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
          // bufferSize: the onaudioprocess event is called when the buffer is full
          let bufferSize = 2048;
          let numberOfInputChannels = 2;
          let numberOfOutputChannels = 2;
          if (context.createScriptProcessor) {
              recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
          } else {
              recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
          }

          recorder.onaudioprocess = function (e) {
              leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
              rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
              recordingLength += bufferSize;
          }

          // we connect the recorder
          mediaStream.connect(recorder);
          recorder.connect(context.destination);
      },
      function (e) {
          console.error(e);
      });
  });

  stopRecordingButton.addEventListener("click", function () {

      // stop recording
      recorder.disconnect(context.destination);
      mediaStream.disconnect(recorder);

      // we flat the left and right channels down
      // Float32Array[] => Float32Array
      let leftBuffer = flattenArray(leftchannel, recordingLength);
      let rightBuffer = flattenArray(rightchannel, recordingLength);
      // we interleave both channels together
      // [left[0],right[0],left[1],right[1],...]
      let interleaved = interleave(leftBuffer, rightBuffer);

      // we create our wav file
      let buffer = new ArrayBuffer(44 + interleaved.length * 2);
      let view = new DataView(buffer);

      // RIFF chunk descriptor
      writeUTFBytes(view, 0, 'RIFF');
      view.setUint32(4, 44 + interleaved.length * 2, true);
      writeUTFBytes(view, 8, 'WAVE');
      // FMT sub-chunk
      writeUTFBytes(view, 12, 'fmt ');
      view.setUint32(16, 16, true); // chunkSize
      view.setUint16(20, 1, true); // wFormatTag
      view.setUint16(22, 2, true); // wChannels: stereo (2 channels)
      view.setUint32(24, sampleRate, true); // dwSamplesPerSec
      view.setUint32(28, sampleRate * 4, true); // dwAvgBytesPerSec
      view.setUint16(32, 4, true); // wBlockAlign
      view.setUint16(34, 16, true); // wBitsPerSample
      // data sub-chunk
      writeUTFBytes(view, 36, 'data');
      view.setUint32(40, interleaved.length * 2, true);

      // write the PCM samples
      let index = 44;
      let volume = 1;
      for (let i = 0; i < interleaved.length; i++) {
          view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
          index += 2;
      }

      // our final blob
      blob = new Blob([view], { type: 'audio/wav' });
  });

  playButton.addEventListener("click", function () {
      if (blob == null) {
          return;
      }
      let url = window.URL.createObjectURL(blob);
      let audio = new Audio(url);
      audio.play();
  });

  downloadButton.addEventListener("click", function () {
      if (blob == null) {
          return;
      }

      let url = URL.createObjectURL(blob);

      let a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "sample.wav";
      a.click();
      window.URL.revokeObjectURL(url);
  });

  viewButton.addEventListener("click", function () {
      if (blob == null) {
          return;
      }
      let url = window.URL.createObjectURL(blob);
      let audio = new Audio(url);
      console.log(audio);
      console.log(url);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      // let reco = webkitSpeechRecognition()
      console.log(recognition);
  });

    saveButton.addEventListener("click", function () {
      const csrfToken = document.getElementsByName("csrf-token")[0].content;
      if (blob == null) {
          return;
      }
      let url = window.URL.createObjectURL(blob);
      var reader  = new window.FileReader();
      let savedWAVBlob = null
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
          var base64data = reader.result;
          savedWAVBlob = base64data
          axios.post('/audios', {
            content: savedWAVBlob,
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
      }
  });

  recoButton.addEventListener("click", function () {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // This runs when the speech recognition service starts
    recognition.onstart = function() {
        console.log("We are listening. Try speaking into the microphone.");
    };

    recognition.onspeechend = function() {
        // when user is done speaking
        recognition.stop();
    }

    // This runs when the speech recognition service returns result
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
    };

    // start recognition
    recognition.start();
  });


  function flattenArray(channelBuffer, recordingLength) {
      let result = new Float32Array(recordingLength);
      let offset = 0;
      for (let i = 0; i < channelBuffer.length; i++) {
          let buffer = channelBuffer[i];
          result.set(buffer, offset);
          offset += buffer.length;
      }
      return result;
  }

  function interleave(leftChannel, rightChannel) {
      let length = leftChannel.length + rightChannel.length;
      let result = new Float32Array(length);

      let inputIndex = 0;

      for (let index = 0; index < length;) {
          result[index++] = leftChannel[inputIndex];
          result[index++] = rightChannel[inputIndex];
          inputIndex++;
      }
      return result;
  }

  function writeUTFBytes(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
      }
  }

}
