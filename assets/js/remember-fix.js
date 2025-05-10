// Fix for ensuring the remember checkbox is checked by default
document.addEventListener('DOMContentLoaded', function() {
    // Find the remember checkbox and ensure it's checked
    const rememberCheckbox = document.querySelector('.remember');
    if (rememberCheckbox) {
        rememberCheckbox.checked = true;
    }
}); 