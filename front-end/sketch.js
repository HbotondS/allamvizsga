let images = [];
let images2 = [];

let extraCanvas;
let canvasSize = Math.round(Math.sqrt(1000)) * 50;

let myWindowWidth;
let myWindowHeight;

let zoom = 1000;
let posX = 0;
let posY = 0;

function reRenderBuffer() {
    extraCanvas.clear();
    let x = 0, y = 0, k = 0;
    for (let j = 0; j < images2.length; j++) {
        extraCanvas.image(images2[j], x, y);
        x += 50;
        k++;
        if (k === canvasSize / 50) {
            y += 50;
            x = 0;
            k = 0;
        }
    }
}

function setup() {
    myWindowWidth = windowWidth * 89 / 100;
    myWindowHeight = windowHeight - 10;
    createCanvas(myWindowWidth, myWindowHeight, WEBGL);

    zoom = canvasSize;
    extraCanvas = createGraphics(canvasSize, canvasSize, WEBGL);
    extraCanvas.background(255, 0, 0);
    extraCanvas.translate(-canvasSize / 2, -canvasSize / 2);

    document.getElementById('loadBtn').onclick = () => {
        const t0 = performance.now();
        document.getElementById('loading').style.visibility = 'visible';


        extraCanvas.clear();
        let x = 0, y = 0, k = 0;
        for (let i = 1; i <= 20; i++) {
            // there is a callback function for loadImage when the image is loaded
            loadImage('images/row-images/1k/' + i + '.jpg', (data) => {
                for (let j = 0; j < 50; j++) {
                    let img = data.get(50 * j, 0, 50, 50);
                    images2.push(img);

                    extraCanvas.image(img, x, y);
                    x += 50;
                    k++;
                    if (k === canvasSize / 50) {
                        y += 50;
                        x = 0;
                        k = 0;
                    }
                }
            });
            // images.push(img);
        }
        const t1 = performance.now();
        console.log("Loading images images took: " + (t1 - t0) + " milliseconds.");

        document.getElementById('loading').style.visibility = 'hidden';

        console.log(`load done`);
    };

    document.getElementById('rndBtn').onclick = () => {
        const t0 = performance.now();
        shuffle(images2, true);
        reRenderBuffer();
        const t1 = performance.now();
        console.log("Random order images took: " + (t1 - t0) + " milliseconds.");
    };

    document.getElementById('revBtn').onclick = () => {
        const t0 = performance.now();
        images2.reverse();
        reRenderBuffer();
        const t1 = performance.now();
        console.log("Reverse order images took: " + (t1 - t0) + " milliseconds.");
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

    // print(zoom);
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        posX += 5;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        posX -= 5;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        posY += 5;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        posY -= 5;
    }
}

function draw() {
    background(0);
    keyDown();
    camera(posX, posY, zoom, posX, posY, 0, 0, 1, 0);
    imageMode(CENTER);
    let x = -windowWidth / 2;
    let y = -windowHeight / 2;
    image(extraCanvas, 0, 0);
}
