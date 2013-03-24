/// <reference path="../references.ts" />

module frb {
    export class ResourcePool {
        active: AttachableList;
        available: AttachableList;

        constructor() {
            this.active = new AttachableList();
            this.available = new AttachableList();
        }

        add(factory: Function): PositionedObject {
            var newItem = null;

            // now check and see if we can use a recycled item
            if (this.available.length > 0) {
                newItem = this.available.pop();
            }

            if (newItem === null) {
                // no recycled item available, make a new one
                newItem = factory();
            }

            this.active.add(newItem);
            return newItem;
        }

        return (item: any): void {
            this.active.remove(item);
            this.available.add(item);
        }
    }
}