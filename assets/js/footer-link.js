// Make the footer clickable to Rijoan's website
document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.style.cursor = 'pointer';
        footer.addEventListener('click', function() {
            window.open('https://rijoan.com', '_blank');
        });
    }
    
    // Also try again after a short delay
    setTimeout(function() {
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.cursor = 'pointer';
            footer.addEventListener('click', function() {
                window.open('https://rijoan.com', '_blank');
            });
        }
    }, 1000);
}); 