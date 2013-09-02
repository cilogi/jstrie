define(["trie/base64"], function (Base64) {

    function BitWriter() {
        this.bits = [];
    }

    // numBits <= 32 as data is a 32-bit int.
    BitWriter.prototype.write = function (data, numBits) {
        for (var i = numBits - 1; i >= 0; i--) {
            if (data & ( 1 << i )) {
                this.bits.push(1);
            } else {
                this.bits.push(0);
            }
        }
    };

    BitWriter.prototype.getData = function () {
        var chars = [],
                b = 0,
                i = 0,
                j;

        for (j = 0; j < this.bits.length; j++) {
            b = (b << 1) | this.bits[j];
            i += 1;
            if (i === Base64.charWidth) {
                chars.push(Base64.chr(b));
                i = b = 0;
            }
        }

        if (i > 0) {
            chars.push(Base64.chr(b << ( Base64.charWidth - i )));
        }
        return chars.join("");
    }

    return BitWriter;
});
