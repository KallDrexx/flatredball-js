var frb;
(function (frb) {
    var MathHelper = (function () {
        function MathHelper() { }
        MathHelper.e = Math.E;
        MathHelper.log10E = 0.4342945;
        MathHelper.log2E = 1.442695;
        MathHelper.pi = Math.PI;
        MathHelper.piOver2 = (Math.PI / 2.0);
        MathHelper.piOver4 = (Math.PI / 4.0);
        MathHelper.twoPi = (Math.PI * 2.0);
        MathHelper.invert = function invert(value) {
            return 0 - value;
        };
        MathHelper.clamp = function clamp(value, min, max) {
            if(value < min) {
                return min;
            }
            if(value > max) {
                return max;
            }
            return value;
        };
        MathHelper.lerp = function lerp(value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        };
        MathHelper.toDegrees = function toDegrees(radians) {
            return radians * 57.295779513082320876798154814105;
        };
        MathHelper.toRadians = function toRadians(degrees) {
            return degrees * 0.017453292519943295769236907684886;
        };
        return MathHelper;
    })();
    frb.MathHelper = MathHelper;    
})(frb || (frb = {}));
