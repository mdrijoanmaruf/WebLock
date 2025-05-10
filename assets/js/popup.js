document.addEventListener('DOMContentLoaded', function() {
    const lockStatusIndicator = document.getElementById('lockStatus');
    const lockStatusText = document.getElementById('lockStatusText');
    const lockNowBtn = document.getElementById('lockNowBtn');
    
    // Check browser lock status
    checkBrowserLockStatus();
    
    // Add event listener for lock button
    lockNowBtn.addEventListener('click', lockBrowserNow);
    
    // Function to check browser lock status
    function checkBrowserLockStatus() {
        chrome.storage.sync.get(['browser_lock'], function(data) {
            const isEnabled = data.browser_lock === true;
            
            // Update UI based on status
            if (isEnabled) {
                lockStatusIndicator.classList.add('enabled');
                lockStatusIndicator.classList.remove('disabled');
                lockStatusText.textContent = 'Browser Lock Enabled';
            } else {
                lockStatusIndicator.classList.add('disabled');
                lockStatusIndicator.classList.remove('enabled');
                lockStatusText.textContent = 'Browser Lock Disabled';
            }
        });
    }
    
    // Function to lock the browser immediately
    function lockBrowserNow() {
        // Show loading state
        lockNowBtn.textContent = 'Locking...';
        lockNowBtn.disabled = true;
        
        // Check if browser lock is enabled
        chrome.storage.sync.get(['browser_lock'], function(data) {
            if (!data.browser_lock) {
                // If browser lock is not enabled, enable it first
                chrome.storage.sync.set({ browser_lock: true }, function() {
                    // After enabling, send message to lock browser
                    sendLockBrowserMessage();
                });
            } else {
                // If browser lock is already enabled, just lock the browser
                sendLockBrowserMessage();
            }
        });
    }
    
    // Function to send lock browser message to background script
    function sendLockBrowserMessage() {
        chrome.runtime.sendMessage(
            { action: "lockBrowser" },
            function(response) {
                if (response && response.success) {
                    console.log('Browser locked successfully');
                    // Window will close automatically when browser is locked
                } else {
                    // If locking failed, reset button
                    lockNowBtn.textContent = 'Lock Browser Now';
                    lockNowBtn.disabled = false;
                    console.error('Failed to lock browser:', response?.error || 'Unknown error');
                }
            }
        );
    }
}); 