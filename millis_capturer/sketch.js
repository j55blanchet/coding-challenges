/// <reference path="p5.global.d.ts" />

function millis() {
    return Math.floor(new Date().getTime());
}

var startingTime;
var keyTimestamps = {};

function setup() {
    createCanvas(windowWidth, windowHeight);    
    frameRate(60);
}

function drawHomeScreen() {
    background(230);
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Press a key whenever\nyou want to record a time.", width / 2, height / 2);
}


function draw() {
    if (!startingTime) {
        drawHomeScreen();
        return;
    }

    background(230);
    textSize(15);
    textAlign(RIGHT, TOP);
    let elapsedTime = (millis() - startingTime) / 1000;
    text(nf(elapsedTime, 1, 2), width - 20, 20);

    textAlign(LEFT, TOP);
    text("use getStrings() in console to get recordings", 10, 40);
    let y = 70;
    for(let k of Object.keys(keyTimestamps)) {
        
        let timesString = keyTimestamps[k].map(t => Math.round(t) + "").join(", ");
        text(`${k}: ${timesString}`, 10, y);
        y += 30;
    }
}
function keyPressed() {

    if (!startingTime) {
        background(255);
        startingTime = millis();
    }

    let k = key.toString();
    if (!k) { return; }

    if (!keyTimestamps[k]) {
        keyTimestamps[k] = [];
    }

    keyTimestamps[k].push(millis() - startingTime);
}



function drawKeyTimes() {


}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function getStrings() {
    for(let k of Object.keys(keyTimestamps)) {
        
        let timesString = keyTimestamps[k].map(t => Math.round(t) + "").join(", ");
        console.log(`${k}: ${timesString}`);
    }
}