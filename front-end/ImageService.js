/**
 * 
 * @param callback Function for process the loaded images. 
 * @param timeCallBack Function for measure the elapsed time
 * 
 * @since 29.02.2020
 * @author Botond Hegyi
 */
function getImages(url, callback, timeCallBack) {
    loadJSON(url, (data) => {
        for (let i = 0; i < data.results.length; i++) {
            let imgURL = data.results[i].image
            loadImage(imgURL, (img) => {
                callback(img);
            })
        }
        if (data.next) {
            getImages(data.next, callback, timeCallBack);
        }
        timeCallBack();
    })
}