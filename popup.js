

document.addEventListener('DOMContentLoaded', function() {
    const messageDisplay = document.getElementById('message');
    
    

function createSummary(text) {
  
    let inputText = String(text || '').trim().replace(/\s+/g, ' '); 

    if (inputText.length === 0) {
        return 'No text selected yet.';
    }
    
    
    if (inputText.length > 200) {
        return inputText.substring(0, 200) + '...'; 
    }
    
    
    if (inputText.includes(' ')) {
        return inputText + '...'; 
    }
    
   
    return inputText;
}



    
    chrome.storage.local.get(['lastSelection'], function(result) {
        if (messageDisplay) {
            const selectedText = result.lastSelection;
            const summary = createSummary(selectedText);
            
            messageDisplay.textContent = summary;
            messageDisplay.style.color = selectedText ? 'darkgreen' : 'gray'; 
        }
    });

  
});