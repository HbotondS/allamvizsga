let name;
let file;

function setup() {
    createCanvas(100, 100);

    document.getElementById("title").onchange = () => {
        name = document.getElementById("title").value;
    }

    document.getElementById("file").onchange = () => {
        file = document.getElementById("file").files[0];
    }

    document.getElementById("saveImage").onchange = () => {
        // todo: saving the image
    }
}

function draw() {
    background(0);
}
