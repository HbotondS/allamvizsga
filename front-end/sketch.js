let images = [];
let images2 = [];
let canDraw = false;

let extraCanvas;

let myWindowWidth;
let myWindowHeight;

function setup() {
    myWindowWidth = windowWidth * 89 / 100;
    myWindowHeight = windowHeight - 10;
    createCanvas(myWindowWidth, myWindowHeight, WEBGL);

    extraCanvas = createGraphics(myWindowWidth, myWindowHeight, WEBGL);
    extraCanvas.background(255, 0, 0);
    extraCanvas.translate(-myWindowWidth / 2, -myWindowHeight / 2);

    document.getElementById('loadBtn').onclick = () => {
        document.getElementById('loading').style.visibility='visible';


        for (let i = 1; i <= 200; i++) {
            let img = loadImage('images/row-images/10k/' + i + '.jpg');
            images.push(img);
        }

        setTimeout(() => {
            console.log(`start cutting, images: ${images.length}`);
            let x = 0, y = 0;
            for (let i = 0; i < images.length; i++) {
                for (let j = 0; j < 50; j++) {
                    let img = images[i].get(50 * j, 0, 50, 50);
                    images2.push(img);

                    extraCanvas.image(img, x, y);
                    x += 50;
                }
                x = 0;
                y += 50;
            }

            console.log(`cutting done, images2: ${images2.length}`);
            canDraw = true;
        }, 1000);

        console.log(`load done, images: ${images.length}`);

        document.getElementById('loading').style.visibility='hidden';
    };

    document.getElementById('rndBtn').onclick = () => {
        shuffle(images2, true);
    };

    document.getElementById('revBtn').onclick = () => {
        images2.reverse();
    };
}

function draw() {
    background(0);
    orbitControl();
    translate(-myWindowWidth / 2, -myWindowHeight / 2);
    let x = -windowWidth / 2;
    let y = -windowHeight / 2;
    image(extraCanvas, 0, 0);
}
