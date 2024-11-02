document.getElementById("add-cookie").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tab = tabs[0];
            const url = new URL(tab.url);
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
                }
            });
        }
    });
});