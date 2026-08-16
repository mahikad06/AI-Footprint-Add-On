document.addEventListener(
    "DOMContentLoaded", async()=>{
        const data = await chrome.storage.local.get([
            "userLoc", "overlayEnabled" 
        ]);
        document.getElementById("country").value=data.userLoc || "";
        document.getElementById("overlay").checked=data.overlayEnabled ?? true;
    }
);

document.getElementById("back").onclick=()=>{
    location.href="main.html";
};

document.getElementById("save").onclick=()=>{
    const country = document.getElementById("country").value;
    chrome.runtime.sendMessage({
        type: "USER-INPUT", userLoc: country
    });
    chrome.storage.local.set({
        userLoc: country
    });
};

document.getElementById("overlay").onchange=(e)=>{
    chrome.storage.local.set({
        overlayEnabled: e.target.checked
    });
};

