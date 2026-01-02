function show(enabled, useSettingsInsteadOfPreferences) {
    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('state-on')[0].innerText = "Extension is enabled and ready to use!";
        document.getElementsByClassName('state-off')[0].innerText = "Extension is disabled. Enable it in Safari Settings.";
        document.getElementsByClassName('state-unknown')[0].innerText = "Enable Mue in Safari Settings to get started.";
        document.getElementsByClassName('open-preferences')[0].innerText = "Open Safari Settings";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);
