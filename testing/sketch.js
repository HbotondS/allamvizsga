function mouseClicked() {
    print(mouseX - 250)
}

let zoom = 100;

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

function draw() {
    // camera(0, 0, zoom, 0, 0, 0, 0, 1, 0);
    background(0);
    let corner = 105;
    if ((mouseX - 250) < zoom/2 && mouseX - 250 > -zoom/2
        && (mouseY - 250) < zoom/2 && (mouseY - 250) > -zoom/2) {
        fill(102, 255, 50)
    } else {
        fill(255, 102, 80)
    }
    rectMode(CENTER);
    rect(0, 0, zoom, zoom)
}
