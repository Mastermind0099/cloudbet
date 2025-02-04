document.getElementById("start").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "start" });
    alert("Auto Bet Started!");
});

document.getElementById("stop").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop" });
    alert("Auto Bet Stopped!");
});
