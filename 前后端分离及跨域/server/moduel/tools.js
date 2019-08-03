function trims(str) {
    if(!str){
        return null;
    }
    return str.replace(/^\s+|\s+$/g,'');
}

module.exports={
    trims
};