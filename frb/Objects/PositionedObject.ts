/// <reference path="../Core/Globals.ts" />
/// <reference path="../Managers/TimeManager.ts" />
/// <reference path="../Core/AttachaleList.ts" />

module frb {
    export class PositionedObject {
        x: number = 0;
        y: number = 0;
        xVelocity: number = 0;
        yVelocity: number = 0;
        xTarget: number = 0;
        yTarget: number = 0;
        xAcceleration: number = 0;
        yAcceleration: number = 0;
        zRotation: number = 0;
        zRotationAcceleration: number = 0;
        zRotationVelocity: number = 0;
        listsBelongingTo: any[] = [];

        update(): void {
            var diff = timeManager.secondDifference;

            this.x += this.xVelocity * diff + this.xAcceleration * diff;
            this.y += this.yVelocity * diff + this.yAcceleration * diff;
            this.xVelocity += this.xAcceleration * diff;
            this.yVelocity += this.yAcceleration * diff;

            this.zRotation += this.zRotationVelocity * diff + this.zRotationAcceleration * diff;
            this.zRotationVelocity += this.zRotationAcceleration * diff;
        }

        draw(): void {
            // Empty by default, to be filled in by inherited classes
        }

        initialize(target: PositionedObject): void {
            this.updatePositionResults(target);
            target.listsBelongingTo = this.listsBelongingTo;
            target.removeSelfFromListsBelongingTo = this.removeSelfFromListsBelongingTo;
        }

        updatePositionResults(target: PositionedObject): void {
            target.x = this.x;
            target.y = this.y;
            target.xVelocity = this.xVelocity;
            target.yVelocity = this.yVelocity;
            target.xAcceleration = this.xAcceleration;
            target.yAcceleration = this.yAcceleration;
            target.zRotation = this.zRotation;
            target.zRotationAcceleration = this.zRotationAcceleration;
            target.zRotationVelocity = this.zRotationVelocity;
        }

        updateControlValues(source: PositionedObject): void {
            this.x = source.x;
            this.y = source.y;
            this.xVelocity = source.xVelocity;
            this.yVelocity = source.yVelocity;
            this.xAcceleration = source.xAcceleration;
            this.yAcceleration = source.yAcceleration;
            this.zRotation = source.zRotation;
            this.zRotationVelocity = source.zRotationVelocity;
            this.zRotationAcceleration = source.zRotationAcceleration;
        }

        removeSelfFromListsBelongingTo(): void {
            attachableList.removeFromAll(this);
        }
    }
}