// js/markdown.js
export function updateMarkdown() {
  const goal = document.getElementById('projectGoal').value || 'No goal specified';
  let markdown = `# Apps Script Project Requirements\n\n## 1. Project Details\n**Primary Goal:** ${goal}\n\n## 2. Script Components\n`;

  const features = document.querySelectorAll('.feature-card');
  if (features.length === 0) {
    markdown += "No components added yet.";
  } else {
    features.forEach((feature, index) => {
      const type = feature.dataset.type;
      const title = feature.dataset.title || type;
      markdown += `### ${index + 1}. ${title}\n`;

      // Collect details from inputs, textareas, selects within the feature
      const inputs = feature.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        // Skip elements inside expansion options or UI element rows
        if (input.closest('.expansion-options') || input.closest('.flex.items-center.space-x-2')) return;

        let label = input.previousElementSibling?.textContent?.trim().replace(':', '') ||
                    input.parentElement?.previousElementSibling?.textContent?.trim().replace(':', '') ||
                    input.dataset.id;
        if (!label) label = input.type === 'checkbox' ? 'Option' : 'Field';

        if (input.type === 'text' || input.type === 'textarea') {
          const value = input.value.trim();
          if (value) markdown += ` - **${label}:** ${value}\n`;
        } else if (input.type === 'select-one') {
          const selectedOption = input.options[input.selectedIndex]?.text;
          if (selectedOption && selectedOption !== 'Add a Step...' && selectedOption !== 'Add UI Element...') {
            markdown += ` - **${label}:** ${selectedOption}\n`;
          }
        } else if (input.type === 'checkbox') {
          if (input.checked) markdown += ` - **${label}**\n`;
        }
      });

      // Handle Steps
      const stepsContainer = feature.querySelector('[data-container="steps"]');
      if (stepsContainer) {
        const steps = stepsContainer.querySelectorAll('.step-card');
        if (steps.length > 0) {
          markdown += `\n#### Steps:\n`;
          steps.forEach((step, stepIndex) => {
            const stepTitle = step.querySelector('h4')?.textContent?.trim() || `Step ${stepIndex + 1}`;
            markdown += `**${stepIndex + 1}. ${stepTitle}**\n`;
            const stepInputs = step.querySelectorAll('input, textarea, select');
            stepInputs.forEach(input => {
              if (input.closest('.expansion-options')) return;
              const label = input.previousElementSibling?.textContent?.trim().replace(':', '') ||
                            input.parentElement?.previousElementSibling?.textContent?.trim().replace(':', '') ||
                            input.dataset.id;
              if (input.type === 'text' || input.type === 'textarea') {
                const value = input.value.trim();
                if (value) markdown += `  - **${label}:** ${value}\n`;
              } else if (input.type === 'select-one') {
                const selectedOption = input.options[input.selectedIndex]?.text;
                if (selectedOption) markdown += `  - **${label}:** ${selectedOption}\n`;
              }
            });
          });
        }
      }

      // Handle UI Elements
      const elementsContainer = feature.querySelector('[data-container="elements"]');
      if (elementsContainer) {
        const elements = elementsContainer.querySelectorAll('.flex.items-center.space-x-2'); // Specific selector for UI elements
        if (elements.length > 0) {
          markdown += `\n#### UI Elements:\n`;
          elements.forEach((element, elementIndex) => {
            const inputs = element.querySelectorAll('input, select');
            const elementType = inputs[0]?.dataset.id; // e.g., menuItemText, buttonText
            const elementLabel = elementType ? elementType.charAt(0).toUpperCase() + elementType.slice(1).replace(/Text|Label/, '') : 'Element';
            markdown += `**${elementIndex + 1}. ${elementLabel}**\n`;
            inputs.forEach(input => {
              const label = input.previousElementSibling?.textContent?.trim() ||
                            input.placeholder?.split(' ')[0] || // Fallback to placeholder part
                            input.dataset.id;
              if (input.type === 'text') {
                const value = input.value.trim();
                if (value) markdown += `  - **${label}:** ${value}\n`;
              } else if (input.type === 'select-one') {
                const selectedOption = input.options[input.selectedIndex]?.text;
                if (selectedOption) markdown += `  - **${label}:** ${selectedOption}\n`;
              }
            });
          });
        }
      }

      markdown += `\n`; // Add space between features
    });
  }

  // Other Requirements
  markdown += `## 3. Other Requirements\n`;
  const otherReqs = document.querySelectorAll('#otherRequirementsContainer input[type="checkbox"]:checked');
  if (otherReqs.length > 0) {
    otherReqs.forEach(req => {
      const label = req.parentElement?.textContent?.trim() || req.id;
      markdown += `- ${label}\n`;
    });
  } else {
    markdown += `- None specified\n`;
  }

  const customReqs = document.getElementById('customRequirements').value.trim();
  if (customReqs) {
    markdown += `\n**Custom Requirements:**\n${customReqs}\n`;
  }

  document.getElementById('markdownOutput').value = markdown;
  // If preview tab is active, update it
  if (!document.getElementById('preview-tab-content').classList.contains('hidden')) {
    renderMarkdownPreview();
  }
}

export function renderMarkdownPreview() {
  const markdownText = document.getElementById('markdownOutput').value;
  if (window.marked) {
    document.getElementById('preview-content').innerHTML = window.marked.parse(markdownText);
  } else {
    document.getElementById('preview-content').innerText = "Markdown library not loaded.";
  }
}