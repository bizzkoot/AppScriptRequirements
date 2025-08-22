// js/main.js
import { featureTemplates, stepTemplates, templateDefinitions, featureEmojis, defaultEmoji } from './templates.js';
import { makeContainerSortable, makeCardSortable, initializeSortable, reinitializeSortableInstances } from './sortable.js';
import { updateMarkdown, renderMarkdownPreview } from './markdown.js';
import { triggerAutosave, checkForAutosave, captureProjectState, restoreProjectState } from './autosave.js';
import { showToast, switchTab, copyMarkdown, downloadMarkdown, openSaveModal, closeSaveModal, saveProject, loadProject, deleteProject, populateSaveSlots } from './ui.js';
import { enhanceText } from './enhance.js';

// --- Global State Variables ---
export let featureCounter = 0;
export let elementCounter = 0;

// --- Expose functions to global scope for inline event handlers ---
window.featureTemplates = featureTemplates;
window.stepTemplates = stepTemplates;
window.templateDefinitions = templateDefinitions;

window.makeContainerSortable = makeContainerSortable;
window.makeCardSortable = makeCardSortable;
window.reinitializeSortableInstances = reinitializeSortableInstances;

window.updateMarkdown = updateMarkdown;
window.renderMarkdownPreview = renderMarkdownPreview;

window.triggerAutosave = triggerAutosave;
window.checkForAutosave = checkForAutosave;
window.captureProjectState = captureProjectState;
window.restoreProjectState = restoreProjectState;

window.showToast = showToast;
window.switchTab = switchTab;
window.copyMarkdown = copyMarkdown;
window.downloadMarkdown = downloadMarkdown;
window.openSaveModal = openSaveModal;
window.closeSaveModal = closeSaveModal;
window.saveProject = saveProject;
window.loadProject = loadProject;
window.deleteProject = deleteProject;
window.populateSaveSlots = populateSaveSlots;

window.enhanceText = enhanceText;

// --- Helper Functions also need exposure if used in HTML ---
window.getWorkflowOptions = getWorkflowOptions;
window.updateAllDropdowns = updateAllDropdowns;
window.handleRecipientSourceChange = handleRecipientSourceChange;
window.handleSourceSheetTypeChange = handleSourceSheetTypeChange;
window.toggleCard = toggleCard;
window.addFeature = addFeature;
window.addStep = addStep;
window.addUIElement = addUIElement;
window.addMenuItem = addMenuItem; // New for customMenu
window.addSeparator = addSeparator; // New for customMenu
window.loadTemplate = loadTemplate; // <-- Make sure this line is present

// --- Helper Functions ---
export function getWorkflowOptions() {
    const workflows = document.querySelectorAll('.feature-card[data-type="workflow"]');
    if (workflows.length === 0) return '<option value="" disabled selected>No workflows defined yet</option>';
    let options = '<option value="" selected>None</option>'; // Match original default
    workflows.forEach(w => {
        const id = w.id;
        // Prioritize workflowName input, fallback to dataset.title
        const nameInput = w.querySelector('[data-id="workflowName"]');
        const title = (nameInput && nameInput.value.trim()) || w.dataset.title || 'Unnamed Workflow';
        options += `<option value="${id}">${title} (ID: ${id})</option>`; // Match original format
    });
    return options;
}

export function updateAllDropdowns() {
    document.querySelectorAll('select[data-id="linkedWorkflow"]').forEach(select => {
        const currentVal = select.value;
        select.innerHTML = getWorkflowOptions();
        if (currentVal) select.value = currentVal; // Restore selection if possible
    });
}

// --- Conditional Logic Handlers (matching original) ---
export function handleRecipientSourceChange(select) {
    const card = select.closest('.feature-card');
    if (!card) return;
    const type = select.value;
    const conditionalDivs = card.querySelectorAll('[data-conditional]');
    conditionalDivs.forEach(div => {
        div.classList.add('hidden');
        if (div.dataset.conditional === type) {
            div.classList.remove('hidden');
        }
    });
    triggerAutosave();
}

