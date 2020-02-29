/**
 * 
 * @param callback Function for process the loaded images. 
 * @param timeCallBack Function for measure the elapsed time
 * 
 * @since 29.02.2020
 * @author Botond Hegyi
 */
function getImages(callback, timeCallBack) {
    loadJSON("http://127.0.0.1:8000/images", (data) => {
        print(data.count);
        for (let i = 0; i < data.count; i++) {
            let imgURL = data.results[i].image
            loadImage(imgURL, (img) => {
                callback(img);
            })
        }
        timeCallBack();
    })
}