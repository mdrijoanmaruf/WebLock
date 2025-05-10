document.addEventListener('DOMContentLoaded', function() {
    // Get form and button elements
    const form = document.querySelector('.change-password');
    const changePasswordButton = document.getElementById('change_password_button');
    
    // Get password input fields
    const currentPasswordInput = document.getElementById('current_password');
    const newPasswordInput = document.getElementById('new_password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    
    // Focus on the current password field
    currentPasswordInput.focus();
    
    // Add event listener for form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validate inputs
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('All fields are required', 'error');
            return;
        }
        
        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        // Check if new password is different from current password
        if (currentPassword === newPassword) {
            showNotification('New password must be different from current password', 'error');
            return;
        }
        
        // Hash the current password for verification
        const currentPasswordHash = hashPassword(currentPassword);
        
        // Get stored password from Chrome storage
        chrome.storage.sync.get(['password'], function(data) {
            if (!data.password) {
                showNotification('No password is set. Please set up a password first.', 'error');
                setTimeout(() => {
                    window.location.href = 'browser-lock.html';
                }, 2000);
                return;
            }
            
            // Verify current password
            if (currentPasswordHash !== data.password) {
                showNotification('Current password is incorrect', 'error');
                return;
            }
            
            // Hash the new password
            const newPasswordHash = hashPassword(newPassword);
            
            // Update password in Chrome storage
            chrome.storage.sync.set({ password: newPasswordHash }, function() {
                showNotification('Password changed successfully', 'success');
                
                // Redirect to login page after a delay
                setTimeout(() => {
                    window.location.href = 'browser-lock.html';
                }, 2000);
            });
        });
    });
    
    // Function to hash password using SHA-512
    function hashPassword(password) {
        const sha = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
        sha.update(password);
        return sha.getHash('HEX');
    }
    
    // Function to show notifications
    function showNotification(message, type) {
        new Noty({
            text: message,
            type: type,
            timeout: 2000,
            theme: 'metroui'
        }).show();
    }
}); 