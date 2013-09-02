define(["trie/base64"], function(Base64) {

    function StringIntArray() {
        this.builder = "";
    }

    StringIntArray.prototype.set = function(s) {
        this.builder = s;
        return this;
    }

    StringIntArray.prototype.add = function(val) {
        this.builder = this.builder + Base64.i2c(val);
    }

    StringIntArray.prototype.size = function() {
        return this.builder.length /4;
    }

    StringIntArray.prototype.get = function(index) {
        return Base64.c2i(this.builder, index*4);
    }

    StringIntArray.prototype.toString = function() {
        return this.builder;
    }

    return StringIntArray;
});