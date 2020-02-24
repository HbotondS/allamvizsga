let name;
let file;
let img;
let images = []
let extraCanvas;

function setup() {
    loadJSON("http://127.0.0.1:8000/images", (data) => {
        print(data.count)
        for (let i = 0; i < data.count; i++) {
            let imgURL = data.results[i].image
            print(imgURL)
            loadImage(imgURL, (img) => {
                images.push(img)
            })
        }
    })
}

function draw() {
    background(0);
}