export function handleSourceSheetTypeChange(select) {
    const card = select.closest('.feature-card');
    if (!card) return;
    const type = select.value;
    const nameInput = card.querySelector('[data-id="sourceSheetName"]');
    if (nameInput) {
        if (type === 'specific') {
            nameInput.classList.remove('hidden');
        } else {
            nameInput.classList.add('hidden');
        }
    }
    triggerAutosave();
}


// --- Core UI Logic ---
// Updated addFeature to match original flow
export function addFeature(featureType) {
    // If no type is passed (e.g., from a generic "Add Component" button), default or prompt?
    // For now, let's assume it's called with a specific type.
    if (!featureType || !featureTemplates[featureType]) {
        console.error(`Feature type '${featureType}' is not supported.`);
        showToast(`❌ Unsupported feature type: ${featureType}`);
        return;
    }

    const container = document.getElementById('featuresContainer');
    featureCounter++;
    const featureId = `feature-${featureCounter}`;
    const emoji = featureEmojis[featureType] || defaultEmoji;
    let title = featureType.charAt(0).toUpperCase() + featureType.slice(1); // Default title
    // Special case for timeTrigger to get workflow options
    let templateHTML = '';
    if (featureType === 'timeTrigger') {
         // Pass an empty array initially, we'll update it after all features are added
        templateHTML = featureTemplates.timeTrigger([]);
    } else {
        templateHTML = featureTemplates[featureType]();
    }

    // Set title based on type if it's a workflow
    if (featureType === 'workflow') {
        title = 'New Workflow'; // Default, will be updated by input
    }

    const card = document.createElement('div');
    card.className = 'feature-card bg-gray-50 p-4 rounded-md border border-gray-300 relative'; // Use original classes + relative
    card.id = featureId;
    card.dataset.type = featureType;
    card.dataset.title = title; // Initial title
    card.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <div class="flex items-center">
                <span class="drag-handle cursor-move mr-2 text-gray-400 hover:text-gray-600">☰</span>
                <h3 class="font-semibold text-gray-800">${emoji} ${title}</h3> <!-- Add emoji -->
            </div>
            <button onclick="toggleCard('${featureId}')" class="text-gray-500 hover:text-gray-700 mr-2 text-sm">▼</button>
            <button onclick="this.parentElement.parentElement.remove(); updateMarkdown(); triggerAutosave(); if(['workflow', 'customMenu'].includes('${featureType}')) updateAllDropdowns();" class="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
        <div class="card-content"> <!-- Add card-content div for toggling -->
            ${templateHTML}
        </div>
    `;
    container.appendChild(card);

    // --- Post-creation setup ---
    // 1. Make Sortable
    makeCardSortable(card);

    // 2. Update title dynamically if it's a workflow or menu
    if (featureType === 'workflow') {
        const nameInput = card.querySelector('[data-id="workflowName"]');
        if (nameInput) {
            const updateTitle = () => {
                const newName = nameInput.value.trim() || 'New Workflow';
                card.dataset.title = newName;
                card.querySelector('h3').textContent = `${emoji} ${newName}`;
                updateMarkdown();
                triggerAutosave();
                updateAllDropdowns(); // Update dropdowns if workflow name changes
            };
            nameInput.addEventListener('input', updateTitle);
            // Initial call to set title correctly if template has default value
            // Not needed here as it's new, but good practice if loading.
        }
    } else if (featureType === 'customMenu') {
        const nameInput = card.querySelector('[data-id="menuName"]');
        if (nameInput) {
            const updateTitle = () => {
                const newName = nameInput.value.trim() || 'Custom Menu';
                card.dataset.title = newName;
                card.querySelector('h3').textContent = `${emoji} ${newName}`;
                updateMarkdown();
                triggerAutosave();
            };
            nameInput.addEventListener('input', updateTitle);
        }
    }

    // 3. Update Markdown and Autosave
    updateMarkdown();
    triggerAutosave();

    // 4. Update dropdowns if a workflow or menu was added (affects linking)
    if (['workflow', 'customMenu'].includes(featureType)) {
        updateAllDropdowns();
    }
}

export function addStep(selector) {
    const stepType = selector.value;
    if (!stepType) return;

    const workflowCard = selector.closest('.feature-card');
    if (!workflowCard) return;

    const stepsContainer = workflowCard.querySelector('[data-container="steps"]');
    if (!stepsContainer) return;

    elementCounter++;
    const stepId = `step-${elementCounter}`;
    const stepCard = document.createElement('div');
    stepCard.className = 'step-card bg-white p-3 rounded border border-gray-200 relative';
    stepCard.id = stepId;
    stepCard.dataset.type = stepType;
    stepCard.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <div class="flex items-center">
                <span class="drag-handle-step cursor-move mr-2 text-gray-400 hover:text-gray-600 text-xs">⋮⋮</span>
                <h4 class="font-semibold text-gray-700 text-sm">${selector.options[selector.selectedIndex].text}</h4>
            </div>
            <button onclick="toggleCard('${stepId}')" class="text-gray-500 hover:text-gray-700 mr-2 text-xs">▼</button>
            <button onclick="this.parentElement.parentElement.remove(); updateMarkdown(); triggerAutosave();" class="text-red-500 hover:text-red-700 font-bold text-sm">&times;</button>
        </div>
        <div class="card-content-step">
            ${stepTemplates[stepType] ? stepTemplates[stepType]() : `<p>Template for ${stepType} not found.</p>`}
        </div>
    `;
    stepsContainer.appendChild(stepCard);
    selector.value = ""; // Reset selector
    updateMarkdown();
    triggerAutosave();
}

