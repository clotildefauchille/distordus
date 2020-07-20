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
        const resultofchangeButtonColorCall = changeButtonColor(recordButton, "red", "white")
        console.log("result", resultofchangeButtonColorCall)
    }
    recordButton.onclick = startRecord;
    mediaRecorder.ondataavailable = function(blobevent) {
        chunks.push(blobevent.data);
    }
    stopButton.onclick = function() {
        mediaRecorder.stop()
        changeButtonColor(recordButton, "transparent", "black")
        stopButton.disabled = true;
        recordButton.disabled = false;

    }
    mediaRecorder.onstop = function(e) {
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        createElementAudioDisplay(audioURL)
        audioFileName()
    }

    var distortion = audioCtx.createWaveShaper()
    var source = audioCtx.createMediaStreamSource(stream)
    var biquadFilter = audioCtx.createBiquadFilter()
    var biquadFilter2 = audioCtx.createBiquadFilter()

    function connectHighPassFilter() {
        source.connect(biquadFilter)
        biquadFilter.type = "highpass";
        biquadFilter.frequency.setValueAtTime(6000, audioCtx.currentTime);
        biquadFilter.connect(biquadFilter2)
        biquadFilter2.type = "peaking";
        biquadFilter2.frequency.setValueAtTime(7000, audioCtx.currentTime);
        biquadFilter2.Q = 20
        biquadFilter2.gain.setValueAtTime(30, audioCtx.currentTime);
        biquadFilter2.connect(streamDestination)
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
    var newTitle = document.createTextNode("mon titre audio")
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

function dessiner() {
    var canevas = document.getElementById('tutoriel');
    if (canevas.getContext) {
        var ctx = canevas.getContext('2d');

        var rectangle = new Path2D();
        ctx.fillStyle = 'rgb(0,0, 0)'
        rectangle.rect(10, 10, 50, 50);

        var cercle = new Path2D();
        cercle.moveTo(125, 35);
        cercle.arc(100, 35, 25, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb(255, 0, 0)';


        ctx.fill(rectangle);
        ctx.fill(cercle);

    }
}
dessiner()