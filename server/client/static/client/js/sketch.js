/**
 * @since 06.12.2019
 * @author Botond Hegyi
 */

let imageDatas = [];

let myWindowWidth;
let myWindowHeight;

let zoom = 500;
let posX = 0;
let posY = 0;

let img;
let img_loaded = false;

const BACK_END_URL = 'http://127.0.0.1:8000';

/**
 * @param {p5.Image} rowImg - row from the big image 
 * @param {int} rowNr - row from the big image 
 * @param {int} length - of the row
 */
function splitRowImage(rowImg, rowNr, length) {
    for (let i = 0; i < length; i++) {
        const img = rowImg.get(50*i, 0, 50, 50);
    }
}

/**
 * @param {p5.Image} bigImg - the image we want to split 
 */
function splitImage(bigImg) {
    const numberOfRows = bigImg.width / 50;
    for (let i = 0; i < numberOfRows; i++) {
        const rowImg = bigImg.get(0, 50*i, 50, 50*numberOfRows);
        setTimeout(() => splitRowImage(rowImg, i, numberOfRows), 0);
        // print(rowImg.width, rowImg.height)
    }
}

// load the images from the back-end
function loadImages() {
    const t0 = performance.now();
    document.getElementById('loading').style.visibility = 'visible';
    httpGet(BACK_END_URL + '/big', data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.img_loaded = true;
            setTimeout(() => splitImage(img), 0);

            const t1 = performance.now();
            print(`Loading images images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            document.getElementById('loading').style.visibility = 'hidden';
        })
    })
}

// randomize the images
function randomImages() {
    const t0 = performance.now();
    document.getElementById('loading').style.visibility = 'visible';
    httpGet(BACK_END_URL + '/random', data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.img_loaded = true;

            const t1 = performance.now();
            print(`Random order images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            document.getElementById('loading').style.visibility = 'hidden';
        })
    })
}

// sort the images in reverse order on the server
function reverseImages() {
    const t0 = performance.now();
    document.getElementById('loading').style.visibility = 'visible';
    httpGet(BACK_END_URL + '/reverse', data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.img_loaded = true;

            const t1 = performance.now();
            print(`Reverse order images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            document.getElementById('loading').style.visibility = 'hidden';
        })
    })
}

// diplay the images on a histogram, grouped by dates
function histogram() {
    const t0 = performance.now();
    document.getElementById('loading').style.visibility = 'visible';
    httpGet(BACK_END_URL + '/histogram', data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.img_loaded = true;

            const t1 = performance.now();
            print(`Histogram images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            document.getElementById('loading').style.visibility = 'hidden';
        })
    })
}

function setup() {
    myWindowWidth = windowWidth * 80 / 100;
    myWindowHeight = windowHeight - 50;
    createCanvas(myWindowWidth, myWindowHeight, WEBGL);
}

function mouseWheel(event) {
    const zoomSpeed = 20;
    if (event.delta < 0) {
        zoom += zoomSpeed;
    }
    if (event.delta > 0) {
        zoom -= zoomSpeed;
    }
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        posX -= 50;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        posX += 50;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        posY -= 50;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        posY += 50;
    }
}

function mouseClicked() {
    if (mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0) {
        return;
    }
    if (this.img_loaded) {
        if ((mouseX - myWindowWidth / 2) < zoom / 2 + posX && mouseX - myWindowWidth / 2 > -zoom / 2 + posX
            && (mouseY - myWindowHeight / 2) < zoom / 2 + posY && (mouseY - myWindowHeight / 2) > -zoom / 2 + posY) {
            print('clicked on image')
            print(mouseX - myWindowWidth / 2, mouseY - myWindowHeight / 2)
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
