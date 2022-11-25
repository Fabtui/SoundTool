// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"
import { audioRecord } from "./pack/audio"
import { runSpeechRecognition } from './pack/recognition'
import { speek } from './pack/speek'

// require("@rails/ujs").start()
// require("turbolinks").start()
// require("@rails/activestorage").start()
// require("channels")

// document.addEventListener("turbolinks:load", function() {
//   audioRecord()
// });

audioRecord();
runSpeechRecognition();
speek();
