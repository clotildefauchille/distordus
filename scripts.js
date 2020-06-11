let recordButton = document.getElementById("record")
var buttonsElement = document.getElementById('buttons')
var headerElement = document.getElementById("Welcome")
let stopButton = document.getElementById ("stop")

function changeButtonColor(button, backgroundColor, textColor) {
    button.style.backgroundColor = backgroundColor
    button.style.color = textColor
    return "poute"
}
function startRecord() {
    stopButton.disabled = false;
    recordButton.disabled = true;
    const result = changeButtonColor(recordButton, "red", "white")
    console.log("result: ", result)
}
function stopRecord() {
    changeButtonColor(recordButton, "transparent", "black")
    audioFileName()
    createElementAudioDisplay()
    stopButton.disabled = true;
    recordButton.disabled = false;
    
}
function createElementAudioDisplay() {
    var audioElement = document.createElement('audio')
    audioElement.setAttribute("controls", true)
    document.body.insertBefore(audioElement, buttonsElement);
}
function audioFileName() {
    var newTitle= document.createTextNode("mon titre bip audio")
    var textEdit = document.createElement("div")
    textEdit.appendChild(newTitle)
    document.body.insertBefore(textEdit, buttonsElement);
}

