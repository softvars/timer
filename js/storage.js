//var myStorage = localStorage;

var StorageHelper = function(){};
StorageHelper.prototype.myStorage = localStorage;

StorageHelper.prototype.get = function(key, def){
    var val = this.myStorage.getItem(key) || def;
    try{
        if(typeof val === "string") {
            val = JSON.parse(val);
        }
    } catch(e){}
    return val;
};
StorageHelper.prototype.set = function(key, val){
    if(typeof key === "string") {
        val = (typeof val != "string") ? JSON.stringify(val) : val;
        this.myStorage.setItem(key, val);
    }
    return val;
};

StorageHelper.prototype.unset = function(key){
    if(typeof key === "string") {
        this.myStorage.removeItem(key);
    }
    return;
};

StorageHelper.prototype.each = function(fn){
    if(typeof fn === "function") {
        var size = this.myStorage.length
        for(var i=0; i<size; i++){
            var key = this.myStorage.key(i);
            fn(key);
        }
    }
};

StorageHelper.prototype.getLength = function(){
    return this.myStorage.length;
};

var storageHelper = new StorageHelper();