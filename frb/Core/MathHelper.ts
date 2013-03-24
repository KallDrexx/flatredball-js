
module frb {
    export class MathHelper {
        static e: number = Math.E;
        static log10E: number = 0.4342945;
        static log2E: number = 1.442695;
        static pi: number = Math.PI;
        static piOver2: number = (Math.PI / 2.0);
        static piOver4: number = (Math.PI / 4.0);
        static twoPi: number = (Math.PI * 2.0);

        static invert(value: number): number {
            return 0 - value;
        }

        static clamp(value: number, min: number, max: number): number {
            if (value < min)
                return min;

            if (value > max)
                return max;

            return value;
        }

        static lerp(value1: number, value2: number, amount: number): number {
            return value1 + (value2 - value1) * amount;
        }

        static toDegrees(radians: number): number {
            return radians * 57.295779513082320876798154814105;
        }

        static toRadians(degrees: number): number {
            return degrees * 0.017453292519943295769236907684886;
        }
    }
}