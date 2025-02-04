console.log("Cloudbet Auto Bet Extension Loaded");

// Check every 1 minute for new bets
setInterval(() => {
    chrome.tabs.query({ url: "https://www.cloudbet.com/*" }, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            });
        }
    });
}, 60000);
