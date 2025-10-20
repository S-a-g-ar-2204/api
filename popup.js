// popup.js

// Helper function to get the text from storage
function getSelectedTextFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['lastSelection'], function(result) {
            resolve(result.lastSelection || '');
        });
    });
}

// Function to handle both summary types
async function handleSummarize(isDeep) {
    const outputElement = document.getElementById('summary-output');
    
    if (outputElement.textContent.includes("unavailable")) {
         outputElement.textContent = "Summarizer API is unavailable on this device.";
         return;
    }
    
    outputElement.textContent = `Retrieving text and preparing for ${isDeep ? 'Deep Summary' : 'Summary'}...`;

    // --- RETRIEVE TEXT FROM STORAGE ---
    const longText = await getSelectedTextFromStorage(); 
    
    if (longText.length === 0) {
        outputElement.textContent = "Error: No text was selected on the main page.";
        return;
    }

    // FIX: Using 'key-points' for type but adjusting length and context for deeper summary.
    const options = {
        sharedContext: isDeep 
            ? 'The user selected this text from a webpage. Provide a comprehensive, detailed analysis.' 
            : 'The user selected this text from a webpage. Provide a concise, key-points summary.',
        type: 'key-points', // Keep a known type value
        format: 'markdown',
        length: isDeep ? 'long' : 'medium', // Use 'long' for deep summary
        outputLanguage: 'en', 
    };

    let summarizer;
    
    if (navigator.userActivation.isActive) {
        try {
            // Update message while creating the model, noting the 'Long' length
            outputElement.textContent = `Creating Summarizer model (${isDeep ? 'Long' : 'Medium'})...`;
            summarizer = await Summarizer.create(options);
        } catch (error) {
            // Provide specific error feedback
            outputElement.textContent = `Error: Failed to create Summarizer for ${isDeep ? 'Deep' : 'Standard'} mode. Check console for details.`;
            console.error(`Summarizer Creation Error (Deep=${isDeep}):`, error);
            return;
        }
    }
    
    if (!summarizer) {
        outputElement.textContent = "Error: Summarizer creation failed (user activation?).";
        return; 
    }

    // 3. Summarize and Output
    outputElement.textContent = `Generating ${isDeep ? 'Deep' : ''} Summary... This may take longer.`;
    
    const summary = await summarizer.summarize(longText, {
        // Use a strong context here to ensure detailed output
        context: isDeep 
            ? 'This article is intended for an expert audience. Provide a comprehensive, detailed analysis.'
            : 'This article is intended for a tech-savvy audience. Provide only the key points.',
    });
    
    // Display the final summary
    outputElement.textContent = summary;
}

(async () => {
    const outputElement = document.getElementById('summary-output');
    
    // 1. Availability Check (runs on popup open)
    outputElement.textContent = "Checking API availability...";
    const availability = await Summarizer.availability();
    
    if (availability === 'unavailable') {
        outputElement.textContent = "Summarizer API is unavailable on this device.";
        return;
    }
    
    // 2. Attach listeners
    
    // Original Summarize button
    document.getElementById('summarize-button').addEventListener('click', () => handleSummarize(false));
    
    // Deep Summarize button
    document.getElementById('deep-summarize-button').addEventListener('click', () => handleSummarize(true));
    
    // Copy button
    document.getElementById('copy-button').addEventListener('click', () => {
        const textToCopy = outputElement.textContent;
        // Check if there's actual summary text before copying initial message
        if (textToCopy.startsWith("API ready") || textToCopy.startsWith("Checking") || textToCopy.startsWith("Error")) {
            alert("Nothing to copy yet! Generate a summary first.");
            return;
        }
        
        // Use the modern Clipboard API
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = outputElement.textContent;
            outputElement.textContent = "Summary Copied!";
            setTimeout(() => {
                // Restore the original text after a short delay
                outputElement.textContent = originalText;
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            outputElement.textContent = "Copy failed. (See console for details)";
        });
    });

    // Update initial message
    outputElement.textContent = "API ready. Select text on the page and click 'Summarize'.";

})();