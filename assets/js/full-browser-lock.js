/**
 * Full Browser Lock functionality
 * This script handles unlocking the browser and restoring tabs
 */

document.addEventListener('DOMContentLoaded', function() {
    // Prevent the user from navigating away
    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    });

    // Initialize the browser lock
    initBrowserLock();
});

function initBrowserLock() {
    chrome.storage.sync.get(["password", "restore_tabs"], function(syncData) {
        chrome.storage.local.get(["last_tabs"], function(localData) {
            if (!syncData.password) {
                // If no password is set, redirect to signup
                window.location.href = "signup.html";
                return;
            }

            // Handle unlock button click
            const passwordInput = document.querySelector("#login__password");
            const rememberDeviceCheckbox = document.querySelector("#remember_device");
            const loginButton = document.querySelector("#login__button");

            loginButton.addEventListener("click", function(e) {
                e.preventDefault();
                
                try {
                    // Hash the password input
                    const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
                    shaObj.update(passwordInput.value);
                    const hashedPassword = shaObj.getHash("HEX");
                    
                    // Compare with stored password
                    if (hashedPassword === syncData.password) {
                        // Successful login
                        handleSuccessfulUnlock(syncData, localData, rememberDeviceCheckbox.checked);
                    } else {
                        // Failed login
                        new Noty({
                            text: "Incorrect Password",
                            type: "error",
                            timeout: 2000,
                            theme: "metroui"
                        }).show();
                    }
                } catch (error) {
                    console.error("Error during password verification:", error);
                    new Noty({
                        text: "An error occurred. Please try again.",
                        type: "error",
                        timeout: 2000,
                        theme: "metroui"
                    }).show();
                }
            });
        });
    });
}

function handleSuccessfulUnlock(syncData, localData, rememberDevice) {
    const lastTabs = localData.last_tabs || [];
    const newWindows = [];

    // If we don't have tabs to restore or don't want to restore them
    if (lastTabs.length === 0 || !syncData.restore_tabs) {
        // Simply unlock the browser
        chrome.storage.local.set({ browser_locked: false }, function() {
            // Close the current browser lock window
            chrome.windows.getCurrent({ populate: false }, function(window) {
                chrome.windows.remove(window.id);
            });
        });
        return;
    }

    // Restore all saved windows and tabs
    let windowsProcessed = 0;
    
    lastTabs.forEach((windowData, windowIndex) => {
        // Create window with saved properties
        const createProperties = {
            focused: windowData.focused,
            incognito: windowData.incognito,
            type: windowData.type,
            left: windowData.left,
            top: windowData.top,
            width: windowData.width,
            height: windowData.height
        };

        chrome.windows.create(createProperties, function(newWindow) {
            // Set window state (maximized, minimized, etc.)
            chrome.windows.update(newWindow.id, { state: windowData.state });
            
            // Add tabs if we have permission
            chrome.permissions.contains({ permissions: ["tabs"] }, function(hasPermission) {
                if (hasPermission && syncData.restore_tabs) {
                    windowData.tabs.forEach(function(tabData) {
                        chrome.tabs.create({
                            windowId: newWindow.id,
                            index: tabData.index,
                            url: tabData.url,
                            active: tabData.active,
                            selected: tabData.selected,
                            pinned: tabData.pinned
                        });
                    });
                }

                // Track progress
                windowsProcessed++;
                
                // If we've processed all windows, clean up
                if (windowsProcessed === lastTabs.length) {
                    // Remove the empty tabs created by default in each window
                    chrome.tabs.query({ windowId: newWindow.id, index: 0 }, function(tabs) {
                        if (tabs && tabs.length > 0) {
                            tabs.forEach(tab => {
                                if (tab.url === "chrome://newtab/" || tab.url === "about:blank") {
                                    chrome.tabs.remove(tab.id);
                                }
                            });
                        }
                    });

                    // Clear saved tabs and unlock the browser
                    chrome.storage.local.set({ 
                        last_tabs: [],
                        browser_locked: false,
                        remember_device: rememberDevice
                    }, function() {
                        // Close the browser lock window
                        chrome.windows.getCurrent({ populate: false }, function(window) {
                            chrome.windows.remove(window.id);
                        });
                    });
                }
            });
        });
    });
} 