console.log("Content script running...");

// Function to check for new bets
function checkForNewBets() {
    let betElements = document.querySelectorAll(".bet-offer-class"); // Adjust selector as needed
    if (betElements.length > 0) {
        let betDetails = extractBetDetails(betElements[0]); // Get first available bet
        sendToChatGPT(betDetails);
    } else {
        console.log("No new bets found.");
    }
}

// Function to extract bet details
function extractBetDetails(betElement) {
    return {
        team1: betElement.querySelector(".team1-name")?.innerText || "Unknown",
        team2: betElement.querySelector(".team2-name")?.innerText || "Unknown",
        odds: betElement.querySelector(".odds")?.innerText || "N/A"
    };
}

// Function to send data to ChatGPT
function sendToChatGPT(betDetails) {
    let chatGPT_URL = "https://chatgpt.com/g/g-p-675ef484c9fc8191b5e64aae7cbb85f5-esports-fifa-gt-nations-league-analysis-15-dec/c/679149bc-64dc-8003-95a8-ad6178a27b3b";
    navigator.clipboard.writeText(`Match: ${betDetails.team1} vs ${betDetails.team2}\nOdds: ${betDetails.odds}\nPaste into ChatGPT: ${chatGPT_URL}`);
    window.open(chatGPT_URL, "_blank");
}

// Function to place a bet automatically
function placeBet(prediction) {
    let betOption = prediction.match(/Recommended Bet: (.+?) at (\\d+.\\d+)/);
    if (betOption) {
        console.log(`Placing $1 bet on: ${betOption[1]} at odds ${betOption[2]}`);
        document.querySelector(".bet-button")?.click();
    } else {
        console.log("No valid bet option found.");
    }
}

// Function to monitor ChatGPT result and place bet
function monitorChatGPTResult() {
    setInterval(() => {
        let chatBox = document.querySelector(".chat-result"); // Adjust selector as needed
        if (chatBox) {
            let prediction = chatBox.innerText;
            console.log("Prediction received from ChatGPT:", prediction);
            placeBet(prediction);
        }
    }, 5000);
}

// Start functions
setTimeout(checkForNewBets, 5000);
monitorChatGPTResult();
