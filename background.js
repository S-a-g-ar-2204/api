 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "textSelected" && request.text) {
        
        
        chrome.storage.local.set({ lastSelection: request.text }, function() {
       
        });
        
   return true; 
    }
});