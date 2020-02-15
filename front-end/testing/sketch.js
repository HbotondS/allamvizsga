let name;
let file;

function setup() {
    createCanvas(100, 100);

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
}

function draw() {
    background(0);
}
