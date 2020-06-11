let recordButton = document.getElementById("record")
var buttonsElement = document.getElementById('buttons')
var headerElement = document.getElementById("Welcome")
function changeButtonColor(button, backgroundColor, textColor) {
    button.style.backgroundColor = backgroundColor
    button.style.color = textColor
    return "poute"
}
function redButtonRecord() {
    const result = changeButtonColor(recordButton, "red", "white")
    console.log("result: ", result)
}
function stopRecord() {
    changeButtonColor(recordButton, "transparent", "black")
    createElementAudioDisplay()
    audioFileName()
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
function IdidIt() {
    var newPtitle= document.createTextNode("clotte assure")
    var textEdit2 = document.createElement("p")
    var prouteButton = document.createElement("button")
    var textprouteButton = document.createTextNode ("proute");

    textEdit2.appendChild(newPtitle)
    textEdit2.appendChild(prouteButton)
    prouteButton.appendChild(textprouteButton)
    document.body.insertBefore(textEdit2, headerElement)
    document.body.insertBefore(prouteButton, headerElement)
}
IdidIt()
