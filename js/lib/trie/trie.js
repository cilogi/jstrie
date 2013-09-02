define(["trie/bitwriter"], function(BitWriter) {

    function TrieNode(letter) {
        this.letter = letter;
        this.final = false;
        this.children = [];
    }

    function Trie() {
        this.init();
    }

    Trie.prototype.init = function() {
        this.previousWord = "";
        this.root = new TrieNode(' ');
        this.cache = [this.root];
        this.nodeCount = 1;
    }

    Trie.prototype.getNodeCount = function() {
        return this.nodeCount;
    }

    Trie.prototype.insert = function(word) {
        var commonPrefix = 0;
        for (var i = 0; i < Math.min(word.length, this.previousWord.length);
        i++) {
            if (word[i] !== this.previousWord[i]) {
                break;
            }
            commonPrefix += 1;
        }

        this.cache.length = commonPrefix + 1;
        var node = this.cache[this.cache.length - 1];

        for (i = commonPrefix; i < word.length; i++) {
            var next = new TrieNode(word[i]);
            this.nodeCount++;
            node.children.push(next);
            this.cache.push(next);
            node = next;
        }

        node.final = true;
        this.previousWord = word;
    }

    Trie.prototype.apply = function(fn) {
        var level = [this.root];
        while (level.length > 0) {
            var node = level.shift();
            for (var i = 0; i < node.children.length; i++) {
                level.push(node.children[i]);
            }
            fn(node);
        }
    }

    Trie.prototype.encode = function() {
        var bits = new BitWriter();
        bits.write(0x02, 2);
        this.apply(function(node) {
            for (var i = 0; i < node.children.length; i++) {
                bits.write(1, 1);
            }
            bits.write(0, 1);
        });

        var a = ("a").charCodeAt(0);
        this.apply(function(node) {
            var value = node.letter.charCodeAt(0) - a;
            if (node.final) {
                value |= 0x20;
            }

            bits.write(value, 6);
        });

        return bits.getData();
    }

    return Trie;

});
