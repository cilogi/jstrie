define([], function () {

    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    var charWidth = 6;

    var bitsInByte = [
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

    function chr(index) {
        return charset[index];
    }

    function width() {
        return charWidth;
    }


    var cache = {
        "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7,
        "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15,
        "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23,
        "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31,
        "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39,
        "o": 40, "p": 41, "q": 42, "r": 43, "s": 44, "t": 45, "u": 46, "v": 47,
        "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55,
        "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "-": 62, "_": 63
    };

    // The integral value  for a Base64 character
    function index(ch) {
        return cache[ch];
    }

    // The number of bits in a Base64 character
    function bits(ch) {
        return bitsInByte[index(ch)];
    }

    function c2i(s, offset) {
        var c, cVal, val = 0;
        for (var i = 0; i < 4; i++) {
            c = s.charAt(offset + i);
            cVal = index(c);
            val = (val << 6) | cVal;
        }
        return val;
    }

    function i2c(val) {
        var ONES = 0x3f,
            WIDTH = 6,
            out = "";

        out += charset.charAt(((ONES << (WIDTH*3)) & val)>>>(WIDTH*3));
        out += charset.charAt(((ONES << (WIDTH*2)) & val)>>>(WIDTH*2));
        out += charset.charAt(((ONES << WIDTH) & val)>>>WIDTH);
        out += charset.charAt(ONES & val);
        return out;
    }

    return {
        charWidth: charWidth,
        width: width,
        chr: chr,
        index: index,
        bits: bits,
        c2i: c2i,
        i2c: i2c
    }
});