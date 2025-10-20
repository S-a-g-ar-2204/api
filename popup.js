// popup.js - Simplified to only READ from storage

document.addEventListener('DOMContentLoaded', function() {
    const messageDisplay = document.getElementById('message');
    
    // popup.js (Focusing ONLY on the createSummary function)

function createSummary(text) {
    // 1. Clean up and validate the text
    let inputText = String(text || '').trim().replace(/\s+/g, ' '); 

    if (inputText.length === 0) {
        return 'No text selected yet.';
    }
    
    // Check if the text is VERY long (over 200 chars)
    if (inputText.length > 200) {
        return inputText.substring(0, 200) + '...'; // Summarize and add ellipsis
    }
    
    // Check if the text is short but contains multiple words (i.e., it's a phrase)
    // If it's a phrase, add an ellipsis for visual confirmation
    if (inputText.includes(' ')) {
        return inputText + '...'; 
    }
    
    // If it's just one word or a very short phrase, return it as is.
    return inputText;
}

// ... (The rest of your popup.js code follows) ...

    // --- Initial Load: Check storage immediately and reliably ---
    chrome.storage.local.get(['lastSelection'], function(result) {
        if (messageDisplay) {
            const selectedText = result.lastSelection;
            const summary = createSummary(selectedText);
            
            messageDisplay.textContent = summary;
            messageDisplay.style.color = selectedText ? 'darkgreen' : 'gray'; 
        }
    });

    // MESSAGE LISTENER IS REMOVED!
});