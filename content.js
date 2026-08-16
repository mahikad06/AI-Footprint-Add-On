
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
    createOverlay();
}

// Overlay Display

chrome.storage.local.get( ["overlayEnabled"], (data=>{
    if (data.overlayEnabled === false)
        return;
    createOverlay();
}));


function createOverlay(){ 
    if(document.getElementById("ai-footprint-widget"))
        return;
    const panel=document.createElement("div");
    panel.id="ai-footprint-widget";
    panel.innerHTML = `
        <h1 class="af-title"> 
            AI Footprint
        </h1>
        <div class="af-time">
            00:00:00
        </div>
        <div class="af-carbon">
            0.000000 kg CO2
        </div>
        <button id="af-toggle">
            Hide
        </button>`
    document.body.appendChild(panel);
    const style=document.createElement("style");
    document.head.appendChild(style);
    document.getElementById("af-toggle").onclick=()=>{
        panel.style.display="none";
    };

    updateOverlay();
    setInterval(updateOverlay, 1000);
}

function updateOverlay(){
    chrome.runtime.sendMessage( 
        {type: "GET_DATA"},
    (data)=>{
        if(!data) return;

        let elapsed = data.dayElapsed + 
        (data.startTime ? Date.now()-data.startTime: 0);
        let hours = elapsed/(1000*60*60);
        let emissions = hours * data.powerDraw * data.pue * data.gcd;

        document.querySelector(".af-time").textContent=elapsed;
        document.querySelector(".af-carbon").textContent=`${emissions.toFixed(6)} kg CO2`;
    });
}
