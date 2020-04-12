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
        data.forEach(element => {
            let imgURL = element.image
            loadImage('http://127.0.0.1:8000' + imgURL, (img) => {
                document.getElementById('loading').style.visibility = 'visible';
                setTimeout( () => callback(img, element._id, element.date), 0);
                timeCallBack();
            })
        });
    });
}