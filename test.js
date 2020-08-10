class Rectangle {
    constructor(hauteur, largeur) {
        this.hauteur = hauteur;
        this.largeur = largeur;
    }
    calcArea() {
        return this.largeur * this.hauteur;

    }

    const carre = new Rectangle(10, 10);

    console.log(carre.calcArea);