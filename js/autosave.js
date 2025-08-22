// js/autosave.js
import { updateMarkdown } from './markdown.js';
import { reinitializeSortableInstances } from './sortable.js';

let autosaveTimeout;
const AUTOSAVE_KEY = 'appsScriptRequirementsAutosave';

export function triggerAutosave() {
    clearTimeout(autosaveTimeout);
    autosaveTimeout = setTimeout(() => {
        performAutosave();
        console.log("Autosave triggered and performed.");
    }, 1000); // 1 second debounce
}

export function performAutosave() {
    const data = captureProjectState();
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
    console.log("Project state autosaved.");
}

export function captureProjectState() {
    const checkboxes = Array.from(document.querySelectorAll('#otherRequirementsContainer input[type="checkbox"]')).map(cb => ({
        id: cb.id,
        checked: cb.checked
    }));

    return {
        goal: document.getElementById('projectGoal').value,
        featuresHTML: document.getElementById('featuresContainer').innerHTML,
        customRequirements: document.getElementById('customRequirements').value,
        otherRequirements: checkboxes
        // Note: elementCounter and featureCounter are not saved.
        // They will be recalculated on restore.
    };
}

export function checkForAutosave() {
    const autosaveData = localStorage.getItem(AUTOSAVE_KEY);
    if (autosaveData) {
        try {
            const data = JSON.parse(autosaveData);
            const lastAutosave = new Date(data._timestamp); // Assuming you add a timestamp in performAutosave
            const now = new Date();
            const diffMinutes = (now - lastAutosave) / (1000 * 60);

            // Simple check: if less than 60 mins old, or if the saved state seems non-empty
            const isSessionEmpty = !data.goal && !data.featuresHTML && !data.customRequirements && data.otherRequirements?.every(r => !r.checked);

            if (diffMinutes < 60 || isSessionEmpty) {
                if (confirm(`An autosave from ${lastAutosave.toLocaleTimeString()} was found. Do you want to resume from it?`)) {
                    restoreProjectState(data);
                    window.showToast('📂 Resumed from autosave');
                }
            }
        } catch (e) {
            console.error("Error parsing autosave data:", e);
            localStorage.removeItem(AUTOSAVE_KEY); // Clear corrupted data
        }
    }
}

export function restoreProjectState(data) {
    if (!data) return;

    document.getElementById('projectGoal').value = data.goal || '';
    document.getElementById('featuresContainer').innerHTML = data.featuresHTML || '';
    document.getElementById('customRequirements').value = data.customRequirements || '';

    // Restore checkboxes
    (data.otherRequirements || []).forEach(req => {
        const cb = document.getElementById(req.id);
        if (cb) cb.checked = req.checked;
    });

    // Re-initialize UI elements that depend on the DOM structure
    reinitializeUIAfterLoad();
    updateMarkdown(); // Update markdown after restoring
}

export function reinitializeUIAfterLoad() {
    // Reset global counters (they are let variables in main.js)
    window.featureCounter = 0;
    window.elementCounter = 0;

    // Recalculate counters based on existing elements to prevent ID conflicts
    document.querySelectorAll('.feature-card').forEach(card => {
        const idParts = card.id.split('-');
        const idNum = parseInt(idParts[idParts.length - 1]);
        if (!isNaN(idNum) && idNum >= window.featureCounter) window.featureCounter = idNum + 1;
        // Re-initialize Sortable for steps, menu items, etc.
        window.makeCardSortable(card); // Assuming makeCardSortable is exposed globally
    });

    document.querySelectorAll('[data-container]').forEach(container => {
        const idParts = container.id.split('-');
        const idNum = parseInt(idParts[idParts.length - 1]);
        if (!isNaN(idNum) && idNum >= window.elementCounter) window.elementCounter = idNum + 1;
    });

    // Re-initialize Sortable for the main container
    window.makeContainerSortable(document.getElementById('featuresContainer')); // Assuming exposed globally

    // Re-attach dynamic event listeners if needed (though mostly handled by HTML onclick/oninput)
    // Update dropdowns that might depend on restored workflows
    window.updateAllDropdowns(); // Assuming exposed globally
}