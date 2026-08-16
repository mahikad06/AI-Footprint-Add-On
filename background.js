// Variables

let startTime;
let powerDraw;
let gcd = 0.384;
const pue = 1.1;
let dayElapsed;

// Detect

const initialState = chrome.storage.local.get(["startTime", "dayElapsed", "powerDraw", "gcd"], data => {
    startTime = data.startTime || null;
    dayElapsed = data.dayElapsed || 0;
    powerDraw = data.powerDraw || 0;
    gcd = data.gcd || 0.384;
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    initialState.then(async() => {
    if (msg.type === "AI-OPEN") {
        resetDay().then(() => {
            if (!startTime) startTime = Date.now();
            powerDraw = msg.powerDraw;
            chrome.storage.local.set({
                startTime, powerDraw
            });
            sendResponse({ ok: true});
            });
        return true;
    }

    if (msg.type === "GET_DATA") {
        resetDay().then(() => {
            sendResponse({
                startTime, powerDraw, gcd, pue, dayElapsed
            });
        });
        return true;
    }

    if (msg.type === "USER-INPUT") {
        lookUpCountry(msg.userLoc).then(value => {
            gcd = value;
            chrome.storage.local.set({ gcd });
            sendResponse({
                ok: true, gcd
            });
        });
        return true;
  }
    })
});

function checkActiveTab() {
    chrome.tabs.query({active:true, currentWindow:true}, tabs => {
        
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        };
        
        if (!tabs.length || tabs.length === 0) { 
            return;
        };
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
                saveDailyHistory();
            }
        }
    });
}

chrome.tabs.onActivated.addListener(checkActiveTab);
chrome.tabs.onUpdated.addListener(checkActiveTab);
chrome.windows.onFocusChanged.addListener(checkActiveTab);

//Day Reset

let currentDay;

async function resetDay() {

    const today = new Date().toLocaleDateString();
    const data = await chrome.storage.local.get([
        "currentDay", "dayElapsed", "startTime"
    ]);

    if (today !== data.currentDay) {
        if (data.currentDay && data.dayElapsed) {
            await saveDailyHistory(data.currentDay, data.dayElapsed);
        };
        currentDay = today;
        dayElapsed = 0;
        startTime = null;
        await chrome.storage.local.set({
            currentDay, dayElapsed, startTime
        });
    }
};


//Find Grid Carbon Density
 
async function lookUpCountry(userLoc) {
    const response = await fetch(chrome.runtime.getURL("updated-carbon-intensity-electricity.csv"));
    const csvText = await response.text();
    const rows = csvText.trim().split("\n");
    console.log(rows);

    rows.shift();
    for (const row of rows) {
        const column = row.split(",");
        const country = column[0].trim();
        if (country.toLowerCase() === userLoc.toLowerCase()) {
            const gcd = Number(column[3]) / 1000;
            await chrome.storage.local.set({
                userLoc, gcd
            });
            return gcd;
        }
    }
    return 0.384;
};

//Daily History

async function saveDailyHistory(date= new Date().toLocaleDateString(), elapsed = dayElapsed) {
 //   const today = new Date()
 //       .toISOString()
 //       .split("T")[0];
    const data = await chrome.storage.local.get([
        "history"//, "dayElapsed"
    ]);
    let history = data.history || {};
    history[date] = elapsed || 0;

    //keeps only last 7 days; change when i implement monthly
    const dates = Object.keys(history).sort().slice(-7);
    const trimmed = {};
    dates.forEach(date=>{
        trimmed[date] = history[date];
    });

    await chrome.storage.local.set({
        history: trimmed
    });
}