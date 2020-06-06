/**
 * Display a loading spinner which indicate a back-end call.
 * 
 * @since 07.06.2020
 * @author Botond Hegyi
 */
class SpinnerService {
    constructor() {
        this.loading = false;
    }

    showSpinner() {
        this.loading = true;
    }

    hideSpinner() {
        this.loading = false;
    }

    draw() {
        if (this.loading) {
            noFill();
            color(0);
            strokeWeight(4);
            stroke(255);
            angleMode(DEGREES);
            rotate(frameCount * 10);
            arc(0, 0, 50, 50, 0, 270);
        }
    }
}