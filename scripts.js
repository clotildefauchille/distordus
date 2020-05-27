document.body.onload = addElement;

function addElement () {
  // crée un nouvel élément div
  var newDiv = document.createElement("div");
  // et lui donne un peu de contenu
  var newContent = document.createTextNode('Hi there and greetings!');
  // ajoute le nœud texte au nouveau div créé
  newDiv.appendChild(newContent);
  
  // ajoute le nouvel élément créé et son contenu dans le DOM
  document.querySelector("header")
  let header =  document.querySelector("header")
document.body.insertBefore (newDiv, header)
}