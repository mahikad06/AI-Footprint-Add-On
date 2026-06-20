
let chatgpt = "https://chatgpt";
let claude = "https://claude";
let gemini = "*://gemini.google.com/*";
let powerDraw;

if (location.hostname.includes("chatgpt.com")) { 
    powerDraw = 0.34;
}
if (location.hostname.includes("claude.ai")) {
    powerDraw = 0.84;
}
if (location.hostname.includes("gemini.google.com")) {
    powerDraw = 0.24;
}

if (powerDraw !== undefined) {
    chrome.runtime.sendMessage({
        type: "AI-OPEN", powerDraw: powerDraw
    });
}
