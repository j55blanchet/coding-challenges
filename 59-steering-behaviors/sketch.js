/// <reference path="p5.global.d.ts" />

let currentText = "Happy BDay Gabe!";
let currentFontSize = 130;
var fleeRadius = 50;
var explosivePower = 100;

let desiredFR = 60;

var font;

var vehicles = [];

function preload() {
    font = loadFont('zcool-kuaile.ttf');
}

function setup() {
    createCanvas(1200, 400);
    frameRate(desiredFR);
    textAlign(CENTER, CENTER);

    let textP = createP("Canvas Text");
    let textInput = createInput(currentText);
    textInput.input(textTyped);
    textInput.parent(textP);

    let fontSizeP = createP("Font Size");
    let fontSizeSlider = createSlider(128, 300, currentFontSize);
    fontSizeSlider.input(textSizeSliderChanged);
    fontSizeSlider.parent(fontSizeP);
    
    let fleeRadiusP = createP("Flee Radius");
    let fleeRadiusSlider = createSlider(25, 150, 50);
    fleeRadiusSlider.input(changeFleeRadius);
    fleeRadiusSlider.parent(fleeRadiusP);

    let explosivePowerP = createP("Click Explosive Power");
    let explosivePowerSlider = createSlider(50, 500, 100);
    explosivePowerSlider.input(changeExplosivePower);
    explosivePowerSlider.parent(explosivePowerP);

    let buttonsDiv = createDiv();
    let randomizeButton = createButton("Randomize!");
    randomizeButton.mousePressed(randomize);
    randomizeButton.parent(buttonsDiv);
    let recolorButton = createButton("Recolor!");
    recolorButton.mousePressed(recolorVehicles);
    recolorButton.parent(buttonsDiv);

    createP("Try scaring away the dots or dropping bombs with your mouse click!");

    createVehicleFleet(currentText);
}

function draw() {
    colorMode(RGB);
    fill(0, 0, 0, 10);
    noStroke();
    rect(0, 0, width, height);

    for(let v of vehicles) {
        v.behaviors();
        v.update();
        v.display();

    }

    if (frameCount % 35 === 0) { advanceFleet(); }
}

function mouseClicked() {
    let m = createVector(mouseX, mouseY);
    let maxExplosiveForce = explosivePower / 2.5;
    for(let v of vehicles) {
        let explosionForce = p5.Vector.sub(v.pos, m);
        let d = explosionForce.mag() * 0.05;
        explosionForce.setMag(explosivePower / (d*d));
        explosionForce.limit(maxExplosiveForce);
        v.applyForce(explosionForce);
    }
}

function textTyped() {
    currentText = this.value();
    createVehicleFleet();
}

function textSizeSliderChanged() {
    currentFontSize = this.value();
    createVehicleFleet();
}

function changeFleeRadius() {
    fleeRadius = this.value();
}

function changeExplosivePower() {
    explosivePower = this.value();
}

function randomize() {
    let specifiers = vehicles.map(
        (v, i) => {
            return {
                tar: v.target,
                i: i
            }   
        });

    shuffleArray(specifiers);


    for(let i = 0; i < vehicles.length; i++) {
        vehicles[i].target = specifiers[i].tar;
        vehicles[i].i = specifiers[i].i;
    }
    
    vehicles.sort((a, b) => a.i - b.i);
}

function recolorVehicles() {
    for(let v of vehicles) {
        v.mapHue(v.pos.x);
    }
}

function advanceFleet() {
    if (vehicles.length <= 0) {
        return;

    }
    let firstTarget = vehicles[0].target;

    for(let i = 0; i < vehicles.length; i++) {
        let ni = (i + 1) % vehicles.length;
        if (i+1 >= vehicles.length) {
            vehicles[i].target = firstTarget;
        } else {
            vehicles[i].target = vehicles[i+1].target;
        }
    }
}

function createVehicleFleet() {

    // A very cool funtion on the p5.Font library.
    // Returns an array of objects with alpha, x, and y
    let points = font.textToPoints(currentText, 10, 200, currentFontSize);

    // Create any missing points
    if (vehicles.length < points.length) {
        for(let i = vehicles.length; i < points.length; i++) {
            let pt = points[i];
            let v = new Vehicle(pt.x, pt.y);
            vehicles.push(v);
            v.mapHue(pt.x);
        }
    }

    // Delete extraneous vehicles
    vehicles.splice(points.length);

    // Set destination of points
    for(let i = 0; i < points.length; i++) {
        let pt = points[i];
        let v = vehicles[i];
        v.target = createVector(pt.x, pt.y);
        v.r = map(currentFontSize, 12, 256, 1, 8);
    }

}


// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }