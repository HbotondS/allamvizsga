let images = [];
let images2 = [];
let canDraw = false;

function setup() {
    createCanvas(windowWidth-100, windowHeight-10, WEBGL);

    document.getElementById("loadBtn").onclick = () => {
        for (let i = 1; i <= 20; i++) {
                let img = loadImage('images/row-images/1k/' + i + '.jpg');
            images.push(img);
        }

        setTimeout(() => {
            console.log(`start cutting, images: ${images.length}`);
            for (let i = 0; i < images.length; i++) {
                    for (let j = 0; j < 50; j++) {
                        images2.push(images[i].get(50 * j, 0, 50, 50));
                    }
            }

            console.log(`cutting done, images2: ${images2.length}`);
            canDraw = true;
        }, 1000);

        console.log(`load done, images: ${images.length}`);
    };

    document.getElementById("rndBtn").onclick = () => {
      shuffle(images2, true);
    };

    document.getElementById("revBtn").onclick = () => {
      images2.reverse();
    };
}

function draw() {
    background(0);
    orbitControl();
    let x = -windowWidth / 2;
    let y = -windowHeight / 2;
    if (canDraw) {
        for (let i = 0; i < images2.length; i++) {
            image(images2[i], x, y);
            x += 50;
            // console.log((i % 50));
            if ((i + 1) % 50 === 0) {
                y += 50;
                x = -windowWidth / 2;
            }
        }
    }
}
