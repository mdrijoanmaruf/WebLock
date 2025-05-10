let baseURL = "https://weblock.site";

// Function to create browser lock popup
const createBrowserLockWindow = () => new Promise((resolve, reject) => {
    chrome.tabs.create({ url: "full-browser-lock.html" }, tab => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }

        const windowOptions = {
            focused: true,
            incognito: false,
            type: "popup",
            tabId: tab.id,
            width: 400,
            height: 600
        };

        chrome.windows.create(windowOptions, window => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }

            chrome.storage.local.set({ browser_locked: true }, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    });
});

// Remove all tabs except the browser lock tab
const removeAllTabs = async () => {
    try {
        const { remove_tabs } = await chrome.storage.local.get(["remove_tabs"]);
        
        if (remove_tabs && remove_tabs.length > 0) {
            for (const window of remove_tabs) {
                for (const tab of window.tabs) {
                    await chrome.tabs.remove(tab.id);
                }
            }
        }
    } catch (error) {
        console.error("Error removing tabs:", error);
    }
};

// Set the popup for the extension icon
chrome.action.setPopup({ popup: "popup.html" });

// Handle extension icon click (fallback)
chrome.action.onClicked.addListener(tab => {
    chrome.tabs.create({ url: "login.html" });
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(details => {
    // Open welcome page on install
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: baseURL + "/installed" });
    }
    
    // Notify server on update
    if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        chrome.storage.sync.get(["email"], async data => {
            if (data.email) {
                await fetch(baseURL + "/api/updated", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: data.email })
                });
            }
        });
    }
});

// Handle browser startup
chrome.runtime.onStartup.addListener(async () => {
    // Reset unlocked sites list on browser start
    await chrome.storage.sync.set({ unlocked: [] });
    
    // Check if remember device is enabled
    const { remember_device } = await chrome.storage.local.get(["remember_device"]);
    
    if (remember_device) {
        // Skip browser lock if remember device is enabled
        await chrome.storage.local.set({ browser_locked: false });
        return;
    }
    
    // Check if browser lock is enabled
    const { browser_lock } = await chrome.storage.sync.get(["browser_lock"]);
    
    if (browser_lock) {
        // Save current windows/tabs state
        const windows = await chrome.windows.getAll({ populate: true });
        
        if (windows.length > 0) {
            // Store current tabs for restoration later
            const { last_tabs } = await chrome.storage.local.get(["last_tabs"]);
            
            if (!last_tabs || last_tabs.length === 0) {
                await chrome.storage.local.set({ last_tabs: windows });
            }
            
            // Mark tabs for removal
            await chrome.storage.local.set({ remove_tabs: windows });
            
            // Show browser lock screen
            await createBrowserLockWindow();
            
            // Remove all tabs
            await removeAllTabs();
        }
    }
});

// Handle new tab creation
chrome.tabs.onCreated.addListener(async tab => {
    console.log("New tab created:", tab.url);
    
    const { browser_locked } = await chrome.storage.local.get(["browser_locked"]);
    const isNotLockPage = !tab.url || (
        !tab.url.includes("full-browser-lock.html") && 
        !tab.url.includes("browser-lock.html")
    );
    
    // If browser is locked and this is not a lock page, close it
    if (browser_locked && isNotLockPage) {
        await chrome.tabs.remove(tab.id);
        console.log("Tab closed due to browser lock");
    }
});

// Handle new window creation
chrome.windows.onCreated.addListener(async window => {
    console.log("New window created");
    
    const { browser_locked, browser_lock } = await chrome.storage.local.get(["browser_locked", "browser_lock"]);
    
    // If this is the only window and browser lock is enabled
    const windows = await chrome.windows.getAll({ populate: true });
    
    if (windows.length === 1 && browser_lock && browser_locked) {
        // Save window for removal
        await chrome.storage.local.set({ 
            remove_tabs: windows,
            browser_locked: false 
        });
        
        // Show browser lock
        await createBrowserLockWindow();
        
        // Remove all tabs
        await removeAllTabs();
    } 
    // If browser is already locked, handle new windows
    else if (browser_locked && browser_lock) {
        const tabs = await chrome.tabs.query({ windowId: window.id });
        
        // Close the window if it's not a browser lock window
        const hasNonLockTabs = tabs.length > 1 || tabs.some(tab => 
            !tab.url || (
                !tab.url.includes("full-browser-lock.html") && 
                !tab.url.includes("browser-lock.html")
            )
        );
        
        if (hasNonLockTabs) {
            await chrome.windows.remove(window.id);
            console.log("Window closed due to browser lock");
        }
    }
});

// Handle messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle installation tracking
    if (message.installed) {
        chrome.runtime.setUninstallURL(baseURL + "/uninstalled?email=" + message.email);
        sendResponse({ success: true });
    }
    
    // Handle manual browser lock request
    if (message.action === "lockBrowser") {
        (async () => {
            // Save current windows/tabs state
            const windows = await chrome.windows.getAll({ populate: true });
            
            if (windows.length > 0) {
                // Store current tabs for restoration later
                await chrome.storage.local.set({ last_tabs: windows });
                
                // Mark tabs for removal
                await chrome.storage.local.set({ remove_tabs: windows });
                
                // Show browser lock screen
                await createBrowserLockWindow();
                
                // Remove all tabs
                await removeAllTabs();
                
                sendResponse({ success: true });
            } else {
                sendResponse({ success: false, error: "No windows to lock" });
            }
        })();
        return true; // Indicates async response
    }
    
    // Handle unlock browser request
    if (message.action === "unlockBrowser") {
        chrome.storage.local.set({ browser_locked: false }, () => {
            sendResponse({ success: true });
        });
        return true; // Indicates async response
    }
});

// Set uninstall URL
chrome.storage.sync.get(["email"], data => {
    const uninstallUrl = data.email 
        ? baseURL + "/uninstalled?email=" + data.email 
        : baseURL + "/uninstalled";
    
    chrome.runtime.setUninstallURL(uninstallUrl);
});