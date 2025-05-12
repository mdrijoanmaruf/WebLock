// Script to remove sponsor banners and add developer credit only on WebLock pages
(function() {
    // Function to remove banners and add developer credit
    function removeSponsors() {
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
            
            // Remove any sponsor banners
            const banners = document.querySelectorAll('.footer .banner');
            banners.forEach(banner => {
                banner.style.display = 'none';
                banner.remove();
            });

            // Remove sponsor links
            const infoLinks = document.querySelectorAll('.footer .info-links a');
            infoLinks.forEach(link => {
                link.style.display = 'none';
                link.remove();
            });

            // Replace footer with developer credit
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.innerHTML = `
                    <div class="info-links">
                        <span class="developer-credit">Developed by <a href="https://rijoan.com" target="_blank">Md Rijoan Maruf</a></span>
                    </div>
                `;
            }
        }
    }

    // Run on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        removeSponsors();
        
        // Also run after a short delay in case content is loaded dynamically
        setTimeout(removeSponsors, 500);
    });
})(); 