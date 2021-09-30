var app = {
  //TODO analyseur à taffer ligne deviens rouge au rec
  //TODO pouvoir chainer les effects
  //TODO enlever rec de voix sans effet 
  //TODO pouvoir telecharger et partager le fichier audio crée
  //TODO ajouter compresseur fixe et pouvoir le changer
  //TODO creer un bouton qui coupe ou non le monitoring
  //What’s a buffer? In generic terms, a buffer is a region of physical memory used to temporarily store data while it is being moved from one place to another.
  init: () => {
    //l'utilisateur autorise ou non l'enregistrement
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(app.onSuccess, app.onError);
    app.chunks = [];
    app.recordButton = document.getElementById("record");
    app.stopButton = document.getElementById("stop");
    app.listenToButtonClick();
    app.listenToSwitch();
    app.canvas = document.querySelector('.visualizer');
    app.canvasCtx = app.canvas.getContext("2d");
    app.intendedWidth = document.querySelector('.wrapper').clientWidth;
    app.canvas.setAttribute('width', app.intendedWidth);
    app.drawVisual;
    app.audioFileContainer = document.getElementById("audioFileContainer");
    app.highPassButton = document.getElementById("highPass");
    app.distortionButton = document.getElementById("distortion");
    app.reverbButton = document.getElementById("reverb");
    app.rec = document.getElementById("record");
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
    //creation d'une sortie, destination audio
    app.streamDestination = app.audioCtx.createMediaStreamDestination();
    //creation d'un enregistreur
    app.mediaRecorder = new MediaRecorder(app.streamDestination.stream);
    //pour un eq parametrique utiliser 'peaking' type
    app.highPassFilter = app.audioCtx.createBiquadFilter();
    app.distortion = app.audioCtx.createWaveShaper();
    app.convolver = app.audioCtx.createConvolver();
    app.highPassGain = app.audioCtx.createGain();
    app.reverbGain = app.audioCtx.createGain();
    app.distortionGain = app.audioCtx.createGain();
    app.analyser = app.audioCtx.createAnalyser();
    app.analyseAudio();

  },
  pushBlob: () => {
    app.mediaRecorder.ondataavailable = function (e) {
      app.chunks.push(e.data);
      console.log("chunks", app.chunks, e.data);
    };
  },
  createBlob: () => {
    app.mediaRecorder.onstop = function (e) {
      app.blob = new Blob(app.chunks, { type: "audio/ogg; codecs=opus" });
      app.chunks = [];
      app.audioURL = window.URL.createObjectURL(app.blob);
      //console.log("app.audioURL in onstop", app.audioURL);
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
    app.changeButtonColor(app.recordButton, "#ef534f", "white");
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
    if (audioTitle === null) {
      return; //break out of the function early
    } else {
      let newTitle = document.createTextNode(audioTitle);
      let textEdit = document.createElement("div");
      textEdit.appendChild(newTitle);
      textEdit.className = "audiofile-title";
      document.body.insertBefore(textEdit, app.audioFileContainer);
      app.createElementAudioDisplay(app.audioURL);
    }

  },
  getEffect: async () => {
    if ((app.highPassButton.checked) && (!app.reverbButton.checked) && (!app.distortionButton.checked)) {
      console.log('hey hipass only')
      app.reverb.disconnect();
      app.reverbGain.disconnect();
      app.distortionGain.disconnect();

      app.connectHighPassFilter();
      app.source.connect(app.highPassFilter);
      app.highPassFilter.connect(app.highPassGain);
      app.highPassGain.connect(app.streamDestination);
      //monitoring
      app.highPassGain.connect(app.audioCtx.destination)
    }
    if ((app.reverbButton.checked) && (!app.distortionButton.checked) && (!app.highPassButton.checked)) {
      console.log('hey revOn only');
      app.distortionGain.disconnect();
      app.highPassGain.disconnect();

      await app.connectReverb();

      app.source.connect(app.reverb);
      app.reverb.connect(app.reverbGain);
      app.reverbGain.connect(app.streamDestination);
      //monitoring
      app.reverb.connect(app.audioCtx.destination)
    }
    if ((app.distortionButton.checked) && (!app.reverbButton.checked) && (!app.highPassButton.checked)) {
      console.log('hey distOn only')
      app.highPassGain.disconnect();
      app.reverbGain.disconnect();

      app.connectDistortion();
      app.source.connect(app.distortion);
      app.distortion.connect(app.distortionGain);
      app.distortionGain.connect(app.streamDestination);
      
      //pour avoir effect dans monitoring
      app.distortionGain.connect(app.audioCtx.destination)
    }
    if ((!app.distortionButton.checked) && (!app.reverbButton.checked) && (!app.highPassButton.checked)) {
      console.log('no effect');
      app.distortionGain.disconnect();
      app.highPassGain.disconnect();
      app.distortionGain.disconnect();
      app.reverb.disconnect();
      app.highPassFilter.disconnect();
      app.distortion.disconnect();

      app.connectToNoEffect();
      app.source.connect(app.streamDestination);
      
      //monitoring
      //app.source.connect(app.audioCtx.destination);

    }
    if ((!app.distortionButton.checked) && (app.reverbButton.checked) && (app.highPassButton.checked)) {
      console.log('hey highPass + rev');

      app.source.connect(app.highPassFilter);
      app.highPassFilter.connect(app.highPassGain);
      app.connectHighPassFilter();
      await app.connectReverb();
      app.highPassGain.connect(app.reverb);
      app.reverb.connect(app.streamDestination);
      //monitoring
      app.reverb.connect(app.audioCtx.destination);

    }
    if ((app.distortionButton.checked) && (!app.reverbButton.checked) && (app.highPassButton.checked)) {
      console.log('hey disto + highpass');
      
      app.source.connect(app.highPassFilter);
      app.connectHighPassFilter();
      app.highPassFilter.connect(app.highPassGain);
      app.connectDistortion();
      app.highPassGain.connect(app.distortion);
      app.distortion.connect(app.distortionGain);
      app.distortionGain.connect(app.streamDestination);
      //monitoring
      app.distortionGain.connect(app.audioCtx.destination);

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
    //app.gainNode.gain.value = 1;
   // app.gainNode.connect(app.streamDestination);
  },
  connectHighPassFilter: () => {
    app.highPassFilter.type = "highpass";
    app.highPassFilter.frequency.setValueAtTime(2000, app.audioCtx.currentTime);
    app.highPassGain.gain.value = 4;
  },
  connectDistortion: () => {
    app.distortionGain.gain.value = 0.3;
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
  },
  connectReverb: async () => {
    app.reverb = await app.createReverb();
    app.reverbGain.gain.value = 3;
  },
  createReverb: async () => {
    // load impulse response from file
    //TODO try catch
    let response = await fetch("http://localhost:8080/public/audio/bigHall.wav");
    let arraybuffer = await response.arrayBuffer();
    app.convolver.buffer = await app.audioCtx.decodeAudioData(arraybuffer);
    return app.convolver;
  },
  listenToSwitch: () => {
    let checkButtons = document.querySelectorAll(".rocker-small");
    checkButtons.forEach((checkButton) => {
      checkButton.addEventListener("change", (e) => {
        app.getEffect();
      })
    });
  },
  listenToButtonClick: () => {
    //TODO faire un bouton qui clignote la 1ere fois vec monitoring
    app.recordButton.addEventListener("click", (evt) => {
      app.rec.classList.add("rec");
      app.startRecord();
    });
    app.stopButton.addEventListener("click", (evt) => {
      app.rec.classList.remove("rec");
      app.stopRecord();
    });
  },
};

document.addEventListener("DOMContentLoaded", app.init);
