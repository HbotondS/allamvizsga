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
        print(data.length)
        for (let i = 0; i < data.length; i++) {
            let imgURL = data[i].image
            loadImage(imgURL, (img) => {
                document.getElementById('loading').style.visibility = 'visible';
                callback(img);
                timeCallBack();
            })
        }
    });
}