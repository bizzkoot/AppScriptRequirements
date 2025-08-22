// js/ui.js
import { captureProjectState, restoreProjectState } from './autosave.js';
import { updateMarkdown } from './markdown.js';

const SAVE_SLOTS_KEY = 'appsScriptProjectSaveSlots';

export function showToast(message) {
    const toast = document.getElementById('toast-container');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

export function switchTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }
    const tabLinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName + "-content").style.display = "block";
    evt.currentTarget.className += " active";

    // If switching to preview, render it
    if (tabName === 'preview-tab') {
        updateMarkdown(); // This will call renderMarkdownPreview
    }
}

export function copyMarkdown() {
    const textarea = document.getElementById('markdownOutput');
    if (!textarea.value) {
        showToast('Nothing to copy!');
        return;
    }
    textarea.select();
    document.execCommand('copy');
    showToast('Copied to clipboard!');
}

export function downloadMarkdown() {
    const markdownText = document.getElementById('markdownOutput').value;
    if (!markdownText) {
        showToast('Nothing to download!');
        return;
    }
    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'apps-script-requirements.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download started!');
}


export function openSaveModal() {
    const modal = document.getElementById("saveModal");
    if (modal) {
        modal.style.display = "block";
        populateSaveSlots(); // Refresh list when opening
    }
}

export function closeSaveModal() {
    const modal = document.getElementById("saveModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Close modal if clicked outside
window.onclick = function(event) {
    const modal = document.getElementById("saveModal");
    if (event.target == modal) {
        closeSaveModal();
    }
}

export function saveProject() {
    const projectName = document.getElementById('projectNameInput').value.trim();
    if (!projectName) {
        showToast('Please enter a project name.');
        return;
    }

    let saveSlots = JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY)) || {};
    const data = captureProjectState();
    data._timestamp = new Date().toISOString(); // Add timestamp
    saveSlots[projectName] = data;

    localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(saveSlots));
    showToast(`💾 Project '${projectName}' saved.`);
    document.getElementById('projectNameInput').value = ''; // Clear input
    populateSaveSlots(); // Refresh list
}

export function loadProject(projectName) {
    let saveSlots = JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY)) || {};
    const data = saveSlots[projectName];
    if (data) {
        restoreProjectState(data);
        closeSaveModal();
        showToast(`📂 Loaded project '${projectName}'.`);
    } else {
        showToast(`❌ Project '${projectName}' not found.`);
    }
}

export function deleteProject(projectName) {
    if (!confirm(`Are you sure you want to delete project '${projectName}'?`)) {
        return;
    }
    let saveSlots = JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY)) || {};
    delete saveSlots[projectName];
    localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(saveSlots));
    showToast(`🗑️ Deleted project '${projectName}'.`);
    populateSaveSlots(); // Refresh list
}

export function populateSaveSlots() {
    const listContainer = document.getElementById('savedProjectsList');
    if (!listContainer) return;

    let saveSlots = JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY)) || {};
    listContainer.innerHTML = ''; // Clear existing list

    if (Object.keys(saveSlots).length === 0) {
        listContainer.innerHTML = '<p class="text-gray-500">No saved projects yet.</p>';
        return;
    }

    for (const [name, data] of Object.entries(saveSlots)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center p-2 border border-gray-200 rounded';
        const date = data._timestamp ? new Date(data._timestamp).toLocaleString() : 'Unknown';
        itemDiv.innerHTML = `
            <div>
                <strong>${name}</strong> <span class="text-xs text-gray-500">(${date})</span>
            </div>
            <div>
                <button onclick="loadProject('${name}')" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs mr-1">Load</button>
                <button onclick="deleteProject('${name}')" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">Delete</button>
            </div>
        `;
        listContainer.appendChild(itemDiv);
    }
}