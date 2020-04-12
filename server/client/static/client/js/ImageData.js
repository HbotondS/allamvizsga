class ImageData {
    constructor(id, date, img){
        if (id === undefined && date == undefined && img && undefined) {
            this.id = "";
            this.date = new Date();
            this.image = new p5.Image();
        } else {
            this.id = id;
            this.date = date;
            this.image = img;
        }
    }
}