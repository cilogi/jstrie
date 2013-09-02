define(["trie/compressedtrienode", "trie/rankdirectory", "trie/simpleselectindex", "trie/bitstring"],

function (CompressedTrieNode, RankDirectory, SimpleSelectIndex, BitString) {

    function CompressedTrie(data, directoryData, nodeCount) {
        this.init(data, directoryData, nodeCount);
    }

    CompressedTrie.prototype.init = function (data, nodeCount, directoryData) {
        this.data = new BitString(data);


        // The position of the first bit of the data in 0th node. In non-root
        // nodes, this would contain 6-bit letters.
        this.letterStart = nodeCount * 2 + 1;

        if (directoryData) {
            this.simpleSelect = new SimpleSelectIndex(data).load(directoryData);
        }  else {
            this.simpleSelect = new SimpleSelectIndex(data).create(this.letterStart);
        }
    }

    /**
     Retrieve the CompressedTrieNode of the trie, given its index in level-order.
     This is a private function that you don't have to use.
     */
    CompressedTrie.prototype.getNodeByIndex = function (index) {
        // retrieve the 6-bit letter.
        var final = this.data.get(this.letterStart + index * 6, 1) === 1,
            letter = String.fromCharCode(this.data.get(this.letterStart + index * 6 + 1, 5) + 'a'.charCodeAt(0)),
            firstChildC = this.simpleSelect.select(index + 1) - index;

        // Since the nodes are in level order, this nodes children must go up
        // until the next node's children start.
        var childOfNextNodeC = this.simpleSelect.select(index+2) -index -1;

        return new CompressedTrieNode(this, index, letter, final, firstChildC,
                childOfNextNodeC - firstChildC);
    }

    /**
     Retrieve the root node. You can use this node to obtain all of the other
     nodes in the trie.
     */
    CompressedTrie.prototype.getRoot = function () {
        return this.getNodeByIndex(0);
    }

    /**
     Look-up a word in the trie. Returns true if and only if the word exists
     in the trie.
     */
    CompressedTrie.prototype.lookup = function (word) {
        var j, child, childCount, node = this.getRoot();
        for (var i = 0; i < word.length; i++) {
            j = 0;
            childCount = node.getChildCount();
            for (; j < childCount; j++) {
                child = node.getChild(j);
                if (child.letter === word.charAt(i)) {
                    break;
                }
            }

            if (j === childCount) {
                return false;
            }
            node = child;
        }
        return node.final;
    }

    CompressedTrie.prototype.toJSON = function() {
        return {
            trie: this.data.getData(),
            simpleDirectory: this.simpleSelect.getDirectory(),
            nodeCount: (this.letterStart - 1)/2
        }
    }

    return CompressedTrie;
});