
let chatgpt = "https://chatgpt";
let claude = "https://claude";
let gemini = "https://gemini.google";
let powerDraw;

if (location.hostname.includes("openai.com")) { 
    powerDraw = 0.34;
}
if (location.hostname.includes("claude.ai")) {
    powerDraw = 0.84;
}
if (location.hostname.includes("gemini.google.com")) {
    powerDraw = 0.24;
}

chrome.runtime.sendMessage({
    type: "AI-OPEN", powerDraw
});