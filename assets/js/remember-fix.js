// Fix for ensuring the remember checkbox is checked by default only on WebLock pages
(function() {
    // Only run on WebLock pages
    if (window.location.href.includes('full-browser-lock.html') || 
        window.location.href.includes('browser-lock.html') ||
        window.location.href.includes('login.html') ||
        window.location.href.includes('forgot.html') ||
        window.location.href.includes('popup.html') ||
        window.location.href.includes('dashboard.html') ||
        document.querySelector('.weblock-form') ||
        document.querySelector('.login') ||
        document.querySelector('[data-weblock="true"]')) {
        
        document.addEventListener('DOMContentLoaded', function() {
            // Find the remember checkbox and ensure it's checked
            const rememberCheckbox = document.querySelector('.remember, .weblock-remember');
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        });
    }
})(); 