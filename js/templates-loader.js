// js/templates-loader.js
// This file ensures template definitions are loaded and linked correctly
// after the main DOM and other modules are ready.
// It's a bit of a workaround to ensure dependencies are met.

document.addEventListener('DOMContentLoaded', () => {
    // This part is tricky because main.js loads the templates, but we might
    // need to ensure the timeTrigger template gets the correct workflow options.
    // The logic for this is mostly handled in main.js loadTemplate now.
    // This file can be a placeholder or used for any final template adjustments
    // that need to happen after everything else is loaded.
    console.log("Templates loader initialized.");
    // If needed in the future, logic can be added here.
});