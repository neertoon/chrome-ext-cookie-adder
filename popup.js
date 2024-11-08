let textProd = "PROD";
let textLocal = "LOCAL";
let cookieName = 'cookie-name';
let cookieValue = 'cookie-value';
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("cookie-button");

    // Sprawdzenie, czy ciasteczko istnieje
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tab = tabs[0];
            const url = new URL(tab.url);

            chrome.cookies.get({ url: url.origin, name: cookieName }, (cookie) => {
                if (cookie) {
                    button.textContent = textProd;
                    gcCookieAddProdClass(button)
                } else {
                    button.textContent = textLocal;
                    gcCookieAddLocalClass(button);
                }
            });

            button.onclick = () => {
                chrome.cookies.get({ url: url.origin, name: cookieName }, (cookie) => {
                    if (cookie) {
                        gcCookieRemove(url, button, cookieName, textLocal);
                    } else {
                        gcCookieAdd(url, button, cookieName, cookieValue, textProd);
                    }
                });
            };
        }
    });
});


function gcCookieAddLocalClass(button) {
    button.classList.remove('prod');
    button.classList.add('local');
}

function gcCookieAddProdClass(button) {
    button.classList.remove('local');
    button.classList.add('prod');
}

function gcCookieRemove(url, button, cookieName, buttonText) {
    chrome.cookies.remove({ url: url.origin, name: cookieName }, (details) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log("Cookie removed:", details);
            // alert("Ciasteczko zostało usunięte!");
            button.textContent = buttonText; // Zmiana tekstu po usunięciu
            gcCookieAddLocalClass(button);
        }
    });
}

function gcCookieAdd(url, button, cookieName, cookieValue, buttonText) {
    chrome.cookies.set({
        url: url.origin,
        name: cookieName,
        value: cookieValue,
        domain: url.hostname,
        path: "/",
        secure: true,
        sameSite: "lax",
        expirationDate: Math.floor(Date.now() / 1000) + 3600 // ważne przez godzinę
    }, (cookie) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log("Cookie added:", cookie);
            // alert("Dodano ciasteczko!");
            button.textContent = buttonText; // Zmiana tekstu po dodaniu
            gcCookieAddProdClass(button)
        }
    });
}