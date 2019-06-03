let session = newSessionObject();

function newSessionObject() {
    return {
        isPlaying: false,
        windowId: null,
        timerId: null,
        interval: 5,
    }
}

function showNextTab(isFirstCycle = false) { 

    // break out infinite loop
    if (!session.isPlaying) return;

    session.timerId = setTimeout(function(){
        chrome.tabs.query({
            windowId: session.windowId,
        }, function(tabs){
            var t = tabs.find(function(e) {
                if (e.highlighted) return true;
            });
            var nextIndex =  t.index + 1 >= tabs.length ? 0 : t.index + 1;
            console.log("switch to next tab");
            chrome.tabs.highlight({ 'tabs': nextIndex });
        });
        setTimeout(() => showNextTab(false), session.interval * 1000)
    }, session.interval * 1000);
}

function pause() {
    clearTimeout(session.timerId);
    session.isPlaying = false;
}

function play() {
    session = newSessionObject();
    session.isPlaying = true;
    session.windowId = chrome.windows.WINDOW_ID_CURRENT;
    showNextTab(true)
}

chrome.browserAction.onClicked.addListener(function(){
    session.isPlaying ? pause() : play()
});
