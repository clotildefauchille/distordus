var app = {
  init: () => {
    //l'utilisateur autorise ou non l'enregistrement
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(app.onSuccess, app.onError);
    app.chunks = [];
    app.recordButton = document.getElementById("record");
    app.stopButton = document.getElementById("stop");
    app.listenToButtonClick();
    app.listenToInputValueChange();
    app.audioFileContainer = document.getElementById("audioFileContainer");
  },
  onSuccess: (stream) => {
    app.audioCreateContainers(stream);
  },
  onError: (err) => {
    console.log("The following error occured: " + err);
  },
  audioCreateContainers: async function (stream) {
    //creation d'un contexte audio
    app.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    //creation d'une entrée, source audio
    app.source = app.audioCtx.createMediaStreamSource(stream);
    //creation d'une sortie, destination audio
    app.streamDestination = app.audioCtx.createMediaStreamDestination();
    //creation d'un enregistreur
    app.mediaRecorder = new MediaRecorder(app.streamDestination.stream);
    app.highPassFilter = app.audioCtx.createBiquadFilter();
    app.distortion = app.audioCtx.createWaveShaper();
    app.convolver = app.audioCtx.createConvolver();
    //connecte la source à la sortie
    // app.source.connect(app.streamDestination);
  },
  pushBlob: () => {
    app.mediaRecorder.ondataavailable = function (e) {
      app.chunks.push(e.data);
      console.log("chunks", app.chunks);
    };
  },
  createBlob: () => {
    app.mediaRecorder.onstop = function (e) {
      app.blob = new Blob(app.chunks, { type: "audio/ogg; codecs=opus" });
      app.chunks = [];
      app.audioURL = window.URL.createObjectURL(app.blob);
      console.log("app.audioURL in onstop", app.audioURL);
      app.createElementAudioDisplay(app.audioURL);
      app.audioFileName();
    };
  },
  createElementAudioDisplay: (audioURL) => {
    app.audioElement = document.createElement("audio");
    app.audioElement.setAttribute("controls", true);
    app.audioElement.src = audioURL;
    app.audioElement.className = "audio-display-style";
    document.body.insertBefore(app.audioElement, app.audioFileContainer);
  },
  startRecord: () => {
    app.mediaRecorder.start();
    // pour avoir le retour monitor
    // app.source.connect(app.audioCtx.destination);
    app.stopButton.disabled = false;
    app.recordButton.disabled = true;
    app.changeButtonColor(app.recordButton, "#b61827", "white");
  },
  stopRecord: () => {
    app.mediaRecorder.stop();
    app.changeButtonColor(app.recordButton, "rgb(255, 134,124, .4)", "black");
    app.stopButton.disabled = true;
    app.recordButton.disabled = false;
    app.pushBlob();
    app.createBlob();
  },
  changeButtonColor: (button, backgroundColor, color) => {
    button.style.backgroundColor = backgroundColor;
    button.style.color = color;
  },
  audioFileName: () => {
    let audioTitle = prompt("enter your audio file name", "mon titre audio");
    let newTitle = document.createTextNode(audioTitle);
    let textEdit = document.createElement("div");
    textEdit.appendChild(newTitle);
    textEdit.className = "audiofile-title";
    document.body.insertBefore(textEdit, app.audioFileContainer);
  },
  inputValueChange: (value, name) => {
    console.log("change detected", value, name);
    if (value === "on" && name === "highPass") {
      app.connectHighPassFilter();
    }
    if (value === "on" && name === "distortion") {
      app.connectDistortion();
    }
    if (value === "on" && name === "reverb") {
      app.connectReverb();
    }
  },
  connectHighPassFilter: () => {
    app.source.connect(app.highPassFilter);
    app.highPassFilter.type = "highpass";
    app.highPassFilter.frequency.setValueAtTime(5000, app.audioCtx.currentTime);
    app.highPassFilter.connect(app.streamDestination);
  },
  connectDistortion: () => {
    app.source.connect(app.distortion);
    function makeDistortionCurve(amount) {
      var k = typeof amount === "number" ? amount : 60,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for (; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    }
    app.distortion.curve = makeDistortionCurve(200);
    app.distortion.oversample = "2x";
    app.distortion.connect(app.streamDestination);
  },
  connectReverb: async () => {
    let reverb = await app.createReverb();
    app.source.connect(reverb);
    reverb.connect(app.streamDestination);
  },
  createReverb: async () => {
    // load impulse response from file
    let response = await fetch("http://localhost:8080/public/audio/bigHall.wav");
    let arraybuffer = await response.arrayBuffer();
    app.convolver.buffer = await app.audioCtx.decodeAudioData(arraybuffer);
    return app.convolver;
  },
  listenToInputValueChange: () => {
    let radioButtons = document.querySelectorAll(".radio-button");
    radioButtons.forEach((radioButton) => {
      app.inputSelected = radioButton.addEventListener("change", (e) => {
        app.value = e.target.value;
        app.name = e.target.name;
        app.inputValueChange(app.value, app.name);
      });
    });
  },
  listenToButtonClick: () => {
    app.recordButton.addEventListener("click", (evt) => {
      app.startRecord();
    });
    app.stopButton.addEventListener("click", (evt) => {
      app.stopRecord();
    });
  },
};

document.addEventListener("DOMContentLoaded", app.init);
