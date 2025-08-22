// js/templates.js

// --- Feature Emojis (from original) ---
export const featureEmojis = {
  workflow: "🔄",
  dataProcessor: "⚙️",
  reportGenerator: "📊",
  emailNotifier: "📧",
  timeTrigger: "⏰",
  customMenu: "🍽️",
  sheetDuplicator: "📑",
  formulaCalculation: "🧮",
  // Add more as needed
};
export const defaultEmoji = "🔧";

// --- Template Definitions (from original) ---
export const templateDefinitions = {
  // Templates for loading predefined projects
  dataProcessor: [
    { type: 'workflow', details: { workflowName: "Data Processing Pipeline", workflowDescription: "Main workflow to clean and transform raw data." } },
    { type: 'dataProcessor', details: { processingLogic: "Split combined vendor data in Column A into 'Code' (Column B) and 'Name' (Column C).", inputSource: "RawData!A2:A", outputDestination: "RawData!B2" } },
    { type: 'customMenu', details: { menuName: "Data Tools" } }
  ],
  reportGenerator: [
    { type: 'reportGenerator', details: { dataSource: "Sales!A2:C", reportTitle: "Monthly Sales Summary", outputFormat: "sheet" } },
    { type: 'timeTrigger', details: { linkedWorkflow: "", frequency: "day" } } // Will link after creation
  ],
  scheduler: [
    { type: 'sheetDuplicator', details: { sourceSheetType: "active", specificSheetName: "", newSheetNaming: "timestamp", customNamePattern: "" } },
    { type: 'timeTrigger', details: { linkedWorkflow: "", frequency: "day" } }
  ]
};

