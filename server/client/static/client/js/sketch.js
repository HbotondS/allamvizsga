/**
 * @since 06.12.2019
 * @author Botond Hegyi
 */

let images = [];

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
    for (let j = 0; j < images.length; j++) {
        extraCanvas.image(images[j].image, x, y);
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
    myWindowWidth = windowWidth * 80 / 100;
    myWindowHeight = windowHeight - 50;
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
        getImages("http://127.0.0.1:8000/images",
            (data, id, date) => {
                for (let j = 0; j < 50; j++) {
                    let img = data.get(50 * j, 0, 50, 50);
                    var imageData = new ImageData();
                    imageData.id = id;
                    imageData.date = date;
                    imageData.image = img;
                    images.push(imageData);

                    extraCanvas.image(imageData.image, x, y);
                    x += 50;
                    k++;
                    if (k === canvasSize / 50) {
                        y += 50;
                        x = 0;
                        k = 0;
                    }
                }
            },
            () => {
                const t1 = performance.now();
                print(`Loading images images took: ${(t1 - t0)} milliseconds.`);

                document.getElementById('loading').style.visibility = 'hidden';

                print('load done');
            });
    };

    document.getElementById('rndBtn').onclick = () => {
        const t0 = performance.now();
        shuffle(images, true);
        reRenderBuffer();
        const t1 = performance.now();
        print(`Random order images took: ${(t1 - t0)} milliseconds.`);
    };

    document.getElementById('rndBtn2').onclick = () => {
        const t0 = performance.now();
        loadJSON('http://127.0.0.1:8000/randomimages', json => {
            ids = json.data;
            print(ids);
            images = images.sort(function(a, b) {
                return ids.indexOf(a.id) - images.indexOf(b.id);
            });
            reRenderBuffer();
        });
        const t1 = performance.now();
        print(`Random 2 order images took: ${(t1 - t0)} milliseconds.`);
    };

    document.getElementById('revBtn').onclick = () => {
        const t0 = performance.now();
        images.reverse();
        reRenderBuffer();
        const t1 = performance.now();
        print(`Reverse order images took: ${(t1 - t0)} milliseconds.`);
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
    image(extraCanvas, 0, 0);
}
