// Variables

let startTime;
let powerDraw;
let gcd = 0.04;
const pue = 1.1;

// Detect

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "AI-OPEN") {
        startTime = Date.now();
        powerDraw = msg.powerDraw;
        sendResponse({ ok: true});
    }

    if (msg.type === "GET_DATA") {
        sendResponse({
            startTime, powerDraw, gcd, pue
        });
    }
});

//Find Grid Carbon Density
//let userLoc = console.log("What country do you live in? Please enter its full name in double quotation marks.")
async function lookUpCountry(userLoc) {
    const response = await fetch(chrome.runtime.getURL("carbon-intensity-training.csv"));
    const csvText = await response.text();
    const dataset = Papa.parse(csvText, {header: true}).data;
    const match = dataset.find(row => row.name.toLowerCase() === userLoc.toLowerCase());
    gcd = Number(match?.gcd);
    console.log(gcd);
}
