/**
 * @since 06.12.2019
 * @author Botond Hegyi
 */

let imageDatas = [];

let canvasSize = Math.round(Math.sqrt(1000)) * 50;

let myWindowWidth;
let myWindowHeight;

let zoom = 1000;
let posX = 0;
let posY = 0;

let img;

const BACK_END_URL = 'http://127.0.0.1:8000';

function setup() {
    zoom = canvasSize;
    myWindowWidth = windowWidth * 80 / 100;
    myWindowHeight = windowHeight - 50;
    createCanvas(myWindowWidth, myWindowHeight, WEBGL);

    document.getElementById('loadBtn').onclick = () => {
        const t0 = performance.now();
        loadImage(BACK_END_URL + '/big', img => {
            this.img = img;
        })
        const t1 = performance.now();
        print(`Loading images images took: ${(t1 - t0)} milliseconds.`);
    };

    document.getElementById('rndBtn').onclick = () => {
        const t0 = performance.now();
        loadImage(BACK_END_URL + '/random', img => {
            this.img = img;
        })
        const t1 = performance.now();
        print(`Random order images took: ${(t1 - t0)} milliseconds.`);
    };

    document.getElementById('revBtn').onclick = () => {
        const t0 = performance.now();
        loadImage(BACK_END_URL + '/reverse', img => {
            this.img = img;
        })
        const t1 = performance.now();
        print(`Reverse order images took: ${(t1 - t0)} milliseconds.`);
    };

    // diplay the images on a histogram, grouped by dates
    document.getElementById('histBtn').onclick = () => {
        const t0 = performance.now();
        loadImage(BACK_END_URL + '/histogram', img => {
            this.img = img;
        })
        const t1 = performance.now();
        print(`Histogram images took: ${(t1 - t0)} milliseconds.`);
    };
}

function mouseWheel(event) {
    const zoomSpeed = 20;
    if (event.delta < 0) {
        zoom -= zoomSpeed;
    }
    if (event.delta > 0) {
        zoom += zoomSpeed;
    }
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        posX += 50;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        posX -= 50;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        posY += 50;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        posY -= 50;
    }
}

function draw() {
    background(0);
    keyDown();
    camera(posX, posY, zoom*2, posX, posY, 0, 0, 1, 0);
    imageMode(CENTER);
    if (this.img !== undefined) {
        print('rajs')
        image(this.img, 0, 0);
    }
}
