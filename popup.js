document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("cookie-button");

    // Sprawdzenie, czy ciasteczko istnieje
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tab = tabs[0];
            const url = new URL(tab.url);

            chrome.cookies.get({ url: url.origin, name: "exampleCookie" }, (cookie) => {
                if (cookie) {
                    button.textContent = "USUN CIASTECZKO";
                    button.onclick = () => {
                        chrome.cookies.remove({ url: url.origin, name: "exampleCookie" }, (details) => {
                            if (chrome.runtime.lastError) {
                                console.error(chrome.runtime.lastError.message);
                            } else {
                                console.log("Cookie removed:", details);
                                alert("Ciasteczko zostało usunięte!");
                                button.textContent = "Dodaj ciasteczko"; // Zmiana tekstu po usunięciu
                            }
                        });
                    };
                } else {
                    button.textContent = "DODAJ CIASTECZKO";
                    button.onclick = () => {
                        chrome.cookies.set({
                            url: url.origin,
                            name: "exampleCookie",
                            value: "exampleValue",
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
                                alert("Dodano ciasteczko!");
                                button.textContent = "Usuń ciasteczko"; // Zmiana tekstu po dodaniu
                            }
                        });
                    };
                }
            });
        }
    });
});