// Script to remove sponsor banners and add developer credit
document.addEventListener('DOMContentLoaded', function() {
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

    // Also run after a short delay in case content is loaded dynamically
    setTimeout(function() {
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
    }, 500);
}); 