export function addUIElement(selector, type) {
    if (!type || !featureTemplates[type]) return;

    const featureCard = selector.closest('.feature-card');
    if (!featureCard) return;

    const elementsContainer = featureCard.querySelector('[data-container="elements"]');
    if (!elementsContainer) return;

    elementCounter++;
    const elementId = `el-${elementCounter}`;
    const elementDiv = document.createElement('div');
    elementDiv.id = elementId;

    // Set class and dataset based on type
    if (type === 'subMenu') {
        elementDiv.className = 'feature-card bg-gray-50 p-3 rounded-md border-l-gray-400 border-l-4 mb-2 relative'; // Match submenu card style
        elementDiv.dataset.type = 'submenu';
    } else {
        // menuItem, separator, input, button
        elementDiv.className = 'flex items-center gap-2 p-1 hover:bg-gray-100 rounded relative';
        elementDiv.dataset.type = `ui-${type}`;
        elementDiv.draggable = true; // Make draggable for Sortable
    }

    elementDiv.innerHTML = featureTemplates[type]();

    elementsContainer.appendChild(elementDiv);

    // --- Post-creation setup for UI elements ---
    if (type === 'subMenu') {
        const nameInput = elementDiv.querySelector('[data-id="submenuName"]');
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                updateMarkdown();
                triggerAutosave();
            });
        }
        // Make submenu items container sortable
        const submenuItemsContainer = elementDiv.querySelector('[data-container="menuitems"]');
        if (submenuItemsContainer) {
            // Ensure Sortable is initialized for submenu items if needed later
            // (Currently handled by makeCardSortable parent call, but good to note)
        }
    } else {
        // For menuItem, button: update dropdowns initially
        if (['menuItem', 'button'].includes(type)) {
            const workflowSelect = elementDiv.querySelector('[data-id="linkedWorkflow"]');
            if (workflowSelect) {
                 workflowSelect.innerHTML = getWorkflowOptions(); // Populate on add
                 workflowSelect.addEventListener('change', () => {
                     updateMarkdown();
                     triggerAutosave();
                 });
            }
        }
        // Add input listeners for others
        const inputs = elementDiv.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
             if (input.type !== 'select-one' || !input.dataset.id || !input.dataset.id.includes('linkedWorkflow')) {
                 // Avoid double-adding listener to selects handled above
                 input.addEventListener('input', () => {
                     updateMarkdown();
                     triggerAutosave();
                 });
             }
        });
    }

    selector.value = ""; // Reset selector
    updateMarkdown();
    triggerAutosave();
}


