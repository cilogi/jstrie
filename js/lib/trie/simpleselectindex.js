define(["trie/base64", "trie/stringintarray"], function(Base64, StringIntArray) {

    var START_VAL = -1,
        CHUNK_SIZE = 32,
        WIDTH = Base64.width();

    function intDiv(a,b) {
        var result = a/b;
        return (result>=0) ?Math.floor(result) : Math.ceil(result);
    }

    function SimpleSelectIndex(data) {
        this.data = data;
        this.directory = new StringIntArray();
    }

    SimpleSelectIndex.prototype.create = function(nBits) {
        var nChars = 1 + intDiv(nBits, WIDTH);
        this.init((nChars < this.data.length) ? nChars : this.data.length);
        return this;
    }

    SimpleSelectIndex.prototype.load = function(directoryData) {
        this.directory.set(directoryData);
        return this;
    }

    SimpleSelectIndex.prototype.getData = function() {
        return this.data;
    }

    SimpleSelectIndex.prototype.getDirectory= function() {
        return this.directory.toString();
    }

    SimpleSelectIndex.prototype.size = function() {
        return this.directory.size();
    }

    SimpleSelectIndex.prototype.select = function(index) {
        var state = new State(index, this.data, this.directory);
        while (state.getCount() < index) {
            state.step();
        }
        return state.getIndex();

    }


    SimpleSelectIndex.prototype.init = function(nChars) {
        var curCount = 0,
           index = 0,
           totalZero = 0,
           totalBits = 0,
           c, nZeroBits, nextCount, nBitsToComplete, charIndex;
        for (var i = 0; i < nChars; i++) {
            c = this.data.charAt(i);
            nZeroBits = WIDTH - Base64.bits(c);
            totalZero += nZeroBits;
            totalBits += WIDTH;
            nextCount = curCount + nZeroBits;
            if (nextCount < CHUNK_SIZE) {
                index = totalBits;
                curCount = nextCount;
            }  else {
                //assert nextCount >= CHUNK_SIZE;
                nBitsToComplete =  CHUNK_SIZE - curCount;
                charIndex  = this.findZeroBit(nBitsToComplete, c);
                index += charIndex;
                this.directory.add(index);
                curCount = nZeroBits - nBitsToComplete;
                index = totalBits;
            }
        }
    }

    SimpleSelectIndex.prototype.findZeroBit = function(i, c) {
        var toFind, cVal, val;

        if (i == 0) {
            return 0;
        }
        toFind = i;
        cVal = Base64.index(c);
        for (var j = WIDTH - 1; j >= 0; j--) {
            val = (1<<j) & cVal;
            if (val == 0) {
                toFind--;
                if (toFind == 0) {
                    return WIDTH - 1 - j;
                }
            }
        }
        //assert false : "Shouldn't be able to get here";
        return START_VAL;
    }

    function State(bitCount, data, directory) {
        this.targetCount = bitCount;
        this.data = data;

        this.currentCount = 0;
        this.currentOffset = 0;
        this.currentChar = '\0';

        this.init(directory);

    }

    State.prototype.init = function(directory) {
        var chunk = intDiv(this.targetCount, CHUNK_SIZE) - 1,
            startCount, startPosition;

        if (chunk >= directory.size()) {
            LOG.debug("oops");
        }
        startCount = (chunk == START_VAL) ? 0 : (1 + chunk) * CHUNK_SIZE;
        startPosition = (chunk == START_VAL) ? -1 : directory.get(chunk);

        this.currentCount = startCount;

        // currentChar/currentOffset point to next bit beyond currentCount except when targetCount is reached
        this.currentChar = (startPosition == START_VAL) ? 0 : intDiv(startPosition,WIDTH);
        this.currentOffset = (startPosition == START_VAL) ? -1 : startPosition % WIDTH;
        if (this.currentCount < this.targetCount) {
            this.advance();
        }
    }

    State.prototype.advance = function() {
        this.currentOffset++;
        if (this.currentOffset > 0 && this.currentOffset % WIDTH == 0) {
            this.currentChar++;
            this.currentOffset = 0;
        }
    }
    State.prototype.getIndex = function() {
        return (this.currentCount == 0) ? -1 : this.currentChar * WIDTH +this. currentOffset;
    }

    State.prototype.getCount = function() {
        return this.currentCount;
    }

    State.prototype.value = function() {
        var value = Base64.index(this.data.charAt(this.currentChar)),
            offset = WIDTH-1-this.currentOffset;
        return  (1<<offset) & value;
    }

    State.prototype.step = function() {
        var val, bits;
        if (this.currentOffset > 0) {
            val = this.value();
            if (val == 0) {
                this.currentCount++;
            }
            if (this.currentCount < this.targetCount) {
                this.advance();
            }
        } else {
            bits = WIDTH - Base64.bits(this.data.charAt(this.currentChar));
            if (this.currentCount + bits < this.targetCount) {
                this.currentCount += bits;
                this.currentChar++;
                this.currentOffset = 0;
            } else {
                val = this.value();
                if (val == 0) {
                    this.currentCount++;
                }
                if (this.currentCount < this.targetCount) {
                    this.currentOffset++;
                }
            }
        }
        return this.currentCount;
    }

    return SimpleSelectIndex;

});