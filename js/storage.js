//var myStorage = localStorage;

var StorageHelper = function(){};
StorageHelper.prototype.myStorage = localStorage;

StorageHelper.prototype.get = function(key, def){
    var val = this.myStorage[key] || def;
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
        this.myStorage[key] = val;
    }
    return val;
};

StorageHelper.prototype.unset = function(key){
    if(typeof key === "string") {
        this.myStorage.removeItem(key);
    }
    return;
};
