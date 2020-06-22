/**
 * @since 06.12.2019
 * @author Botond Hegyi
 */

let imageDatas = [];

// store the size of the image collection
let collectionSize;

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
const ImageSelectionMode = {Single: 'single', Column: 'column'};
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
        const jsonIndex = rowNr * length + i + rowNr;
        imageDatas.push(new ImageData(
            json[jsonIndex].fields._id,
            json[jsonIndex].fields.date,
            img,
            json[jsonIndex].fields.image,
            {x: i, y: rowNr},
            json[jsonIndex].fields.tweet_text
        ));
    }
}

/**
 * split the grid image to smaller ones on a background thread
 * 
 * @param {p5.Image} bigImg - the image we want to split
 * @param {JSON} json - contains the datas for the images
 */
function splitGrid(bigImg, json) {
    imageDatas = []

    const numberOfRows = bigImg.height / 50;
    // print(numberOfRows)
    for (let i = 0; i < numberOfRows; i++) {
        // get a row from the big image
        const rowImg = bigImg.get(0, 50*i, bigImg.width, 50);
        setTimeout(() => splitRowImage(rowImg, i, numberOfRows, json), 0);
    }
}

/**
 * split a column to small index images and pair them with the data
 * 
 * @param {p5.Image} columnImg - column from the histogram
 * @param {Array} columnData - contains the datas for the column
 * @param {int} numberOfRows - how many rows build up the image
 * @param {int} columnNr - which column from the histogran
 */
function splitColumnImage(columnImg, columnData, numberOfRows, columnNr) {
    for (let i = 0; i < columnData.length; i++) {
        const img = columnImg.get(0, columnImg.height - 50 * i - 50, 50, 50);
        imageDatas.push(new ImageData(
            columnData[i].id,
            columnData[i].date,
            img,
            columnData[i].image,
            {x: columnNr, y: numberOfRows - i - 1},
            columnData[i].tweet
        ));
    }
}

/**
 * split the histogram image to small images on a background thread
 * 
 * @param {p5.Image} histImg - the histogram we want to split 
 * @param {JSON} json - contains the datas for the images
 */
function splitHistogram(histImg, json) {
    imageDatas = []

    const numberOfColumns = histImg.width / 50;
    const numberOfRows = histImg.height / 50;
    for (let i = 0; i < numberOfColumns; i++) {
        // get a column from the histogram
        const column = histImg.get(50*i, 0, 50, histImg.height);
        setTimeout(() => splitColumnImage(column, json[Object.keys(json)[i]], numberOfRows, i), 0);
    }
}

/**
 * activte other buttons after the image is loaded
 */
function activateButtons() {
    document.getElementById('rndBtn').disabled = false;
    document.getElementById('revBtn').disabled = false;
    document.getElementById('histBtn').disabled = false;
}

/**
 * load the images from the back-end by keyword
 * and load the image datas stored in a json
 */
