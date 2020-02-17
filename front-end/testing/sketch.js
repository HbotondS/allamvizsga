let name;
let file;
let img;

function setup() {
    createCanvas(1000, 1000);

    document.getElementById("title").onchange = () => {
        name = document.getElementById("title").value;
    };

    document.getElementById("file").onchange = () => {
        file = document.getElementById("file").files[0];
    };

    document.getElementById("saveImage").onclick = () => {
        var postData = new FormData();
        postData.append('name', name);
        postData.append('image', file, file.name);
        let url = 'http://127.0.0.1:8000/images/';
        let method = 'POST';
        const shouldBeAsync = true;

        let request = new XMLHttpRequest();

        request.onload = function () {
            var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
            var data = request.responseText; // Returned data, e.g., an HTML document.
        };
        request.open(method, url, shouldBeAsync);
        request.send(postData);
    }

    img = loadImage('http://127.0.0.1:8000/media/images/2019-10-19_09.51.49.jpg');
}

function draw() {
    background(0);
    image(img, 0, 0);
}
