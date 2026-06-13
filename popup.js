// Functions
function calcEmissions(hours, pD, pue, gcd) {
    emissions = hours * pD * pue * gcd;
    return emissions;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}


function updateTime(start) {
    const elapsedTime = Date.now() - start;

    let hours = Math.floor(elapsedTime / (1000*60*60));
    let minutes = Math.floor(elapsedTime / (1000*60)%60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);

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
        const elapsed = Date.now() - data.startTime;
        const hours = elapsed / (1000 * 60 * 60);
        
        const emissions = calcEmissions(hours, data.powerDraw, data.pue, data.gcd);
        document.getElementById("emissions").textContent = `${emissions.toFixed(6)} kg CO2`;
        });
    }
    updateUI();
    setInterval(updateUI, 1000);
})



