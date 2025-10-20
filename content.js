
document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText.length > 0) {
      
        console.log("Content Script Sending Text:", selectedText.substring(0, 50) + '...'); 
        
        chrome.runtime.sendMessage({
            action: "textSelected",
            text: selectedText
        });
    }
});