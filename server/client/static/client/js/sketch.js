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
let imgWidth;
const ImageType = {Grid: 0, Histogram: 1};
let imgType;
let img_loaded = false;
let spinner;

const BACK_END_URL = 'http://127.0.0.1:8000';

/**
 * split a row to small index images and pair them with the data
 * 
 * @param {p5.Image} rowImg - row from the big image 
 * @param {int} rowNr - row from the big image 
 * @param {int} length - of the row
 * @param {JSON} json - contains the datas for the images
 */
function splitRowImage(rowImg, rowNr, length, json) {
    for (let i = 0; i < length; i++) {
        const img = rowImg.get(50*i, 0, 50, 50);
        const jsonIndex = rowNr * length + i;
        imageDatas.push(new ImageData(
            json[jsonIndex]._id,
            json[jsonIndex].date,
            img,
            json[jsonIndex].image,
            {x: 50*i, y: 50*rowNr}
        ));
    }
}

/**
 * split the big image to smaller ones on a background thread
 * 
 * @param {p5.Image} bigImg - the image we want to split 
 * @param {JSON} json - contains the datas for the images
 */
function splitImage(bigImg, json) {
    const numberOfRows = bigImg.width / 50;
    for (let i = 0; i < numberOfRows; i++) {
        // get a row from the big image
        const rowImg = bigImg.get(0, 50*i, bigImg.width, 50);
        setTimeout(() => splitRowImage(rowImg, i, numberOfRows, json), 0);
    }
}

/**
 * load the images from the back-end
 * and load the image datas stored in a json
 */
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
            setTimeout(() => {
                loadJSON(BACK_END_URL + `/images?size=${size}`, json => {
                    print(json.length)
                    splitImage(img, json);
                });
            }, 0);

            const t1 = performance.now();
            print(`Loading images images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            this.spinner.hideSpinner();
        })
    })
}

/**
 * randomize the images
 */
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

/**
 * sort the images in reverse order on the server
 */
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

/**
 * diplay the images on a histogram, grouped by dates
 */
function histogram() {
    const t0 = performance.now();
    this.spinner.showSpinner();
    httpGet(BACK_END_URL + '/api/histogram', data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.imgType = ImageType.Histogram;
            this.img_loaded = true;
            this.zoomHeight = img.height * canvasWidth/img.width;
            this.zoomWidth = canvasWidth;
            this.imgWidth = img.width;

            const t1 = performance.now();
            print(`Histogram images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            this.spinner.hideSpinner();
        })
    })
}

/**
 * BUILT IN FUNCTION IN P5JS
 * 
 * called once when the program starts
 * used to initialize variables
 */
function setup() {
    canvasWidth = windowWidth * 80 / 100;
    canvasHeight = windowHeight - 50;
    halfCanvasWidth = canvasWidth / 2;
    halfCanvasHeight = canvasHeight / 2;
    createCanvas(canvasWidth, canvasHeight, WEBGL);

    this.spinner = new SpinnerService()
}

/**
 * BUILT IN FUNCTION IN P5JS
 * 
 * called every time when a vertical mouse wheel event is detected
 * 
 * the event.delta property returns the amount the mouse wheel have scrolled
 * The values can be positive or negative depending on the scroll direction
 */
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

/**
 * zoom on the given column on the histogram
 * 
 * @param {int} columnNr - on which column to zoom on
 * @param {int} imgNr - number of columns in histogram
 */
function zoomOnRow(columnNr, imgNr) {
        this.zoomWidth *= (canvasHeight / 2) / this.zoomHeight;
        this.zoomHeight = canvasHeight / 2;
        const smallImgDim = 50 * this.zoomWidth / this.imgWidth;
        const middleRow = Math.round(imgNr/2);
        if (columnNr < imgNr / 2) {
            posX = +smallImgDim * (middleRow - columnNr - 1);
        } else {
            posX = -smallImgDim * (middleRow - (-columnNr + imgNr - 1));
        }
        posY = 0;
}

/**
 * used for the navivation
 * currently there is two way for that:
 *    arrow keys or WASD
 */
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

/**
 * BUILT IN FUNCTION IN P5JS
 * 
 * called once after a mouse button has been pressed and then released.
 */
function mouseClicked() {
    if (mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0) {
        return;
    }
    if (this.img_loaded) {
        const halfZoomHeight = this.zoomHeight / 2;
        const halfZoomWidth = this.zoomWidth / 2;
        if ((mouseX - halfCanvasWidth) < halfZoomWidth + posX && (mouseX - halfCanvasWidth) > -halfZoomWidth + posX
            && (mouseY - halfCanvasHeight) < halfZoomHeight + posY && (mouseY - halfCanvasHeight) > -halfZoomHeight + posY) {
            const mouseXinPic = mouseX - halfCanvasWidth - posX + halfZoomWidth
            const mouseYinPic = mouseY - halfCanvasHeight - posY + halfZoomHeight
            // print(mouseXinPic, mouseYinPic)
            const smallImgDim = 50 * this.zoomWidth / this.imgWidth;
            if (this.imgType === ImageType.Grid) {
                imageDatas.forEach(imageData => {
                    const imgX = imageData.pos.x * this.zoomHeight / this.img.width
                    const imgY = imageData.pos.y * this.zoomHeight / this.img.width
                    if (mouseXinPic > imgX && mouseXinPic <= imgX + smallImgDim
                        && mouseYinPic > imgY && mouseYinPic <= imgY + smallImgDim) {
                            // imageData.image.save(imageData.id.toString(), 'jpg')
                            loadImage(BACK_END_URL + '/' + imageData.imgUrl, img => img.save(imageData.id.toString(), 'jpg'));
                        }
                });
            } else if (this.imgType === ImageType.Histogram) {
                const column = Math.floor(mouseXinPic / smallImgDim);
                const imgNr = this.zoomWidth / smallImgDim;
                print(`column: ${column}, number of image in a row ${imgNr}`);
                zoomOnRow(column, imgNr);
            }
        }
    }
}

/**
 * BUILT IN FUNCTION IN P5JS
 * 
 * Called directly after setup()
 * continuously executes the code contained inside its block 
 * until the program is stopped
 */
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