// --- New Helper Functions for Original Flow (for customMenu) ---
export function addMenuItem(button) {
    const container = button.closest('.feature-card, .submenu-items-container').querySelector('[data-container="menuitems"]');
    if (!container) {
        console.error("Menu items container not found for addMenuItem");
        return;
    }
    elementCounter++;
    const itemId = `el-${elementCounter}`;
    const itemDiv = document.createElement('div');
    itemDiv.id = itemId;
    itemDiv.className = 'flex items-center gap-2 p-1 hover:bg-gray-100 rounded relative';
    itemDiv.dataset.type = 'menuitem';
    itemDiv.innerHTML = `
        <span class="drag-handle-element cursor-move text-gray-400 hover:text-gray-600 text-xs mr-1">⋮⋮</span>
        <input type="text" class="flex-1 p-1 border border-gray-300 rounded-md text-sm" data-id="menuItemName" placeholder="Item Name" oninput="window.triggerAutosave()">
        <select class="flex-1 p-1 border border-gray-300 rounded-md text-sm" data-id="linkedWorkflow" oninput="window.triggerAutosave()">
            ${getWorkflowOptions()}
        </select>
        <button onclick="this.parentElement.remove(); window.updateMarkdown(); window.triggerAutosave();" class="text-red-500 hover:text-red-700 font-bold text-sm">&times;</button>
    `;
    container.appendChild(itemDiv);
    updateMarkdown();
    triggerAutosave();
}

export function addSeparator(button) {
    const container = button.closest('.feature-card, .submenu-items-container').querySelector('[data-container="menuitems"]');
    if (!container) {
        console.error("Menu items container not found for addSeparator");
        return;
    }
    elementCounter++;
    const sepId = `el-${elementCounter}`;
    const sepDiv = document.createElement('div');
    sepDiv.id = sepId;
    sepDiv.className = 'flex items-center gap-2 text-gray-400 text-sm p-1';
    sepDiv.dataset.type = 'separator';
    sepDiv.innerHTML = `
        <span class="drag-handle-element cursor-move text-gray-400 hover:text-gray-600 text-xs mr-1">⋮⋮</span>
        <span>- Separator -</span>
        <button onclick="this.parentElement.remove(); window.updateMarkdown(); window.triggerAutosave();" class="text-red-500 hover:text-red-700 font-bold text-sm">&times;</button>
    `;
    container.appendChild(sepDiv);
    updateMarkdown();
    triggerAutosave();
}

export function toggleCard(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    const content = card.querySelector('.card-content') || card.querySelector('.card-content-step');
    const toggleBtn = card.querySelector('button[onclick*="toggleCard"]');
    if (content && toggleBtn) {
        content.classList.toggle('hidden');
        toggleBtn.textContent = content.classList.contains('hidden') ? '▶' : '▼';
    }
}

