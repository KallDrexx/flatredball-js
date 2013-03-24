
module frb {
    export class TimeManager {
        start: Date = new Date();
        last: Date = new Date();
        secondDifference: number = 0;
        secondDifferenceFromStart: number = 0;

        update(): void {
            var startMilli = this.start.getTime();
            var lastMilli = this.last.getTime();
            this.last = new Date();
            var nowMilli = this.last.getTime();
            var diff = nowMilli - lastMilli;
            var startDiff = nowMilli - startMilli;
            this.secondDifference = diff / 1000;
            this.secondDifferenceFromStart = startDiff / 1000;
        }
    }
}