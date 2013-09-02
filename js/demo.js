
require.config({
    baseUrl: "js",
    catchError : {
        define: true
    },
    // 3rd party script alias names
    paths: {
        "jquery" : "http://code.jquery.com/jquery-1.10.1.min",
        "trie" : "lib/trie"
    }


});


require(['jquery', 'demo/demo-app'], function ($, demoApp) {

    // What to do on button presses
    $(document).ready(function() {
        $("#create").click(function(e) {
            var val = $("#dict").val();
            demoApp.loadDict(val.toLowerCase());
            $("#trie").val(demoApp.compressedTrie());
            $("#lookup-button").removeAttr('disabled');
            $("#result").html("");
            e.preventDefault();
            return false;
        });

        $("#lookup-button").click(function(e) {
            var isIn, word = $("#lookup").val().trim().toLowerCase();
            if (word && word.length) {
                isIn = demoApp.lookup(word);
                $("#result").html(word + (isIn ? " is in the dictionary" : " is not in the dictionary"));
            }
            e.preventDefault();
            return false;
        });
    });

});
