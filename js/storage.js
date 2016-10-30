var myStorage = localStorage;

var StorageHelper = function(){};

StorageHelper.prototype.getJson = function(key, def){
    var val = myStorage[key] || def;
    if(typeof val === "string") {
        val = JSON.parse(val);
    }
    return val;
};
StorageHelper.prototype.setJson = function(key, val){
    if(key) {
        val = (typeof val != "string") ? JSON.stringify(val) : val;
        myStorage[key] = val;
    }
    return val;
};

