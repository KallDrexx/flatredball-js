var frb;
(function (frb) {
    var ResourcePool = (function () {
        function ResourcePool() {
            this.active = new frb.AttachableList();
            this.available = new frb.AttachableList();
        }
        ResourcePool.prototype.add = function (factory) {
            var newItem = null;
            if(this.available.length > 0) {
                newItem = this.available.pop();
            }
            if(newItem === null) {
                newItem = factory();
            }
            this.active.add(newItem);
            return newItem;
        };
        ResourcePool.prototype.return = function (item) {
            this.active.remove(item);
            this.available.add(item);
        };
        return ResourcePool;
    })();
    frb.ResourcePool = ResourcePool;    
})(frb || (frb = {}));
