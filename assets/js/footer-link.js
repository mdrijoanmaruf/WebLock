// Make the WebLock footer clickable to Rijoan's website
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
            const footer = document.querySelector('.weblock-footer, .footer');
            if (footer) {
                footer.style.cursor = 'pointer';
                footer.addEventListener('click', function() {
                    window.open('https://rijoan.com', '_blank');
                });
            }
            
            // Also try again after a short delay
            setTimeout(function() {
                const footer = document.querySelector('.weblock-footer, .footer');
                if (footer) {
                    footer.style.cursor = 'pointer';
                    footer.addEventListener('click', function() {
                        window.open('https://rijoan.com', '_blank');
                    });
                }
            }, 1000);
        });
    }
})(); 