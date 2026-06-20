// Variables

let startTime;
let powerDraw;
let gcd = 0.384;
const pue = 1.1;
let dayElapsed;

chrome.storage.local.set({
    startTime, dayElapsed, powerDraw
});

// Detect

chrome.storage.local.get(["startTime", "dayElapsed", "powerDraw"], data => {
    startTime = data.startTime || null;
    dayElapsed = data.dayElapsed || 0;
    powerDraw = data.powerDraw || 0;
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "AI-OPEN") {
       if (!startTime) startTime = Date.now();
        powerDraw = msg.powerDraw;
        chrome.storage.local.set({
            startTime, powerDraw
        });
        sendResponse({ ok: true});
    }

    if (msg.type === "GET_DATA") {
        sendResponse({
            startTime, powerDraw, gcd, pue, dayElapsed
        });
    }

    //if (msg.type === "USER-INPUT") {
      //  lookUpCountry(msg.userLoc);
    //}
});

function checkActiveTab() {
    chrome.tabs.query({active:true, currentWindow:true}, tabs => {
        if (!tabs.length) return;
        const url = tabs[0].url || "";
        const isAI = 
            url.includes("chatgpt.com") ||
            url.includes("claude.ai") ||
            url.includes("gemini.google.com");
        if (isAI) {
            if(!startTime) {
                startTime = Date.now();
                chrome.storage.local.set({
                    startTime
                });
            }
        } else {
            if (startTime) {
                dayElapsed += Date.now() - startTime;
                startTime = null;
                chrome.storage.local.set({
                    startTime, dayElapsed
                });
            }
        }
    });
}

chrome.tabs.onActivated.addListener(checkActiveTab);
chrome.tabs.onUpdated.addListener(checkActiveTab);
chrome.windows.onFocusChanged.addListener(checkActiveTab);


//Day Reset

let currentDay;

chrome.storage.local.get(["currentDay"], (data) => {
    currentDay = data.currentDay || new Date().toDateString();
    const today = new Date().toDateString();
    if (today !== currentDay) {
        currentDay = today;
        dayElapsed = 0;
        chrome.storage.local.set({
            currentDay, dayElapsed
        });
    }
});

/*chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;

    const isAI = 
        changeInfo.url.includes("chatgpt.com") ||
        changeInfo.url.includes("claude.ai") ||
        changeInfo.url.includes("gemini.google.com");

    if (!isAI && startTime) {
        dayElapsed += Date.now() - startTime;
        //chrome.runtime.sendMessage({ 
        //    type: "AI-CLOSE", startTime
        //});
        startTime = null; 
        chrome.storage.local.set({
            dayElapsed, startTime
        });
    }
    
    if (isAI && !startTime) {
        startTime = Date.now();
        //chrome.runtime.sendMessage({
        //    type: "AI-OPEN", powerDraw
       // });
    }
});
*/
//Find Grid Carbon Density
//chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
 // if (msg.type === "USER-INPUT") { 
 //     userLoc = msg.userLoc;
 //     gcd = lookUpCountry(userLoc);
 // }
//})
/* 
async function lookUpCountry(userLoc) {
    const response = await fetch(chrome.runtime.getURL("carbon-intensity-training.csv"));
    const csvText = await response.text();
    const dataset = Papa.parse(csvText, {header: true}).data;
    const searchColumn = 0;
    const match = dataset.find(row => row[searchColumn].toLowerCase() === userLoc.toLowerCase());
    
    if (match) {
        gcd = (Number(match[3])) / 1000;
        console.log(gcd);
    }
    else {
        gcd = 0.384;
    }
    return gcd;
}
*/