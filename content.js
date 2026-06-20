
let chatgpt = "https://chatgpt";
let claude = "https://claude";
let gemini = "*://gemini.google.com/*";
let powerDraw;

if (location.hostname.includes("chat.openai.com")) { 
    powerDraw = 0.34;
}
if (location.hostname.includes("claude.ai")) {
    powerDraw = 0.84;
}
if (location.hostname.includes("gemini.google.com")) {
    powerDraw = 0.24;
}

if (location.hostname.includes("openai.com" || "claude.ai" || "gemini.google.com")) { 
    chrome.runtime.sendMessage({
        type: "AI-OPEN", powerDraw
    });
}

window.addEventListener ("beforeunload"), () => { 
    chrome.runtime.sendMessage({
        type: "AI-CLOSE"
    });
} 