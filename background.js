chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.action.onClicked.addListener(async(tab) => {
    if (tab.url.startsWith(chatgpt) || tab.url.startsWith(claude) || tab.url.startsWith(gemini)) {
        const prevState = await chrome.action.getBadgeText({tabId: tab.id});
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });
    }
});

// Stopwatch
let [seconds, minutes, hours] = [0,0,0];
let timer = null;
let display = document.getElementById('display');

document.addEventListener('keydown', () => {
    if (text == "ON") {
       timer =  setInterval(stopwatch, 1000);
    }
});