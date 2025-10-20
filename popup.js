// popup.js

// Helper function to get the text from storage
function getSelectedTextFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['lastSelection'], function(result) {
            // Resolve with the text or an empty string if not found
            resolve(result.lastSelection || '');
        });
    });
}

(async () => {
    const outputElement = document.getElementById('summary-output');
    
    // 1. Availability Check (can run immediately)
    outputElement.textContent = "Checking API availability...";
    const availability = await Summarizer.availability();
    
    if (availability === 'unavailable') {
        outputElement.textContent = "Summarizer API is unavailable on this device.";
        return;
    }
    
    // 2. Attach the main logic to the button click event
    document.getElementById('summarize-button').addEventListener('click', async () => {
        
        outputElement.textContent = "Retrieving text and preparing summarizer...";

        // --- RETRIEVE TEXT FROM STORAGE ---
        const longText = await getSelectedTextFromStorage(); 
        
        if (longText.length === 0) {
            outputElement.textContent = "Error: No text was selected on the main page.";
            return;
        }

        const options = {
            sharedContext: 'The user selected this text from a webpage.',
            type: 'key-points',
            format: 'markdown',
            length: 'medium',
            outputLanguage: 'en', 
            // Add monitor logic if needed, but omitted for simplicity here
        };

        let summarizer;
        
        // This time, isActive *should* be true because of the click
        if (navigator.userActivation.isActive) {
            try {
                // Update message while creating the model
                outputElement.textContent = "Creating Summarizer model...";
                summarizer = await Summarizer.create(options);
            } catch (error) {
                outputElement.textContent = "Error: Failed to create Summarizer. Check console for details.";
                console.error("Summarizer Creation Error:", error);
                return;
            }
        }
        
        if (!summarizer) {
            outputElement.textContent = "Error: Summarizer creation failed (user activation?).";
            return; 
        }

        // 3. Summarize and Output
        outputElement.textContent = "Generating summary of selected text...";
        
        const summary = await summarizer.summarize(longText, {
            context: 'This article is intended for a tech-savvy audience.',
        });
        
        // Display the final summary
        outputElement.textContent = summary;
    });

    // Update initial message after availability check is done and before click
    outputElement.textContent = "API ready. Select text on the page and click 'Summarize'.";

})();