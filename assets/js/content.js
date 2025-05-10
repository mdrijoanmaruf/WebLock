var cssURL=chrome.runtime.getURL("assets/css/login.css"),notyCSSURL=chrome.runtime.getURL("assets/css/noty.css"),lockerJSURL=chrome.runtime.getURL("assets/js/locker.js"),notyJSURL=chrome.runtime.getURL("assets/js/noty.js"),shaJSURL=chrome.runtime.getURL("assets/js/sha.js"),forgotPageURL=chrome.runtime.getURL("forgot.html"),loginPageURL=chrome.runtime.getURL("login.html"),blockedPageURL=chrome.runtime.getURL("blocked.html");chrome.storage.sync.get(["urls","password","unlocked","blocked"],t=>{let e=t.urls||[],r=t.unlocked||[],a=!1,s=t.blocked||[],n=!1;sessionStorage.unlocked&&(chrome.storage.sync.set({unlocked:[...r,sessionStorage.unlocked]}),sessionStorage.removeItem("unlocked")),e.map(e=>{if(window.location.href.includes(e)&&!sessionStorage.isLoggedIn&&!a&&!r.includes(e)){if(t.password?sessionStorage.setItem("tmpToken",t.password):window.location.href=loginPageURL,sessionStorage.lastPassword){try{var s=sessionStorage.lastPassword,o=new jsSHA("SHA-512","TEXT",{encoding:"UTF8"});o.update(s),o.getHash("HEX")==t.password?(n=!0,sessionStorage.removeItem("tmpToken"),sessionStorage.setItem("isLoggedIn",!0),sessionStorage.lastUnlocked&&chrome.storage.sync.set({unlocked:[...r,sessionStorage.lastUnlocked]}),location.reload()):setTimeout(()=>{new Noty({text:"Incorrect Password",type:"error",timeout:2e3,theme:"metroui"}).show()},500)}catch(e){setTimeout(()=>{alert(`An unexpected error has occurred.
Please copy the message below and visit https://rijoan.com/contact to report this error so I can fix it for you and everyone else using the extension.
Error Message: `+e.message)},500)}sessionStorage.removeItem("lastPassword"),sessionStorage.lastUnlocked&&sessionStorage.removeItem("lastUnlocked")}n||(document.write(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Login to unlock this webpage</title>
                        <link rel="stylesheet" href="${notyCSSURL}">
                        <link rel="stylesheet" href="${cssURL}">
                        <link rel="stylesheet" href="${chrome.runtime.getURL("assets/css/checkbox-checked.css")}">
                        <style>
                            .footer .banner, 
                            .footer .info-links a {
                                display: none !important;
                            }
                            .footer .info-links {
                                padding: 10px 0;
                            }
                            .footer .info-links .developer-credit {
                                display: block !important;
                            }
                        </style>
                    </head>
                    <body class="align">
                        <div class="grid">
                            <form class="form login">
                                <h2>Enter Password to Unlock</h2>
                                <div class="form__field">
                                    <label for="login__password">
                                        <svg class="icon">
                                            <use xlink:href="#icon-lock"></use>
                                        </svg>
                                        <span class="hidden">Password</span>
                                    </label>
                                    <input id="login__password" type="password" name="password" class="form__input" placeholder="Password" required>
                                </div>
                                <div class="form__field">
                                    <label class="remember-label">
                                        <input type="checkbox" class="remember" checked> Don't ask again until I close the browser
                                    </label>
                                    <script>
                                        // Immediate script to force checkbox checked
                                        (function() {
                                            var checkbox = document.querySelector('.remember');
                                            if (checkbox) {
                                                checkbox.checked = true;
                                                checkbox.setAttribute('checked', 'checked');
                                            }
                                        })();
                                    </script>
                                </div>
                                <input type="hidden" class="c_url" value="${e}">
                                <div class="form__field">
                                    <input type="submit" id="login__button" class="login__button" value="Unlock">
                                </div>
                            </form>
                            <p class="text--center"><a target="_blank" href="${forgotPageURL}">Forgot Password?</a></p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icons">
                            <symbol id="icon-lock" viewBox="0 0 1792 1792">
                                <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
                            </symbol>
                        </svg>
                        <div class="footer">
                            <div class="info-links">
                                <span class="developer-credit">Developed by <a href="https://rijoan.com" target="_blank">Md Rijoan Maruf</a></span>
                            </div>
                        </div>
                        <script src="${shaJSURL}"></script>
                        <script src="${notyJSURL}"></script>
                        <script>
                        // Ensure the checkbox is checked by default
                        document.addEventListener('DOMContentLoaded', function() {
                            var checkbox = document.querySelector('.remember');
                            if (checkbox) {
                                checkbox.checked = true;
                            }
                            
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
                        });
                        // Also set it immediately
                        window.onload = function() {
                            var checkbox = document.querySelector('.remember');
                            if (checkbox) {
                                checkbox.checked = true;
                            }
                            
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
                        };
                        </script>
                        <script src="${lockerJSURL}"></script>
                    </body>
                    </html>
                `),setTimeout(()=>window.stop(),3e3),a=!0)}}),s.map(e=>{window.location.href.includes(e)&&(window.location.href=blockedPageURL)})});