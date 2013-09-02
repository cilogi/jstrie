define(['jquery', "trie/trie", "trie/compressedtrie"], function($, Trie, CompressedTrie) {

    var trie = null, compressedTrie = null;

    function loadDict(inputString) {
        var i,
            words = inputString.split(/\s+/).sort();

        trie = new Trie();
        for (i = 0; i < words.length; i++) {
            if (words[i].match(/^[a-z]+$/)) {
                trie.insert(words[i]);
            }
        }
        compressedTrie = compress();
    }

    function compress() {
        var nodeCount = trie.getNodeCount(),
            trieData = trie.encode();

        return new CompressedTrie(trieData, nodeCount);
    }

    function lookup(word) {
        return compressedTrie.lookup(word);
    }

    return {
        loadDict: loadDict,
        compressedTrie : function() { return JSON.stringify(compressedTrie.toJSON(), null, "\t"); },
        lookup: lookup
    }
})