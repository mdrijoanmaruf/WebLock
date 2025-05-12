// Only check WebLock's own checkboxes
(function() {
    // Function to set WebLock checkbox as checked
    function checkWebLockBox() {
        // Only target WebLock's specific checkboxes
        const checkboxes = document.querySelectorAll('.weblock-remember, .remember');
        checkboxes.forEach(checkbox => {
            // Check if the checkbox is part of WebLock UI
            if (checkbox.closest('.weblock-form') || 
                checkbox.closest('.login') || 
                checkbox.closest('.form') || 
                checkbox.getAttribute('data-weblock') === 'true') {
                checkbox.checked = true;
                checkbox.setAttribute('checked', 'checked');
            }
        });
    }

    // Only run on WebLock pages
    if (window.location.href.includes('full-browser-lock.html') || 
        window.location.href.includes('browser-lock.html') ||
        document.querySelector('.weblock-form') ||
        document.querySelector('.login') ||
        document.querySelector('[data-weblock="true"]')) {
        
        // Run immediately when script loads
        checkWebLockBox();

        // Run on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            checkWebLockBox();
        });

        // Run on window load
        window.addEventListener('load', function() {
            checkWebLockBox();
        });

        // Run periodically for the first few seconds
        for (let i = 1; i <= 5; i++) {
            setTimeout(checkWebLockBox, i * 100);  // Run every 100ms for first 500ms
        }
        
        // Also run after longer delays in case of slow loading
        setTimeout(checkWebLockBox, 1000); // 1 second
        setTimeout(checkWebLockBox, 2000); // 2 seconds

        // Set up a MutationObserver to check the box if new elements are added
        const observer = new MutationObserver(function(mutations) {
            checkWebLockBox();
        });

        // Start observing once the document body is available
        function setupObserver() {
            if (document.body) {
                observer.observe(document.body, { 
                    childList: true,
                    subtree: true 
                });
            } else {
                setTimeout(setupObserver, 100);
            }
        }
        
        setupObserver();
    }
})(); 