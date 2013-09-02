define([], function () {

    function CompressedTrieNode(trie, index, letter, final, firstChild, childCount) {
        this.trie = trie;
        this.index = index;
        this.letter = letter;
        this.final = final;
        this.firstChild = firstChild;
        this.childCount = childCount;
    }

    CompressedTrieNode.prototype.getChildCount = function () {
        return this.childCount;
    }

    CompressedTrieNode.prototype.getChild = function (index) {
        return this.trie.getNodeByIndex(this.firstChild + index);
    }

    CompressedTrieNode.prototype.find = function(letter) {
        var j = 0,
            child;

        for (; j < this.getChildCount(); j++) {
            child = this.getChild(j);
            if (child.letter === letter) {
                return child;
            }
        }
        return null;
    }

    return CompressedTrieNode;

});