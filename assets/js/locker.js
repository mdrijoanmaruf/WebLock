// Make sure the checkbox is checked by default - TARGETED VERSION
(function() {
    // Function to set checkbox as checked
    function forceCheckTheBox() {
        var checkbox = document.querySelector('.remember, .weblock-remember');
        if (checkbox && 
            (checkbox.closest('.weblock-form') || 
             checkbox.closest('.login') || 
             checkbox.closest('.form') || 
             checkbox.getAttribute('data-weblock') === 'true')) {
            
            checkbox.checked = true;
            checkbox.setAttribute('checked', 'checked');
            
            // Override any potential event handlers that might uncheck it
            const originalPropDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked');
            if (originalPropDescriptor && originalPropDescriptor.configurable) {
                Object.defineProperty(checkbox, 'checked', {
                    get: function() { return true; },
                    set: function() { /* do nothing, keep it checked */ },
                    configurable: true
                });
            }
        }
    }

    // Check immediately
    forceCheckTheBox();
    
    // Check on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', forceCheckTheBox);
    
    // Check on load
    window.addEventListener('load', forceCheckTheBox);
    
    // Check periodically but less aggressively
    setTimeout(forceCheckTheBox, 500);
    setTimeout(forceCheckTheBox, 1000);
})();

document.addEventListener("click",e=>{if(e.target.classList.contains("login__button")){e.preventDefault();let t=document.querySelector("#login__password"),o=document.querySelector(".remember, .weblock-remember"),s=document.querySelector(".c_url");try{var r=new jsSHA("SHA-512","TEXT",{encoding:"UTF8"});r.update(t.value),t=r.getHash("HEX")}catch(e){sessionStorage.setItem("lastPassword",t.value),o.checked&&sessionStorage.setItem("lastUnlocked",s.value),location.reload()}sessionStorage.tmpToken===t||1==sessionStorage.isLoggedIn?(sessionStorage.removeItem("tmpToken"),sessionStorage.setItem("isLoggedIn",!0),o.checked&&sessionStorage.setItem("unlocked",s.value),location.reload()):new Noty({text:"Incorrect Password",type:"error",timeout:2e3,theme:"metroui"}).show()}});