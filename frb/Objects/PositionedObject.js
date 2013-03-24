var frb;
(function (frb) {
    var PositionedObject = (function () {
        function PositionedObject() {
            this.x = 0;
            this.y = 0;
            this.xVelocity = 0;
            this.yVelocity = 0;
            this.xTarget = 0;
            this.yTarget = 0;
            this.xAcceleration = 0;
            this.yAcceleration = 0;
            this.zRotation = 0;
            this.zRotationAcceleration = 0;
            this.zRotationVelocity = 0;
            this.listsBelongingTo = [];
        }
        PositionedObject.prototype.update = function () {
            var diff = frb.timeManager.secondDifference;
            this.x += this.xVelocity * diff + this.xAcceleration * diff;
            this.y += this.yVelocity * diff + this.yAcceleration * diff;
            this.xVelocity += this.xAcceleration * diff;
            this.yVelocity += this.yAcceleration * diff;
            this.zRotation += this.zRotationVelocity * diff + this.zRotationAcceleration * diff;
            this.zRotationVelocity += this.zRotationAcceleration * diff;
        };
        PositionedObject.prototype.draw = function () {
        };
        PositionedObject.prototype.initialize = function (target) {
            this.updatePositionResults(target);
            target.listsBelongingTo = this.listsBelongingTo;
            target.removeSelfFromListsBelongingTo = this.removeSelfFromListsBelongingTo;
        };
        PositionedObject.prototype.updatePositionResults = function (target) {
            target.x = this.x;
            target.y = this.y;
            target.xVelocity = this.xVelocity;
            target.yVelocity = this.yVelocity;
            target.xAcceleration = this.xAcceleration;
            target.yAcceleration = this.yAcceleration;
            target.zRotation = this.zRotation;
            target.zRotationAcceleration = this.zRotationAcceleration;
            target.zRotationVelocity = this.zRotationVelocity;
        };
        PositionedObject.prototype.updateControlValues = function (source) {
            this.x = source.x;
            this.y = source.y;
            this.xVelocity = source.xVelocity;
            this.yVelocity = source.yVelocity;
            this.xAcceleration = source.xAcceleration;
            this.yAcceleration = source.yAcceleration;
            this.zRotation = source.zRotation;
            this.zRotationVelocity = source.zRotationVelocity;
            this.zRotationAcceleration = source.zRotationAcceleration;
        };
        PositionedObject.prototype.removeSelfFromListsBelongingTo = function () {
            frb.attachableList.removeFromAll(this);
        };
        return PositionedObject;
    })();
    frb.PositionedObject = PositionedObject;    
})(frb || (frb = {}));
