let recordButton = document.getElementById("record")
var buttonsElement = document.getElementById('buttons')
var headerElement = document.getElementById("Welcome")
let stopButton = document.getElementById("stop")
let selectorFilter = document.getElementById("audio-filters")
let endOfDoc = document.getElementById('end')
let chunks = []
let constraints = { audio: true }
let audioCreateContainers = async function(stream) {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)()
    var streamDestination = audioCtx.createMediaStreamDestination()
    const mediaRecorder = new MediaRecorder(streamDestination.stream)
    let startRecord = function() {
        mediaRecorder.start()
        stopButton.disabled = false;
        recordButton.disabled = true;
        const resultofchangeButtonColorCall = changeButtonColor(recordButton, "#b61827", "white")
        console.log("result", resultofchangeButtonColorCall)
    }
    recordButton.onclick = startRecord;
    mediaRecorder.ondataavailable = function(blobevent) {
        chunks.push(blobevent.data);
    }
    stopButton.onclick = function() {
        mediaRecorder.stop()
        changeButtonColor(recordButton, "rgb(255, 134,124, .4)", "black")
        stopButton.disabled = true;
        recordButton.disabled = false;

    }
    mediaRecorder.onstop = function(e) {
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        createElementAudioDisplay(audioURL);
        audioFileName();
    }

    var distortion = audioCtx.createWaveShaper();
    var source = audioCtx.createMediaStreamSource(stream);
    var biquadFilter = audioCtx.createBiquadFilter();
    var biquadFilter2 = audioCtx.createBiquadFilter();
    var analyser = audioCtx.createAnalyser();
    // analyser.minDecibels = -90;
    // analyser.maxDecibels = -10;
    // analyser.smoothingTimeConstant = 0.85;


    // set up canvas context for visualizer
    var canvas = document.querySelector('.visualizer');
    var canvasCtx = canvas.getContext("2d");
    var intendedWidth = document.querySelector('.wrapper').clientWidth;
    canvas.setAttribute('width', intendedWidth);
    var visualSelect = document.getElementById("audio-filters");
     var drawVisual;

    function analyseAudio(){
        source.connect(analyser);
        analyser.connect(streamDestination);
        visualize();
    }
    function visualize() {
        WIDTH = canvas.width;
        HEIGHT = canvas.height;


        var visualSetting = visualSelect.value;
        console.log(visualSetting);

        if (visualSetting === "distordus") {
            analyser.fftSize = 2048;
            var bufferLength = analyser.fftSize;
            console.log(bufferLength);
            var dataArray = new Uint8Array(bufferLength);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            var draw = function () {

                drawVisual = requestAnimationFrame(draw);

                analyser.getByteTimeDomainData(dataArray);

                canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

                canvasCtx.beginPath();

                var sliceWidth = WIDTH * 1.0 / bufferLength;
                var x = 0;

                for (var i = 0; i < bufferLength; i++) {

                    var v = dataArray[i] / 128.0;
                    var y = v * HEIGHT / 2;

                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(canvas.width, canvas.height / 2);
                canvasCtx.stroke();
            };

            draw();

        } else if (visualSetting == "frequencybars") {
            analyser.fftSize = 256;
            var bufferLengthAlt = analyser.frequencyBinCount;
            console.log(bufferLengthAlt);
            var dataArrayAlt = new Uint8Array(bufferLengthAlt);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            var drawAlt = function () {
                drawVisual = requestAnimationFrame(drawAlt);

                analyser.getByteFrequencyData(dataArrayAlt);

                canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
                var barHeight;
                var x = 0;

                for (var i = 0; i < bufferLengthAlt; i++) {
                    barHeight = dataArrayAlt[i];

                    canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                    x += barWidth + 1;
                }
            };

            drawAlt();

        } else if (visualSetting == "off") {
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.fillStyle = "red";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        }

    }
    function connectHighPassFilter() {
        source.connect(biquadFilter);
        biquadFilter.type = "highpass";
        biquadFilter.frequency.setValueAtTime(6000, audioCtx.currentTime);
        biquadFilter.connect(biquadFilter2);
        biquadFilter2.type = "peaking";
        biquadFilter2.frequency.setValueAtTime(7000, audioCtx.currentTime);
        biquadFilter2.Q = 20;
        biquadFilter2.gain.setValueAtTime(30, audioCtx.currentTime);
        biquadFilter2.connect(streamDestination);
    }

    function connectDistordusFilter() {
        source.connect(distortion);

        function makeDistortionCurve(amount) {
            var k = typeof amount === 'number' ? amount : 60,
                n_samples = 44100,
                curve = new Float32Array(n_samples),
                deg = Math.PI / 180,
                i = 0,
                x;
            for (; i < n_samples; ++i) {
                x = i * 2 / n_samples - 1;
                curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
            }
            return curve;
        }
        distortion.curve = makeDistortionCurve(800);
        distortion.oversample = '4x';
        distortion.connect(streamDestination);

    }
    async function createReverb() {
        let convolver = audioCtx.createConvolver();
        let reader = new FileReader()
        let file = getEmulatorFile()
            // equivalent aux 3 lignes suivantes 
            // readEmulatorFile (file).then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer)).then(buffer=>{
            //     convolver.buffer=buffer
            //     return convolver
            // })
        let arrayBuffer = await readEmulatorFile(file)
        convolver.buffer = await audioCtx.decodeAudioData(arrayBuffer);

        return convolver;

    }

    var elementThatIsNamedSelect = document.getElementById("audio-filters");
    connectDistordusFilter()
    analyseAudio()
    elementThatIsNamedSelect.addEventListener('change', async function() {
        var audioFilterSelected = elementThatIsNamedSelect.options[elementThatIsNamedSelect.selectedIndex].value;
        if (audioFilterSelected === "distordus") {
            biquadFilter2.disconnect()
            connectDistordusFilter()
        } else if (audioFilterSelected === "HighPass") {
            distortion.disconnect()
            connectHighPassFilter()
        } else if (audioFilterSelected === "reverb") {
            let reverb = await createReverb()
            distortion.disconnect()
            biquadFilter2.disconnect()
            source.connect(reverb)
            reverb.connect(streamDestination)

        }
    });
}


function changeButtonColor(button, backgroundColor, textColor) {
    button.style.backgroundColor = backgroundColor
    button.style.color = textColor
    return "poute"
}

function createElementAudioDisplay(audioURL) {
    var audioElement = document.createElement('audio')
    audioElement.setAttribute("controls", true)
    audioElement.src = audioURL
    audioElement.className = "audio-display-style"
        //audioElement.style.backgroundColor = "rgb(255, 0, 0)"
    document.body.insertBefore(audioElement, endOfDoc);
}

function audioFileName() {
    let audioTitle = prompt("enter your audio file name", "mon titre audio");
    var newTitle = document.createTextNode(audioTitle);
    var textEdit = document.createElement("div")
    textEdit.appendChild(newTitle)
    document.body.insertBefore(textEdit, endOfDoc);
}
let onError = function(err) {
    console.log('The following error occured: ' + err);
}
async function readEmulatorFile(file) {
    return new Promise((resolve) => {
        var reader = new FileReader();
        reader.onload = function(evt) {
            resolve(evt.target.result);
        };
        reader.readAsArrayBuffer(file);

    })
}

function getEmulatorFile() {
    var reverbFile = document.getElementById("reverb-file")
    return reverbFile.files[0]
}

let onSuccess = function(stream) { audioCreateContainers(stream) }
navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError)

