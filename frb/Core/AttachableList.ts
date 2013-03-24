/// <reference path="../references.ts" />

module frb {
    export class AttachableList {
        list: PositionedObject[];
        length: number;

        constructor() {
            this.list = [];
            this.length = 0;
        }

        get (index: number): PositionedObject {
            return this.list[index];
        }

        contains(value: PositionedObject): bool {
            return this.list.indexOf(value) >= 0;
        }

        add(value: PositionedObject): void {
            if (!this.contains(value)) {
                this.list.push(value);
                this.length = this.list.length;

                if (!value.listsBelongingTo) value.listsBelongingTo = new Array();
                value.listsBelongingTo.push(this);
            }
        }

        push(value: PositionedObject): void {
            this.add(value);
        }

        pop(): PositionedObject {
            if (this.length <= 0) throw "no more items to pop";

            var item = this.get(this.length - 1);
            this.remove(item);
            return item;
        }

        remove(value: PositionedObject): void {
            var index = this.list.indexOf(value);

            if (index >= 0) {
                this.list.splice(index, 1);
                this.length = this.list.length;

                if (value.listsBelongingTo) {
                    var listIndex = value.listsBelongingTo.indexOf(this);
                    if (listIndex >= 0) {
                        value.listsBelongingTo.splice(listIndex, 1);
                    }
                }
            }
        }

        removeFromAll(value: PositionedObject): void {
            if (value.listsBelongingTo) {
                var numLists = value.listsBelongingTo.length;
                for (var i = 0; i < numLists; i++) {
                    value.listsBelongingTo[i].remove(value);
                }
            }
        }
    }
}