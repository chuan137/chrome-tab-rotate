$(function(){
    $('#winid').append(chrome.windows.WINDOW_ID_CURRENT);

    var ntabs;
    chrome.tabs.query({currentWindow: true}, function(t){
        ntabs = t.length;
    });

    $('#play').click(function(){
        chrome.tabs.query({
            currentWindow: true, 
            highlighted: true
        }, function(t){
            var currentIdx = t[0].index;
            var nextIdx = currentIdx === ntabs - 1 ? 0 : currentIdx + 1
            chrome.tabs.highlight({ 'tabs': nextIdx });
        });
    });
});