let session = newSessionObject();
let debug = true;

function newSessionObject() {
    return {
        isPlaying: false,
        windowId: null,
        timerId: null,
        interval: 3,
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
            if (debug) {
                console.log("switch to tab " + nextIndex.toString() + " in window " + session.windowId.toString());
            }
            chrome.tabs.highlight({windowId: session.windowId, tabs: nextIndex });
        });
        setTimeout(showNextTab, session.interval * 1000)
    }, session.interval * 1000);
}

function pause() {
    chrome.browserAction.setIcon({ path: 'img/Play-38.png' });
    clearTimeout(session.timerId);
    session.isPlaying = false;
}

function play() {
    chrome.browserAction.setIcon({ path: 'img/Pause-38.png' });
    session = newSessionObject();
    session.isPlaying = true;
    chrome.windows.getCurrent(function(window) {
        session.windowId = window.id;
    })
    showNextTab(true)
}

chrome.browserAction.onClicked.addListener(function(){
    session.isPlaying ? pause() : play()
});
