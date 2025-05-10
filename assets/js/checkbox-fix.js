// Aggressive fix to ensure the checkbox is checked by default
(function() {
    // Function to set checkbox as checked
    function checkTheBox() {
        const checkboxes = document.querySelectorAll('.remember, input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            checkbox.setAttribute('checked', 'checked');
        });
    }

    // Run immediately when script loads
    checkTheBox();

    // Run on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        checkTheBox();
    });

    // Run on window load
    window.addEventListener('load', function() {
        checkTheBox();
    });

    // Run periodically for the first few seconds
    for (let i = 1; i <= 5; i++) {
        setTimeout(checkTheBox, i * 100);  // Run every 100ms for first 500ms
    }
    
    // Also run after longer delays in case of slow loading
    setTimeout(checkTheBox, 1000); // 1 second
    setTimeout(checkTheBox, 2000); // 2 seconds

    // Set up a MutationObserver to check the box if new elements are added
    const observer = new MutationObserver(function(mutations) {
        checkTheBox();
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
})(); 