function loadImagesByKeyword() {
    const t0 = performance.now();
    this.spinner.showSpinner();
    const text = document.getElementById('tweet').value;
    httpGet(BACK_END_URL + `/api/big?text=${text}`, data => {
        loadImage(BACK_END_URL + data, img => {
            this.img = img;
            this.imgType = ImageType.Grid;
            this.img_loaded = true;
            this.zoomHeight = canvasHeight;
            this.zoomWidth = this.zoomHeight;
            this.imgWidth = img.width;
            setTimeout(() => {
                loadJSON(BACK_END_URL + `/api/grid_data`, json => {
                    document.getElementById('collectionSize').textContent = `${json.length}/${this.collectionSize}`;
                    splitGrid(img, json);
                });
            }, 0);
            activateButtons();

            const t1 = performance.now();
            print(`Loading images images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            this.spinner.hideSpinner();
        })
    })
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
            this.zoomWidth = this.zoomHeight;
            this.imgWidth = img.width;
            setTimeout(() => {
                loadJSON(BACK_END_URL + `/api/grid_data`, json => {
                    // print(json.length)
                    splitGrid(img, json);
                });
            }, 0);
            activateButtons();

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
            this.zoomWidth = this.zoomHeight;
            this.imgWidth = img.width;

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
            this.zoomWidth = this.zoomHeight;
            this.imgWidth = img.width;

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
            setTimeout(() => {
                loadJSON(BACK_END_URL + `/api/hist_data`, json => {
                    // print(json)
                    keys = Object.keys(json);
                    document.getElementById('date').textContent = keys[0] + ' & ' + keys[keys.length - 1];
                    splitHistogram(img, json);
                });
            }, 0);

            const t1 = performance.now();
            print(`Histogram images took: ${Number((t1 - t0) / 1000).toFixed(2)} seconds.`);
            this.spinner.hideSpinner();
        })
    })
}

/**
 * BUILT IN FUNCTION IN P5JS
 * 
 * called once before setup()
 */
function preload() {
    document.getElementById('rndBtn').disabled = true;
    document.getElementById('revBtn').disabled = true;
    document.getElementById('histBtn').disabled = true;

    document.getElementById('tweet').addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            loadImagesByKeyword();
        }
    })

    httpGet(BACK_END_URL + '/api/data_count', count => {
        this.collectionSize = count;
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
 * @param {int} column - on which column to zoom on
 * @param {int} columnCount - number of columns in histogram
 */
function zoomOnColumn(column, columnCount) {
        this.zoomWidth *= (canvasHeight / 2) / this.zoomHeight;
        this.zoomHeight = canvasHeight / 2;
        const smallImgDim = 50 * this.zoomWidth / this.imgWidth;
        const middleRow = Math.round(columnCount/2);
        if (column < middleRow) {
            posX = +smallImgDim * (middleRow - column - 1);
        } else {
            posX = -smallImgDim * (middleRow - (-column + columnCount - 1));
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
 * check if the mouse was clicked inside the image
 */
function mouseClickedInImage(halfZoomHeight, halfZoomWidth) {
    const myMouseX = mouseX - halfCanvasWidth;
    const myMouseY = mouseY - halfCanvasHeight;
    const width = halfZoomWidth + posX;
    const height = halfZoomHeight + posY;
    return myMouseX < width && myMouseX > -width && myMouseY < height && myMouseY > -height;
}

/**
 * display the selected image's data in a container
 * @param {ImageData} imgData 
 */
function dispalyImageData(imgData) {
    document.getElementById('imgData').style.display = 'block';
    document.getElementById('tweetTxt').textContent = imgData.tweet;
    document.getElementById('tweetDate').textContent = imgData.date;
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
        if (mouseClickedInImage(halfCanvasHeight, halfCanvasWidth)) {
            const mouseXinPic = mouseX - halfCanvasWidth - posX + halfZoomWidth;
            const mouseYinPic = mouseY - halfCanvasHeight - posY + halfZoomHeight;
            // print(mouseXinPic, mouseYinPic)
            const smallImgDim = 50 * this.zoomWidth / this.imgWidth;
            if (this.imgType === ImageType.Grid) {
                const column = Math.floor(mouseXinPic / smallImgDim);
                const row = Math.floor(mouseYinPic / smallImgDim);
                print(column, row);
                imageDatas.forEach(imageData => {
                    if (column === imageData.pos.x && row === imageData.pos.y) {
                        // imageData.image.save(imageData.id.toString(), 'jpg')
                        // print(imageData.id);
                        // loadImage(BACK_END_URL + '/' + imageData.imgUrl, img => img.save(imageData.id.toString(), 'jpg'));
                        dispalyImageData(imageData);
                    }
                });
            } else if (this.imgType === ImageType.Histogram) {
                const selectionMode = document.getElementById('imageSelectionMode').value;
                if (selectionMode === ImageSelectionMode.Column) {
                    const column = Math.floor(mouseXinPic / smallImgDim);
                    const imgNr = this.zoomWidth / smallImgDim;
                    print(`column: ${column}, number of image in a row ${imgNr}`);
                    zoomOnColumn(column, imgNr);
                } else if (selectionMode === ImageSelectionMode.Single) {
                    const column = Math.floor(mouseXinPic / smallImgDim);
                    const row = Math.floor(mouseYinPic / smallImgDim);
                    print(column, row);
                    imageDatas.forEach(imageData => {
                        if (column === imageData.pos.x && row === imageData.pos.y) {
                            dispalyImageData(imageData);
                        }
                    });
                }
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
