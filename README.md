# Client-side pure JavaScript Trie

A pure javascript client-side trie-based dictionary, which is
compact and can do fast look-ups.

The library is pretty-much a direct copy of code from [Steve
Hanov](http://stevehanov.ca/blog/index.php?id=120).

The changes I've made are (a) set up for `RequireJS`, and (b) added the
`SimpleSelectIndex` class to speed up word lookup.  This was needed for a
a [Boggle Solver](http://solveboggle.appspot.com) I made.

You can try the code out by downloading it and loading
`index.html` into a browser.  A demo is available [here](http://cilogi.github.io/jstrie/index.html)

## Motivation

The original motivation was to solve Boggle client-side, with the
following requirements:

* the amount of data uploaded should be small, for a fast start-up;
* the time for code to initialize to be fast, again to enable a fast start-up;
* and the run-time performance should be "fast enough" so that users
  aren't aware of waiting around for results.

These are non-trivial requirements to implement in a webapp such as
Boggle where a large dictionary is needed and a significant amount of
computation takes place to "solve" a setup.  The upside is that, if
these requirements _can_ be met, a large number of users can be
supported at low cost as all the computation is done
client-side. The other advantage of a client-side solution is that it
can work offline, since nothing is required from the server in routine
operation.

There are, of course, other applications of a large but compact
dictionary, with fast lookup, stored client-side.  

### Succinct Tries

John Resig wrote a series of blog posts ([here][1], [here][2] and
[here][3]) a couple of years ago, studying a similar problem --
looking up words from a dictionary.

An interesting solution Resig looked at was supplied by
[Steve Hanov][4] who used a succinct data structure to implement a
[Trie][15].

Succinct data structures were introduced by Jacobson (G. J. Jacobson 1988)
in his PhD thesis (a summary paper can be found in
[(G. Jacobson 1989))][16]. They have interesting properties, being both space
and time efficient. Succinct trees are asymptotically space-optimal
yet can be used directly, without decompression or other
pre-processing, and perform within a small constant time factor of
pointer-based data structures.

This is very useful for our problem: the data structures can be sent
from the server without taking up too much space, and the client does
not need to decode the structures in order to process them.  This is
important for JavaScript as [Resig found][2] that decompressing a trie
can take a long time on mobile devices.

Hanov's solution, for which he provides [JavaScript][5] code,
implements Jacobson's ideas with a twist.  Bitstrings are stored in
[Base64][6], which means the data doesn't need to be decoded
client-side, at the expense of storing 6 bits of information in an
8-bit byte.

The only problem with Hanov's solution is that it is slow. I
downloaded a word list containing about `270,000` words from
[this file][8] [here][7] and found that using Hanov's trie Boggle took
about 20 seconds to solve on the HTC Desire, which is not acceptable.

For John Resig's problem, looking up a single word, Hanov's solution
is probably OK as only a few nodes of the Trie have to be searched.
The Boggle solver has to look at 3-5000 nodes of the trie as we're
doing an exhaustive search of the Boggle board and this is too slow by
at least an order of magnitude if we are to meet our run-time
performance requirements.

The bottleneck occurs with the algorithm for the `select`
function. `select(i)` finds the location in a bit string of the `i`th
occurrence of the zero bit.  Hanov's implementation is based on the
`rank` function where `rank(i)` is the number of zero bits set up to
and including position `i`. These two functions are inverses, so that
if `rank(j) = k` then `select(k) = j`.  Hanov's algorithm does a
binary search over the `rank` function to determine select, and this
is slow.

I have implemented a simple alternative `select` function which stores
an array `S` where the `i`th element contains the value for
`select(i * N)` where `N` is set at `32`, but can be any number.  I've
tried `64` which uses half the space and takes about 30% longer. To
find `select(k)` we find `S[k/N]` and can then count the remaining
bits.  In effect each select is then looking for a value less than
`N`. Performance depends on the distribution of the zeros and ones
being reasonably uniform (which it is in this case).  The speedup is
significant -- in my tests a factor of about `14`.  This makes the
wait for a solution about a second on a slow phone, which is
acceptable.

Having implemented this solution it looks very similar to that
proposed, implemented and tested in [(Navarro and Providel 2012)][17]
for `select` queries.

----

So, we end up with a data structure, which is reasonably compact.  The
gzipped trie (ie the size sent over the wire) is `368,640` bytes,
while the gzipped dictionary is `470,298` bytes.  The uncompressed
dictionary is _much_ larger than the uncompressed trie of course. So using the
succinct structure saves space compared to the raw dictionary as well
as being optimised for word search, and we can do everything in
JavaScript with reasonable performance.

### Offline HTML

Setting up our web site/app to work offline is straightforward if we
use the [Offline cache][9] feature of HTML5 (well described
[here][10]).

## References

Jacobson, Guy Joseph. 1988. “Succinct static data structures.”
Pittsburgh, PA, USA.

[Jacobson, Guy. 1989.][16] “Space-efficient static trees and graphs.” In
Foundations of Computer Science, 1989., 30th Annual Symposium on,
549–554. IEEE.

[Navarro, Gonzalo, and Eliana Providel. 2012.][17] “Fast, small, simple
rank/select on bitmaps.” In Experimental Algorithms,
295–306. Springer.

[1]: http://ejohn.org/blog/dictionary-lookups-in-javascript/
[2]: http://ejohn.org/blog/javascript-trie-performance-analysis/
[3]: http://ejohn.org/blog/revised-javascript-dictionary-search/
[4]: http://stevehanov.ca/blog/index.php?id=120
[5]: http://www.hanovsolutions.com/trie/Bits.js
[6]: http://en.wikipedia.org/wiki/Base64
[7]: http://www.isc.ro/en/commands/lists.html
[8]: http://www.isc.ro/lists/twl06.zip
[9]: http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html
[10]: http://diveintohtml5.info/offline.html
[11]: http://en.wiktionary.org/
[12]: http://www.wordnik.com/
[13]: http://solveboggle.appspot.com/service
[14]: http://timniblett.github.com/solveboggle
[15]: http://en.wikipedia.org/wiki/Trie
[16]: http://www.cs.cmu.edu/afs/cs/project/aladdin/wwwlocal/compression/00063533.pdf
[17]: http://www.dcc.uchile.cl/~gnavarro/ps/sea12.1.pdf