export function loadTemplate(templateName) {
    const featuresToAdd = templateDefinitions[templateName];
    if (!featuresToAdd || !Array.isArray(featuresToAdd)) {
        console.error(`Template '${templateName}' not found or is invalid.`);
        showToast(`❌ Template '${templateName}' not found.`);
        return;
    }

    // Clear existing features for a clean template start
    document.getElementById('featuresContainer').innerHTML = '';
    featureCounter = 0; // Reset counter
    elementCounter = 0; // Reset element counter

    // Temporarily hold IDs of newly created workflows to link triggers later
    const workflowIdMap = {};

    featuresToAdd.forEach((feature, index) => {
        featureCounter++;
        const featureId = `feature-${featureCounter}`;
        const emoji = featureEmojis[feature.type] || defaultEmoji;
        let title = feature.details?.workflowName || feature.type;
        const card = document.createElement('div');
        card.className = 'feature-card bg-gray-50 p-4 rounded-md border border-gray-300 relative';
        card.id = featureId;
        card.dataset.type = feature.type;
        card.dataset.title = title;

        let templateHTML = '';
        if (feature.type === 'timeTrigger') {
             // Pass an empty array initially, we'll update it after all features are added
            templateHTML = featureTemplates.timeTrigger([]);
        } else if (featureTemplates[feature.type]) {
            templateHTML = featureTemplates[feature.type]();
        } else {
            console.warn(`Template for feature type '${feature.type}' not found.`);
            templateHTML = `<p>Template for ${feature.type} not found.</p>`;
        }

        card.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center">
                    <span class="drag-handle cursor-move mr-2 text-gray-400 hover:text-gray-600">☰</span>
                    <h3 class="font-semibold text-gray-800">${emoji} ${title}</h3>
                </div>
                <button onclick="toggleCard('${featureId}')" class="text-gray-500 hover:text-gray-700 mr-2 text-sm">▼</button>
                <button onclick="this.parentElement.parentElement.remove(); updateMarkdown(); triggerAutosave(); updateAllDropdowns();" class="text-red-500 hover:text-red-700 font-bold">&times;</button>
            </div>
            <div class="card-content">
                ${templateHTML}
            </div>
        `;

        document.getElementById('featuresContainer').appendChild(card);

        // Store the ID mapping for workflows
        if (feature.type === 'workflow' && feature.details?.workflowName) {
            workflowIdMap[feature.details.workflowName] = featureId;
        }

        // Populate initial details if provided
        if (feature.details) {
            Object.keys(feature.details).forEach(key => {
                // Special handling for recipientType to show/hide conditional fields
                if (key === 'recipientSource') { // Assuming template uses recipientSource
                     const select = card.querySelector(`[data-id="${key}"]`);
                     if (select) {
                         select.value = feature.details[key];
                         handleRecipientSourceChange(select); // Show/hide fields
                         // Set the value again after handling change, just in case
                         select.value = feature.details[key];
                     }
                } else if (key === 'sourceSheetType') { // Assuming template uses sourceSheetType
                     const select = card.querySelector(`[data-id="${key}"]`);
                     if (select) {
                         select.value = feature.details[key];
                         handleSourceSheetTypeChange(select); // Show/hide fields
                         select.value = feature.details[key];
                     }
                }
                const input = card.querySelector(`[data-id="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = feature.details[key];
                    } else {
                        input.value = feature.details[key];
                    }
                }
            });
        }

        makeCardSortable(card);
    });

    // --- Link Triggers ---
    // After all features are added, find triggers and link them
    setTimeout(() => { // Use timeout to ensure DOM is updated
        document.querySelectorAll('.feature-card[data-type="timeTrigger"]').forEach(triggerCard => {
            const workflowNameDetail = featuresToAdd.find(f => f.type === 'timeTrigger')?.details?.linkedWorkflowName; // Assume we add this to template definition
            if (workflowNameDetail && workflowIdMap[workflowNameDetail]) {
                const linkedWorkflowId = workflowIdMap[workflowNameDetail];
                const select = triggerCard.querySelector('select[data-id="linkedWorkflow"]');
                if (select) {
                    // Update options first
                    select.innerHTML = getWorkflowOptions();
                    select.value = linkedWorkflowId;
                }
            } else {
                // If no specific name, try to link to the first workflow created by the template
                const firstWorkflowId = Object.values(workflowIdMap)[0];
                if(firstWorkflowId) {
                    const select = triggerCard.querySelector('select[data-id="linkedWorkflow"]');
                    if (select) {
                        select.innerHTML = getWorkflowOptions();
                        select.value = firstWorkflowId;
                    }
                }
            }
        });
        updateAllDropdowns(); // Final update to ensure all dropdowns are consistent
    }, 100);

    updateMarkdown();
    showToast(`🎨 Loaded template: ${templateName}`);
}


// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', (event) => {
    const featuresContainer = document.getElementById('featuresContainer');
    const otherReqsContainer = document.getElementById('otherRequirementsContainer');
    const customReqsTextarea = document.getElementById('customRequirements');
    const projectGoalInput = document.getElementById('projectGoal');

    // Add event listeners for dynamic fields with debounce
    customReqsTextarea.addEventListener('input', function(e) {
        clearTimeout(e.target.autosaveTimer);
        e.target.autosaveTimer = setTimeout(() => {
            updateMarkdown();
            triggerAutosave();
        }, 1000); // 1s debounce for custom requirements
    });

    projectGoalInput.addEventListener('input', function(e) {
        clearTimeout(e.target.autosaveTimer);
        e.target.autosaveTimer = setTimeout(() => {
            updateMarkdown();
            triggerAutosave();
        }, 1000); // 1s debounce
    });

    // Initialize SortableJS once the library is confirmed loaded
    if (window.Sortable) {
        initializeSortable(window.Sortable);
    } else {
        console.error("SortableJS library failed to load.");
    }

    // Initial Markdown update
    updateMarkdown();

    // Check for autosave on load
    checkForAutosave();

    // Populate save slots
    populateSaveSlots();
});