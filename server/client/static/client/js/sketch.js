/**
 * @since 06.12.2019
 * @author Botond Hegyi
 */

let imageDatas = [];

let canvasSize = Math.round(Math.sqrt(1000)) * 50;

let myWindowWidth;
let myWindowHeight;

let zoom = 500;
let posX = 0;
let posY = 0;

let img;
let img_loaded = false;

const BACK_END_URL = 'http://127.0.0.1:8000';

function setup() {
    zoom = canvasSize;
    myWindowWidth = windowWidth * 80 / 100;
    myWindowHeight = windowHeight - 50;
    createCanvas(myWindowWidth, myWindowHeight, WEBGL);

    document.getElementById('loadBtn').onclick = () => {
        const t0 = performance.now();
        httpGet(BACK_END_URL + '/big', data => {
            loadImage(BACK_END_URL + data, img => {
                this.img = img;
                this.img_loaded = true;
            })
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

function mouseClicked() {
    if (this.img_loaded) {
        if ((mouseX - myWindowWidth/2) < zoom/2 + posX && mouseX - myWindowWidth/2 > -zoom/2 + posX
            && (mouseY - myWindowHeight/2) < zoom/2 + posY && (mouseY - myWindowHeight/2) > -zoom/2 + posY) {
                print('clicked on image')
                print(mouseX - myWindowWidth/2, mouseY - myWindowHeight/2)
        }
    }
}

function draw() {
    if (focused) {
        background(0);
        keyDown();
        // camera(posX, posY, , posX, posY, 0, 0, 1, 0);
        imageMode(CENTER);
        if (this.img_loaded) {
            image(this.img, posX, posY, zoom, zoom);
        }
    }
}
