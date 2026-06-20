// Functions
function calcEmissions(time, pD, pue, gcd) {
    emissions = time * pD * pue * gcd;
    return emissions;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

let hours; 
let minutes;
let seconds;
let dayElapsed = 0;

function updateTime(start) {
    const elapsedTime = dayElapsed + (Date.now() - start); 

    hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    seconds = Math.floor((elapsedTime / 1000) % 60);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}



// Emissions Calculation 

//let chatgpt = "https://chatgpt";
//let claude = "https://claude";
//let gemini = "https://gemini.google";
let displayEm;

document.addEventListener('DOMContentLoaded', () => {
    function updateUI() {
        chrome.runtime.sendMessage ({ type: "GET_DATA"}, (data) => {
        if (!data || !data.startTime) {
            document.getElementById("display").textContent = "00:00:00";
            document.getElementById("emissions").textContent = "0.000000 kg CO2";
            return;
        }
        
        document.getElementById("display").textContent = updateTime(data.startTime);
        const elapsed = dayElapsed + (Date.now() - data.startTime);
        const time = elapsed / (1000 * 60 * 60);
        
        const emissions = calcEmissions(time, data.powerDraw, data.pue, data.gcd);
        document.getElementById("emissions").textContent = `${emissions.toFixed(6)} kg CO2`;
        });
    } 
    updateUI();
    setInterval(updateUI, 1000);
})

chrome.runtime.onMessage.addListener ((msg, sender, sendResponse) => {
    if (msg.type === "AI-CLOSE") {
        dayElapsed += Date.now() - msg.startTime;
    }
})

