let folder;
let files;
let img;
let images = []
let extraCanvas;

function randomDate() {
    var dates = [];
    var date1 = new Date(2019, 09, 12)
    var date2 = new Date(2020, 02, 12)
    var date = new Date(+date1 + Math.random() * (date2 - date1));

    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

function setup() {
    // loadJSON("http://127.0.0.1:8000/images", (data) => {
    //     print(data.count)
    //     for (let i = 0; i < data.count; i++) {
    //         let imgURL = data.results[i].image
    //         print(imgURL)
    //         loadImage(imgURL, (img) => {
    //             images.push(img)
    //         })
    //     }
    // })

    folder = select('#folder')

    document.getElementById('saveImage').onclick = () => {
        console.log('hello')
        files = document.getElementById('file').files
        if (files.length == 0) {
            window.alert("no files selected");
        } else {
            let url = 'http://127.0.0.1:8000/images/'
            let method = 'POST'
            const shouldBeAsync = true
            // console.log(files)
            for (let i = 0; i < files.length; i++) {
                // console.log(files[i])
                var postData = new FormData()
                postData.append('date', randomDate())
                postData.append('image', files[i], files[i].name)

                let request = new XMLHttpRequest()
                request.onload = function() {
                    var status = request.status
                    var data = request.responseText
                }
                request.open(method, url, shouldBeAsync)
                request.send(postData)
            }
            print('done')
        }
    }
}

function draw() {
    background(0);
}
