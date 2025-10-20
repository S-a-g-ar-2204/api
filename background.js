// background.js

// This listener runs constantly and waits for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "textSelected" && request.text) {
        
        // Save the new text to local storage immediately and reliably
        chrome.storage.local.set({ lastSelection: request.text }, function() {
            // Optional: Log success to the background console
            // console.log("Background: Saved new text to storage.");
        });
        
        // This message is handled asynchronously, so we return true
        return true; 
    }
});