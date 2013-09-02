Client-side pure JavaScript Trie
================================

A pure javascript client-side trie-based dictionary, which is
compact and can do fast look-ups.

The library is pretty-much a direct copy of code from [Steve
Hanov](http://stevehanov.ca/blog/index.php?id=120).

The changes I've made are (a) set up for `RequireJS`, and (b) added the
`SimpleSelectIndex` class to speed up word lookup.  This was needed for a
a [Boggle Solver](http://solveboggle.appspot.com) I made.

You can try the code out by downloading it and loading
`index.html` into a browser.  A demo is available [here](http://cilogi.github.io/jstrie/index.html)



