define(["trie/base64"], function (Base64) {

    var W = Base64.charWidth,
        maskTop = [
            0x3f, 0x1f, 0x0f, 0x07, 0x03, 0x01, 0x00
        ],
        bitsInByte = [
            0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2,
            3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3,
            3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3,
            4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4,
            3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5,
            6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4,
            4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5,
            6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5,
            3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3,
            4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6,
            6, 7, 6, 7, 7, 8
        ];

    function BitString(str) {
        this.bytes = str;
        this.length = this.bytes.length * W;
    }

    BitString.prototype.getData = function () {
        return this.bytes;
    }

    /**
     Returns a decimal number, consisting of a certain number, nBits, of bits
     starting at a certain position, position.
     */
    BitString.prototype.get = function (position, nBits) {

        // case 1: bits lie within the given byte
        if (( position % W ) + nBits <= W) {
            return (Base64.index(this.bytes[ position / W | 0 ]) & maskTop[ position % W ] ) >> ( W - position % W - nBits );

            // case 2: bits lie incompletely in the given byte
        } else {
            var result = ( Base64.index(this.bytes[ position / W | 0 ]) & maskTop[ position % W ] ), l = W - position % W;

            position += l;
            nBits -= l;

            while (nBits >= W) {
                result = (result << W) | Base64.index(this.bytes[ position / W | 0 ]);
                position += W;
                nBits -= W;
            }

            if (nBits > 0) {
                result = (result << nBits) | ( Base64.index(this.bytes[ position / W | 0 ]) >> ( W - nBits ) );
            }
            return result;
        }
    }

    /**
     Counts the number of bits set to 1 starting at position p and
     ending at position p + n
     */
    BitString.prototype.count = function (p, n) {

        var count = 0;
        while (n >= 8) {
            count += bitsInByte[ this.get(p, 8) ];
            p += 8;
            n -= 8;
        }
        return count + bitsInByte[ this.get(p, n) ];
    }

    /**
     Returns the number of bits set to 1 up to and including position x.
     This is the slow implementation used for testing.
     */
    BitString.prototype.rank = function (x) {
        var rank = 0,
            i;
        for (i = 0; i <= x; i++) {
            if (this.get(i, 1)) {
                rank++;
            }
        }
        return rank;
    }

    return BitString;
});
