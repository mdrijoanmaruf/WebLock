document.addEventListener('DOMContentLoaded', function() {
    const browserLockInput = document.querySelector('.browser_lock_input');
    const tabRestoreInput = document.querySelector('.browser_tab_restore_input');
    const rememberDeviceInput = document.querySelector('.remember_device_input');
    const saveButton = document.querySelector('.browser_lock_save_btn');
    const lockNowButton = document.querySelector('.lock_now_btn');
    
    // Load current settings
    loadSettings();
    
    // Handle tab restore input change
    tabRestoreInput.addEventListener('change', function() {
        if (tabRestoreInput.value === 'yes') {
            // Check for tabs permission
            chrome.permissions.contains({ permissions: ['tabs'] }, function(hasPermission) {
                if (!hasPermission) {
                    // Request permission if we don't have it
                    chrome.permissions.request({ permissions: ['tabs'] }, function(granted) {
                        if (!granted) {
                            // If permission denied, reset to "no"
                            tabRestoreInput.value = 'no';
                            showNotification(
                                'The extension needs to access your tabs to restore them when you unlock your browser. ' +
                                'All your tab info will remain within your browser.',
                                'warning',
                                5000
                            );
                        }
                    });
                }
            });
        }
    });
    
    // Handle save button click
    saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check for tabs permission if tab restore is enabled
        chrome.permissions.contains({ permissions: ['tabs'] }, function(hasPermission) {
            const browserLockEnabled = browserLockInput.value === 'yes';
            let tabRestoreEnabled = tabRestoreInput.value === 'yes';
            const rememberDeviceEnabled = rememberDeviceInput.value === 'yes';
            
            // If tab restore is enabled but we don't have permission, disable it
            if (tabRestoreEnabled && !hasPermission) {
                tabRestoreInput.value = 'no';
                tabRestoreEnabled = false;
                showNotification(
                    'You need to grant tabs permission to use the restore tabs feature!',
                    'warning',
                    2000
                );
            }
            
            // Save settings
            chrome.storage.sync.set({
                browser_lock: browserLockEnabled,
                restore_tabs: tabRestoreEnabled
            });
            
            // Save remember device setting locally
            chrome.storage.local.set({
                remember_device: rememberDeviceEnabled
            });
            
            // Show success message
            showNotification('Browser Lock Settings Saved', 'success', 2000);
        });
    });
    
    // Handle lock now button click
    lockNowButton.addEventListener('click', function() {
        // First ensure browser lock is enabled
        chrome.storage.sync.get(['browser_lock'], function(data) {
            if (!data.browser_lock) {
                // If browser lock is not enabled, show a confirmation dialog
                if (confirm('Browser Lock is not enabled. Enable it and lock browser now?')) {
                    // Enable browser lock
                    chrome.storage.sync.set({ browser_lock: true }, function() {
                        // Update UI
                        browserLockInput.value = 'yes';
                        // Lock browser
                        lockBrowserNow();
                    });
                }
            } else {
                // If browser lock is already enabled, lock immediately
                lockBrowserNow();
            }
        });
    });
    
    // Function to load current settings
    function loadSettings() {
        chrome.storage.sync.get(['browser_lock', 'restore_tabs'], function(syncData) {
            browserLockInput.value = syncData.browser_lock ? 'yes' : 'no';
            tabRestoreInput.value = syncData.restore_tabs ? 'yes' : 'no';
            
            // Load remember device setting from local storage
            chrome.storage.local.get(['remember_device'], function(localData) {
                rememberDeviceInput.value = localData.remember_device ? 'yes' : 'no';
            });
        });
    }
    
    // Function to lock the browser now
    function lockBrowserNow() {
        // Show loading state
        lockNowButton.textContent = 'Locking...';
        lockNowButton.disabled = true;
        
        // Send message to background script to lock browser
        chrome.runtime.sendMessage({ action: 'lockBrowser' }, function(response) {
            if (response && response.success) {
                console.log('Browser locked successfully');
                // The current window will be closed as part of the lock process
            } else {
                // If locking failed, reset button
                lockNowButton.textContent = 'Lock Browser Now';
                lockNowButton.disabled = false;
                showNotification('Failed to lock browser. Please try again.', 'error', 2000);
            }
        });
    }
    
    // Function to show notifications
    function showNotification(message, type, timeout) {
        new Noty({
            text: message,
            type: type,
            timeout: timeout,
            theme: 'metroui'
        }).show();
    }
});