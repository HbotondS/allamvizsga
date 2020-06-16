/**
 * Represent an image and it's belonging info.
 * 
 * @param id is a unique identifier of the image
 * @param date is the uploaddate of the image
 * @param img is the image
 * @param imgUrl is a URL, where the full resolustion image is located
 * @param pos is a position (x, y), store the location
 *            of the image on the buffer
 * @param tweet is the tweet belonging to the image
 * 
 * @since 14.03.2020
 * @author Botond Hegyi
 */
class ImageData {
    constructor(id, date, img, imgUrl, pos, tweet){
        if (id === undefined && date == undefined && img && undefined) {
            this.id = "";
            this.date = new Date();
            this.image = new p5.Image();
            this.pos = {x: undefined, y: undefined};
        } else {
            this.id = id;
            this.date = date;
            this.image = img;
            this.imgUrl = imgUrl;
            this.pos = pos;
            this.tweet = tweet;
        }
    }
}