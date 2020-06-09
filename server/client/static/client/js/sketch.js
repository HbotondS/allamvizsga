/**
 * @since 06.12.2019
 * @author Botond Hegyi
 */

let imageDatas = [];

let canvasWidth;
let canvasHeight;
let halfCanvasWidth;
let halfCanvasHeight;

let zoomHeight = 500;
let zoomWidth;
let posX = 0;
let posY = 0;

let img;
const ImageType = {Grid: 0, Histogram: 1};
let imgType;
let img_loaded = false;
let spinner;

const BACK_END_URL = 'http://127.0.0.1:8000';

/**
 * @param {p5.Image} rowImg - row from the big image 
 * @param {int} rowNr - row from the big image 
 * @param {int} length - of the row
 */
function splitRowImage(rowImg, rowNr, length) {
    for (let i = 0; i < length; i++) {
        const img = rowImg.get(50*i, 0, 50, 50);
        imageDatas.push(new ImageData(
            Math.floor((Math.random() * 10000)),
            null,
            img,
            {x: 50*i, y: 50*rowNr}
        ));
    }
}

/**
 * @param {p5.Image} bigImg - the image we want to split 
 */
function splitImage(bigImg) {
    const numberOfRows = bigImg.width / 50;
    for (let i = 0; i < numberOfRows; i++) {
        // get a row from the big image
        const rowImg = bigImg.get(0, 50*i, bigImg.width, 50);
        setTimeout(() => splitRowImage(rowImg, i, numberOfRows), 0);
    }
}

// load the images from the back-end
function loadImages() {
    const t0 = performance.now();
    this.spinner.showSpinner();
    const size = document.getElementById('sizes').value;
    httpGet(BACK_END_URL + `/api/big?size=${size}`, data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.imgType = ImageType.Grid;
            this.img_loaded = true;
            this.zoomHeight = canvasHeight;
            setTimeout(() => splitImage(img), 0);

            const t1 = performance.now();
            print(`Loading images images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            this.spinner.hideSpinner();
        })
    })
}

// randomize the images
function randomImages() {
    const t0 = performance.now();
    this.spinner.showSpinner();
    httpGet(BACK_END_URL + '/api/random', data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.imgType = ImageType.Grid;
            this.img_loaded = true;
            this.zoomHeight = canvasHeight;

            const t1 = performance.now();
            print(`Random order images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            this.spinner.hideSpinner();
        })
    })
}

// sort the images in reverse order on the server
function reverseImages() { 
    const t0 = performance.now();
    this.spinner.showSpinner();
    httpGet(BACK_END_URL + '/api/reverse', data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.imgType = ImageType.Grid;
            this.img_loaded = true;
            this.zoomHeight = canvasHeight;

            const t1 = performance.now();
            print(`Reverse order images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            this.spinner.hideSpinner();
        })
    })
}

// diplay the images on a histogram, grouped by dates
function histogram() {
    const t0 = performance.now();
    this.spinner.showSpinner();
    httpGet(BACK_END_URL + '/api/histogram', data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.imgType = ImageType.Histogram;
            this.img_loaded = true;
            this.zoomHeight = img.height;
            this.zoomWidth = img.width;

            const t1 = performance.now();
            print(`Histogram images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            this.spinner.hideSpinner();
        })
    })
}

function setup() {
    canvasWidth = windowWidth * 80 / 100;
    canvasHeight = windowHeight - 50;
    halfCanvasWidth = canvasWidth / 2;
    halfCanvasHeight = canvasHeight / 2;
    createCanvas(canvasWidth, canvasHeight, WEBGL);

    this.spinner = new SpinnerService()
}

function mouseWheel(event) {
    const zoomSpeed = 20;
    if (event.delta < 0) {
        if (this.imgType === ImageType.Histogram) {            
            this.zoomWidth += this.zoomWidth * 0.05;
            this.zoomHeight += this.zoomHeight * 0.05
        } else {
            this.zoomHeight += zoomSpeed;
        }
    }
    if (event.delta > 0) {
        if (this.imgType === ImageType.Histogram) {
            this.zoomWidth -= this.zoomWidth * 0.05;
            this.zoomHeight -= this.zoomHeight * 0.05
        } else {
            this.zoomHeight -= zoomSpeed;
        }
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
        const halfZoom = this.zoomHeight / 2;
        if ((mouseX - halfCanvasWidth) < halfZoom + posX && (mouseX - halfCanvasWidth) > -halfZoom + posX
            && (mouseY - halfCanvasHeight) < halfZoom + posY && (mouseY - halfCanvasHeight) > -halfZoom + posY) {
            const mouseXinPic = mouseX - halfCanvasWidth - posX + halfZoom
            const mouseYinPic = mouseY - halfCanvasHeight - posY + halfZoom
            // print(mouseXinPic, mouseYinPic)
            const smallImgDim = 50 * this.zoomHeight / this.img.width
            imageDatas.forEach(imageData => {
                const imgX = imageData.pos.x * this.zoomHeight / this.img.width
                const imgY = imageData.pos.y * this.zoomHeight / this.img.width
                if (mouseXinPic > imgX && mouseXinPic <= imgX + smallImgDim
                    && mouseYinPic > imgY && mouseYinPic <= imgY + smallImgDim) {
                        imageData.image.save(imageData.id.toString(), 'jpg')
                    }
            });
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
            if (this.imgType === ImageType.Grid) {
                image(this.img, posX, posY, this.zoomHeight, this.zoomHeight);
            } else if (this.imgType === ImageType.Histogram) {
                image(this.img, posX, posY, this.zoomWidth, this.zoomHeight)
            }
        }
        this.spinner.draw();
    }
}
