// Chrome Extension: Cloudbet Auto Bet Placer
// This script will auto-detect upcoming FIFA GT Nations League bets, fetch predictions from ChatGPT, and place bets.

let autoBetActive = true;
const chatGPT_URL = "https://chatgpt.com/g/g-p-675ef484c9fc8191b5e64aae7cbb85f5-esports-fifa-gt-nations-league-analysis-15-dec/c/679149bc-64dc-8003-95a8-ad6178a27b3b";
const cloudbet_URL = "https://www.cloudbet.com/en/sports/esport-fifa/today";
const betAmount = 1; // Fixed bet amount

// Function to refresh Cloudbet page every 1 min
function refreshPage() {
    if (autoBetActive) {
        console.log("Refreshing Cloudbet page to check for new bets...");
        window.location.reload();
    }
}

// Function to check for upcoming GT Nations League bets
function checkForNewBets() {
    if (!autoBetActive) return;
    
    let bets = document.querySelectorAll(".jss209"); // Adjust selector based on Cloudbet UI
    bets = Array.from(bets).filter(bet => bet.innerText.includes("GT Nations League"));
    
    if (bets.length > 0) {
        console.log("New FIFA GT Nations League bet detected! Fetching details...");
        let betDetails = getBetDetails(bets[0]); // Fetch first available bet
        sendToChatGPT(betDetails);
    } else {
        console.log("No new FIFA GT Nations League bets found. Retrying in 1 min...");
    }
}

// Function to extract bet details from Cloudbet
function getBetDetails(betElement) {
    return {
        team1: betElement.querySelector(".team1-name")?.innerText || "Unknown",
        team2: betElement.querySelector(".team2-name")?.innerText || "Unknown",
        odds: betElement.querySelector(".odds")?.innerText || "N/A",
        matchLink: betElement.querySelector("a")?.href || "No link available"
    };
}

// Function to send data to ChatGPT chat
function sendToChatGPT(betDetails) {
    console.log("Sending bet details to ChatGPT...");
    navigator.clipboard.writeText(`Match: ${betDetails.team1} vs ${betDetails.team2}\nOdds: ${betDetails.odds}\nMatch Link: ${betDetails.matchLink}\nPaste into ChatGPT: ${chatGPT_URL}`);
    window.open(chatGPT_URL, "_blank");
}

// Function to place bet automatically
function placeBet(prediction) {
    let betOption = prediction.match(/Recommended Bet: (.+?) at (\d+\.\d+)/);
    if (betOption) {
        console.log(`Placing $${betAmount} bet on: ${betOption[1]} at odds ${betOption[2]}`);
        document.querySelector(".bet-button")?.click(); // Simulated click
    } else {
        console.log("No valid bet option found in prediction.");
    }
}

// Function to listen for ChatGPT result and place bet
function monitorChatGPTResult() {
    setInterval(() => {
        let chatBox = document.querySelector(".chat-result"); // Adjust selector based on ChatGPT UI
        if (chatBox && autoBetActive) {
            let prediction = chatBox.innerText;
            console.log("Prediction received from ChatGPT:", prediction);
            placeBet(prediction);
        }
    }, 5000);
}

// Stop button
function createStopButton() {
    let stopBtn = document.createElement("button");
    stopBtn.innerText = "Stop Auto Betting";
    stopBtn.style.position = "fixed";
    stopBtn.style.bottom = "10px";
    stopBtn.style.right = "10px";
    stopBtn.style.zIndex = "9999";
    stopBtn.addEventListener("click", () => {
        autoBetActive = false;
        console.log("Auto betting stopped.");
    });
    document.body.appendChild(stopBtn);
}

// Attach all functions to `window` for global access
window.checkForNewBets = checkForNewBets;
window.refreshPage = refreshPage;
window.sendToChatGPT = sendToChatGPT;
window.placeBet = placeBet;
window.monitorChatGPTResult = monitorChatGPTResult;
window.getBetDetails = getBetDetails;

console.log("✅ Bot Functions Successfully Attached to Window!");

// Initialize extension
function init() {
    createStopButton();
    setInterval(refreshPage, 60000); // Refresh page every 1 minute
    setInterval(checkForNewBets, 60000); // Check for new bets every 1 minute
    monitorChatGPTResult(); // Monitor ChatGPT result for placing bets
}

// Run script after page load
window.onload = init;