// --- Feature Templates ---
export const featureTemplates = {
  // --- Core Feature Templates ---
  workflow: () => `
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Workflow Name:</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="workflowName" placeholder="e.g., Data Processing Pipeline" oninput="window.triggerAutosave()">
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Description:</label>
      <textarea class="w-full p-2 border border-gray-300 rounded-md" data-id="workflowDescription" rows="2" placeholder="Describe the overall purpose of this workflow..." oninput="window.triggerAutosave()"></textarea>
      <button class="enhance-btn mt-1 text-xs" onclick="window.enhanceText(this)">✨ Enhance</button>
    </div>
    <div class="steps-container space-y-3 mt-4" data-container="steps">
      <h4 class="font-semibold text-gray-700 flex items-center text-sm"><span class="mr-1">👣</span> Workflow Steps:</h4>
      <div class="flex gap-2">
        <select class="w-full p-2 border border-gray-300 rounded-md text-sm" data-id="stepSelector" onchange="window.addStep(this)">
          <option value="" disabled selected>Add a Workflow Step...</option>
          <option value="dataProcessor">Data Processor</option>
          <option value="reportGenerator">Report Generator</option>
          <option value="emailNotifier">Email Notifier</option>
          <option value="sheetDuplicator">Sheet Duplicator</option>
          <option value="formulaCalculation">Formula Calculation</option>
          <!-- Add other step types as needed -->
        </select>
      </div>
    </div>
  `,
  dataProcessor: () => `
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Processing Logic:</label>
      <textarea class="w-full p-2 border border-gray-300 rounded-md" data-id="processingLogic" rows="3" placeholder="Describe the data transformation logic (e.g., Split column A by space, concatenate B and C...)" oninput="window.triggerAutosave()"></textarea>
      <button class="enhance-btn mt-1 text-xs" onclick="window.enhanceText(this)">✨ Enhance</button>
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Input Source:</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="inputSource" placeholder="e.g., Sheet1!A2:C" oninput="window.triggerAutosave()">
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Output Destination:</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="outputDestination" placeholder="e.g., Sheet1!D2" oninput="window.triggerAutosave()">
    </div>
    <div class="expansion-options">
      <fieldset>
        <legend class="flex items-center text-sm"><span class="mr-1">⚙️</span> Expansion Possibilities</legend>
        <label class="flex items-center text-xs"><input type="checkbox" data-id="expBatchTransformations" class="mr-1"> Batch multiple transformations</label>
        <label class="flex items-center text-xs"><input type="checkbox" data-id="expApplyToRange" class="mr-1"> Apply to a specific range or sheet</label>
      </fieldset>
    </div>
  `,
  reportGenerator: () => `
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Data Source:</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="dataSource" placeholder="e.g., Sheet1!A:D" oninput="window.triggerAutosave()">
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Report Title:</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="reportTitle" placeholder="e.g., Monthly Sales Summary" oninput="window.triggerAutosave()">
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Output Format:</label>
      <select class="w-full p-2 border border-gray-300 rounded-md" data-id="outputFormat">
        <option value="sheet">New Sheet</option>
        <option value="doc">Google Doc</option>
      </select>
    </div>
  `,
  emailNotifier: () => `
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Source:</label>
      <select class="w-full p-2 border border-gray-300 rounded-md" data-id="recipientSource" onchange="window.handleRecipientSourceChange(this)">
        <option value="active_user">Active User</option>
        <option value="column">From Sheet Column</option>
        <option value="fixed">Fixed Recipients</option>
      </select>
    </div>
    <div class="mb-3 hidden" data-conditional="column">
      <label class="block text-sm font-medium text-gray-700 mb-1">Sheet & Column (e.g., Sheet1!C:C):</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="recipientColumn" placeholder="e.g., Contacts!C:C" oninput="window.triggerAutosave()">
    </div>
    <div class="mb-3 hidden" data-conditional="fixed">
      <label class="block text-sm font-medium text-gray-700 mb-1">Fixed Email Addresses (comma-separated):</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="fixedRecipients" placeholder="e.g., admin@company.com, user@example.com" oninput="window.triggerAutosave()">
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Email Customization:</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md mb-1" data-id="emailSubject" placeholder="Subject (e.g., Alert: Overdue Tasks Report)" oninput="window.triggerAutosave()">
      <textarea class="w-full p-2 border border-gray-300 rounded-md" data-id="emailBodyTemplate" rows="2" placeholder="Body Template (e.g., The following tasks are overdue: ...)" oninput="window.triggerAutosave()"></textarea>
      <button class="enhance-btn mt-1 text-xs" onclick="window.enhanceText(this)">✨ Enhance</button>
    </div>
    <div class="expansion-options">
      <fieldset>
        <legend class="flex items-center text-sm"><span class="mr-1">⚙️</span> Expansion Possibilities</legend>
        <label class="flex items-center text-xs"><input type="checkbox" data-id="expConditionalContent" class="mr-1"> Conditional content based on data</label>
        <label class="flex items-center text-xs"><input type="checkbox" data-id="expAttachReport" class="mr-1"> Attach generated report</label>
      </fieldset>
    </div>
  `,
  timeTrigger: (workflows = []) => {
    let options = workflows.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
    if (!options) options = '<option value="" disabled selected>No workflows defined yet</option>';
    return `
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Linked Workflow:</label>
        <select class="w-full p-2 border border-gray-300 rounded-md" data-id="linkedWorkflow">
          ${options}
        </select>
      </div>
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Frequency:</label>
        <select class="w-full p-2 border border-gray-300 rounded-md" data-id="frequency">
          <option value="minute">Every minute</option>
          <option value="hour">Hourly</option>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
        </select>
      </div>
    `;
  },
  customMenu: () => `
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Menu Name:</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="menuName" placeholder="e.g., Custom Tools" oninput="window.triggerAutosave()">
    </div>
    <div class="ui-elements-container space-y-2 mt-3" data-container="elements">
      <h4 class="font-semibold text-gray-700 flex items-center text-sm"><span class="mr-1">🖱️</span> UI Elements:</h4>
      <div class="flex gap-2">
        <select class="w-full p-2 border border-gray-300 rounded-md text-sm" data-id="elementSelector" onchange="window.addUIElement(this, this.value)">
          <option value="" disabled selected>Add UI Element...</option>
          <option value="subMenu">Sub-Menu</option>
          <option value="menuItem">Menu Item</option>
          <option value="separator">Separator</option>
          <option value="input">Input Field</option>
          <option value="button">Button</option>
        </select>
      </div>
    </div>
  `,
  sheetDuplicator: () => `
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Source Sheet:</label>
      <select class="w-full p-2 border border-gray-300 rounded-md mb-1" data-id="sourceSheetType" onchange="window.handleSourceSheetTypeChange(this)">
        <option value="active">Active Sheet</option>
        <option value="specific">Specific Sheet</option>
      </select>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md hidden" data-id="sourceSheetName" placeholder="Enter sheet name" oninput="window.triggerAutosave()">
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">New Sheet Naming:</label>
      <select class="w-full p-2 border border-gray-300 rounded-md" data-id="newSheetNaming">
        <option value="timestamp">Timestamp (e.g., Backup_2023-10-27_10-30)</option>
        <option value="counter">Counter (e.g., Archive_1, Archive_2)</option>
        <option value="custom">Custom Pattern</option>
      </select>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md mt-1 hidden" data-id="customNamePattern" placeholder="e.g., Backup_YYYY-MM-DD" oninput="window.triggerAutosave()">
    </div>
  `,
  formulaCalculation: () => `
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Formula Logic:</label>
      <textarea class="w-full p-2 border border-gray-300 rounded-md" data-id="formulaLogic" rows="3" placeholder="Describe the formula logic (e.g., CONCATENATE(A2, '-', B2) or SUMIF based on criteria in column C...)" oninput="window.triggerAutosave()"></textarea>
      <button class="enhance-btn mt-1 text-xs" onclick="window.enhanceText(this)">✨ Enhance</button>
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Apply To Range:</label>
      <input type="text" class="w-full p-2 border border-gray-300 rounded-md" data-id="applyToRange" placeholder="e.g., Sheet1!D2:D" oninput="window.triggerAutosave()">
    </div>
    <div class="expansion-options">
      <fieldset>
        <legend class="flex items-center text-sm"><span class="mr-1">⚙️</span> Expansion Possibilities</legend>
        <label class="flex items-center text-xs"><input type="checkbox" data-id="expConditionalFormula" class="mr-1"> Apply conditionally based on other cell values</label>
        <label class="flex items-center text-xs"><input type="checkbox" data-id="expDynamicRange" class="mr-1"> Apply to a dynamic range that grows</label>
      </fieldset>
    </div>
  `,

  // --- UI Element Templates (for customMenu) ---
  subMenu: () => `
    <div class="feature-card bg-gray-50 p-3 rounded-md border-l-gray-400 border-l-4 mb-2 relative">
      <div class="flex justify-between items-center mb-2">
        <span class="drag-handle-element cursor-move text-gray-400 hover:text-gray-600 text-xs mr-1">⋮⋮</span>
        <input type="text" class="flex-1 p-1 border border-gray-300 rounded-md text-sm font-semibold" data-id="submenuName" placeholder="Sub-Menu Name" oninput="window.triggerAutosave()">
        <button onclick="this.parentElement.parentElement.remove(); window.updateMarkdown(); window.triggerAutosave();" class="text-red-500 hover:text-red-700 font-bold text-sm ml-2">&times;</button>
      </div>
      <div class="submenu-items-container mt-2 space-y-2" data-container="menuitems">
        <!-- Menu items for this submenu will go here -->
      </div>
      <div class="mt-2 text-xs">
        <button onclick="window.addMenuItem(this)" class="bg-white border border-gray-300 text-gray-600 font-semibold p-1 rounded-md hover:bg-gray-100 mr-1">Add Item</button>
        <button onclick="window.addSeparator(this)" class="bg-white border border-gray-300 text-gray-600 font-semibold p-1 rounded-md hover:bg-gray-100">Add Separator</button>
      </div>
    </div>
  `,
  menuItem: () => `
    <div class="flex items-center gap-2 p-1 hover:bg-gray-100 rounded relative">
      <span class="drag-handle-element cursor-move text-gray-400 hover:text-gray-600 text-xs mr-1">⋮⋮</span>
      <input type="text" class="flex-1 p-1 border border-gray-300 rounded-md text-sm" data-id="menuItemName" placeholder="Item Name" oninput="window.triggerAutosave()">
      <select class="flex-1 p-1 border border-gray-300 rounded-md text-sm" data-id="linkedWorkflow" oninput="window.triggerAutosave()">
        ${window.getWorkflowOptions ? window.getWorkflowOptions() : '<option value="">Loading...</option>'}
      </select>
      <button onclick="this.parentElement.remove(); window.updateMarkdown(); window.triggerAutosave();" class="text-red-500 hover:text-red-700 font-bold text-sm">&times;</button>
    </div>
  `,
  separator: () => `
    <div class="flex items-center gap-2 text-gray-400 text-sm p-1">
      <span class="drag-handle-element cursor-move text-gray-400 hover:text-gray-600 text-xs mr-1">⋮⋮</span>
      <span>- Separator -</span>
      <button onclick="this.parentElement.remove(); window.updateMarkdown(); window.triggerAutosave();" class="text-red-500 hover:text-red-700 font-bold text-sm">&times;</button>
    </div>
  `,
  input: () => `
    <div class="flex items-center gap-2 p-1 hover:bg-gray-100 rounded relative">
      <span class="drag-handle-element cursor-move text-gray-400 hover:text-gray-600 text-xs mr-1">⋮⋮</span>
      <span class="text-sm text-gray-500">Input:</span>
      <input type="text" class="flex-1 p-1 border border-gray-300 rounded-md text-sm" data-id="inputLabel" placeholder="Input Label (e.g., Start Date)" oninput="window.triggerAutosave()">
      <button onclick="this.parentElement.remove(); window.updateMarkdown(); window.triggerAutosave();" class="text-red-500 hover:text-red-700 font-bold text-sm">&times;</button>
    </div>
  `,
  button: () => `
    <div class="flex items-center gap-2 p-1 hover:bg-gray-100 rounded relative">
      <span class="drag-handle-element cursor-move text-gray-400 hover:text-gray-600 text-xs mr-1">⋮⋮</span>
      <span class="text-sm text-gray-500">Button:</span>
      <input type="text" class="flex-1 p-1 border border-gray-300 rounded-md text-sm" data-id="buttonText" placeholder="Button Text (e.g., Insert)" oninput="window.triggerAutosave()">
      <select class="flex-1 p-1 border border-gray-300 rounded-md text-sm" data-id="linkedWorkflow" oninput="window.triggerAutosave()">
        ${window.getWorkflowOptions ? window.getWorkflowOptions() : '<option value="">Loading...</option>'}
      </select>
      <button onclick="this.parentElement.remove(); window.updateMarkdown(); window.triggerAutosave();" class="text-red-500 hover:text-red-700 font-bold text-sm">&times;</button>
    </div>
  `
};

// --- Step Templates (used within Workflow steps) ---
// These are often the same as the top-level feature templates for simplicity
// or can be slightly different if needed.
export const stepTemplates = {
  dataProcessor: featureTemplates.dataProcessor,
  reportGenerator: featureTemplates.reportGenerator,
  emailNotifier: featureTemplates.emailNotifier,
  sheetDuplicator: featureTemplates.sheetDuplicator,
  formulaCalculation: featureTemplates.formulaCalculation,
  // Add other step types as needed
};
