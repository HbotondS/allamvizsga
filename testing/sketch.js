function mouseClicked() {
    if (mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0) {
        print('out')
    } else {
        print(mouseX - 250)
    }
}

let zoom = 100;
let posX = 0;
let posY = 0;
let speed = 10;

const MIN_ZOOM = 100;
const MAX_ZOOM = 300;

function mouseWheel(event) {
    const zoomSpeed = 20;
    if (event.delta < 0 && zoom > MIN_ZOOM) {
        zoom -= zoomSpeed;
    }
    if (event.delta > 0 && zoom < MAX_ZOOM) {
        zoom += zoomSpeed;
    }
}

function setup() {
    createCanvas(500, 500, WEBGL);
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        posX -= speed;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        posX += speed;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        posY -= speed;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        posY += speed;
    }
}

function draw() {
    // camera(0, 0, zoom, 0, 0, 0, 0, 1, 0);
    background(0);
    keyDown()
    if ((mouseX - 250) < zoom/2 + posX && mouseX - 250 > -zoom/2 + posX
        && (mouseY - 250) < zoom/2 + posY && (mouseY - 250) > -zoom/2 + posY) {
        fill(102, 255, 50)
    } else {
        fill(255, 102, 80)
    }
    rectMode(CENTER);
    rect(posX, posY, zoom, zoom)
}
