let recordButton = document.getElementById("record")
var buttonsElement = document.getElementById('buttons')
var headerElement = document.getElementById("Welcome")
let stopButton = document.getElementById("stop")
let chunks = []
let constraints = { audio: true }
let audioCreateContainers = function (stream) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    var streamDestination = audioCtx.createMediaStreamDestination()
    const mediaRecorder = new MediaRecorder(streamDestination.stream)
    let startRecord = function () {
        mediaRecorder.start()
        stopButton.disabled = false;
        recordButton.disabled = true;
        const resultofchangeButtonColorCall = changeButtonColor(recordButton, "red", "white")
        console.log("result", resultofchangeButtonColorCall)
    }
    recordButton.onclick = startRecord;
    mediaRecorder.ondataavailable = function (blobevent) {
        chunks.push(blobevent.data);
    }
    stopButton.onclick = function () {
        mediaRecorder.stop()
        changeButtonColor(recordButton, "transparent", "black")
        stopButton.disabled = true;
        recordButton.disabled = false;

    }
    mediaRecorder.onstop = function (e) {
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        createElementAudioDisplay(audioURL)
        audioFileName()
    }
    var biquadFilter = audioCtx.createBiquadFilter()
    var source = audioCtx.createMediaStreamSource(stream)
    source.connect(biquadFilter)
    biquadFilter.type = "peaking";
    biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    biquadFilter.Q = 3
    biquadFilter.gain.setValueAtTime(35, audioCtx.currentTime);
    biquadFilter.connect(streamDestination)
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
    document.body.insertBefore(audioElement, buttonsElement);
}
function audioFileName() {
    var newTitle = document.createTextNode("mon titre bip audio")
    var textEdit = document.createElement("div")
    textEdit.appendChild(newTitle)
    document.body.insertBefore(textEdit, buttonsElement);
}
let onError = function (err) {
    console.log('The following error occured: ' + err);
}
let onSuccess = function (stream) { audioCreateContainers(stream) }
navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError)
