var frb;
(function (frb) {
    var AttachableList = (function () {
        function AttachableList() {
            this.list = [];
            this.length = 0;
        }
        AttachableList.prototype.get = function (index) {
            return this.list[index];
        };
        AttachableList.prototype.contains = function (value) {
            return this.list.indexOf(value) >= 0;
        };
        AttachableList.prototype.add = function (value) {
            if(!this.contains(value)) {
                this.list.push(value);
                this.length = this.list.length;
                if(!value.listsBelongingTo) {
                    value.listsBelongingTo = new Array();
                }
                value.listsBelongingTo.push(this);
            }
        };
        AttachableList.prototype.push = function (value) {
            this.add(value);
        };
        AttachableList.prototype.pop = function () {
            if(this.length <= 0) {
                throw "no more items to pop";
            }
            var item = this.get(this.length - 1);
            this.remove(item);
            return item;
        };
        AttachableList.prototype.remove = function (value) {
            var index = this.list.indexOf(value);
            if(index >= 0) {
                this.list.splice(index, 1);
                this.length = this.list.length;
                if(value.listsBelongingTo) {
                    var listIndex = value.listsBelongingTo.indexOf(this);
                    if(listIndex >= 0) {
                        value.listsBelongingTo.splice(listIndex, 1);
                    }
                }
            }
        };
        AttachableList.prototype.removeFromAll = function (value) {
            if(value.listsBelongingTo) {
                var numLists = value.listsBelongingTo.length;
                for(var i = 0; i < numLists; i++) {
                    value.listsBelongingTo[i].remove(value);
                }
            }
        };
        return AttachableList;
    })();
    frb.AttachableList = AttachableList;    
})(frb || (frb = {}));
