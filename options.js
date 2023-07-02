// In-page cache of the user's options
const options = {};
const optionsForm = document.getElementById("optionsForm");

// Immediately persist options changes
optionsForm.optionChkEnglish.addEventListener("change", (event) => {
    options.optionChkEnglish = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.optionChkDutch.addEventListener("change", (event) => {
    options.optionChkDutch = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.optionChkFrench.addEventListener("change", (event) => {
    options.optionChkFrench = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.optionChkGerman.addEventListener("change", (event) => {
    options.optionChkGerman = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.optionChkItalian.addEventListener("change", (event) => {
    options.optionChkItalian = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.optionChkPolish.addEventListener("change", (event) => {
    options.optionChkPolish = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.optionChkSpanish.addEventListener("change", (event) => {
    options.optionChkSpanish = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.optionChkTurkish.addEventListener("change", (event) => {
    options.optionChkTurkish = event.target.checked;
    chrome.storage.sync.set({ options });
});

// Initialize the form with the user's option settings
const data = await chrome.storage.sync.get("options");
Object.assign(options, data.options);
optionsForm.optionChkEnglish.checked = Boolean(options.optionChkEnglish);
optionsForm.optionChkDutch.checked = Boolean(options.optionChkDutch);
optionsForm.optionChkFrench.checked = Boolean(options.optionChkFrench);
optionsForm.optionChkGerman.checked = Boolean(options.optionChkGerman);
optionsForm.optionChkItalian.checked = Boolean(options.optionChkItalian);
optionsForm.optionChkPolish.checked = Boolean(options.optionChkPolish);
optionsForm.optionChkSpanish.checked = Boolean(options.optionChkSpanish);
optionsForm.optionChkTurkish.checked = Boolean(options.optionChkTurkish);


