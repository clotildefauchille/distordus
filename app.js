var app = {
  //TODO bouton input stylesheet
  //TODO analyseur à taffer ligne deviens rouge au rec
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
    app.canvas = document.querySelector('.visualizer');
    app.canvasCtx = app.canvas.getContext("2d");
    app.intendedWidth = document.querySelector('.wrapper').clientWidth;
    app.canvas.setAttribute('width', intendedWidth);
    app.drawVisual;
    app.audioFileContainer = document.getElementById("audioFileContainer");
    app.highPassButtonOff = document.getElementById("highPassOff");
    app.highPassButtonOn = document.getElementById("highPassOn");
    app.distortionButtonOn = document.getElementById("distortionOn");
    app.distortionButtonOff = document.getElementById("distortionOff");
    app.reverbButtonOn = document.getElementById("reverbOn");
    app.reverbButtonOff = document.getElementById("reverbOff");
    app.getEffect();
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

    //app.mic.disconnect(app.audioCtx.destination)

    //creation d'une sortie, destination audio
    app.streamDestination = app.audioCtx.createMediaStreamDestination();
    //creation d'un enregistreur
    app.mediaRecorder = new MediaRecorder(app.streamDestination.stream);
    app.highPassFilter = app.audioCtx.createBiquadFilter();
    app.distortion = app.audioCtx.createWaveShaper();
    app.convolver = app.audioCtx.createConvolver();
    app.gainNode = app.audioCtx.createGain();
    app.analyser = app.audioCtx.createAnalyser();
    app.analyseAudio();

    //connecte la source à la sortie
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
      //console.log("app.audioURL in onstop", app.audioURL);
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
    //app.source.connect(app.audioCtx.destination)
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
  getEffect: () => {
    if ((app.highPassButtonOn.checked) && (!app.reverbButtonOn.checked) && (!app.distortionButtonOn.checked)) {
      console.log('hey hipasson only')
      app.convolver.disconnect();
      app.distortion.disconnect();
      app.connectHighPassFilter();
    }
    if ((app.reverbButtonOn.checked) && (!app.distortionButtonOn.checked) && (!app.highPassButtonOn.checked)) {
      console.log('hey revOn only')
      app.highPassFilter.disconnect();
      app.distortion.disconnect();
      app.connectReverb();
    }
    if ((app.distortionButtonOn.checked) && (!app.reverbButtonOn.checked) && (!app.highPassButtonOn.checked)) {
      console.log('hey distOn only')
      app.convolver.disconnect();
      app.highPassFilter.disconnect();
      app.connectDistortion();
    }
    if ((!app.distortionButtonOn.checked) && (!app.reverbButtonOn.checked) && (!app.highPassButtonOn.checked)) {
      console.log('no effect');
      app.highPassFilter.disconnect();
      app.distortion.disconnect();
      app.convolver.disconnect();
      app.connectToNoEffect();
    }
  },
  analyseAudio: () => {
    app.source.connect(app.analyser);
    app.analyser.connect(app.streamDestination);
    app.visualizeAnalizer();
  },
  visualizeAnalizer: () => {
    WIDTH = app.canvas.width;
    HEIGHT = app.canvas.height;
    app.analyser.fftSize = 2048;
    var bufferLength = app.analyser.fftSize;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    app.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    var draw = function () {
      drawVisual = requestAnimationFrame(draw);
      app.analyser.getByteTimeDomainData(dataArray);
      app.canvasCtx.fillStyle = '#90a4ae';
      app.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      app.canvasCtx.lineWidth = 2;
      app.canvasCtx.strokeStyle = '#a7ffeb';
      app.canvasCtx.beginPath();
      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;
      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT / 2;
        if (i === 0) {
          app.canvasCtx.moveTo(x, y);
        } else {
          app.canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      app.canvasCtx.lineTo(app.canvas.width, app.canvas.height / 2);
      app.canvasCtx.stroke();
    };
    draw();
  },
  connectToNoEffect: () => {
    console.log("conection function");
    app.source.connect(app.gainNode);
    //monitoring
    app.source.connect(app.audioCtx.destination);
    app.gainNode.gain.value = 1;
    app.gainNode.connect(app.streamDestination);
  },
  connectHighPassFilter: () => {
    app.source.connect(app.highPassFilter);
    //monitoring
    app.highPassFilter.connect(app.audioCtx.destination)
    app.highPassFilter.type = "highpass";
    app.highPassFilter.frequency.setValueAtTime(5000, app.audioCtx.currentTime);
    app.highPassFilter.connect(app.gainNode);
    //console.log('hey gain', app.gainNode)
    app.gainNode.gain.value = 5;
    app.gainNode.connect(app.streamDestination);
  },
  connectDistortion: () => {
    app.source.connect(app.distortion);
    app.distortion.connect(app.gainNode);
    app.gainNode.gain.value = 0.3;
    //pour avoir effect dans monitoring
    app.gainNode.connect(app.audioCtx.destination)

    function makeDistortionCurve(amount) {
      var k = typeof amount === "number" ? amount : 50,
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
    app.gainNode.connect(app.streamDestination);
  },
  connectReverb: async () => {
    let reverb = await app.createReverb();
    app.source.connect(reverb);
    //monitoring
    reverb.connect(app.audioCtx.destination)
    reverb.connect(app.gainNode);
    app.gainNode.gain.value = 2;
    app.gainNode.connect(app.streamDestination);
  },
  createReverb: async () => {
    // load impulse response from file
    //TODO try catch
    let response = await fetch("http://localhost:8080/public/audio/bigHall.wav");
    let arraybuffer = await response.arrayBuffer();
    app.convolver.buffer = await app.audioCtx.decodeAudioData(arraybuffer);
    return app.convolver;
  },
  listenToInputValueChange: () => {
    let radioButtons = document.querySelectorAll(".radio-button");
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener("change", (e) => {
        app.getEffect();
      })
    });
  },
  listenToButtonClick: () => {
    //TODO faire un bouton qui clignote la 1ere fois vec monitoring
    app.recordButton.addEventListener("click", (evt) => {
      app.startRecord();
    });
    app.stopButton.addEventListener("click", (evt) => {
      app.stopRecord();
    });
  },
};

document.addEventListener("DOMContentLoaded", app.init);
