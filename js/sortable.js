// js/sortable.js
import { updateMarkdown } from './markdown.js';

let Sortable; // Will hold the SortableJS reference

// Function to initialize SortableJS (needs to wait for library load)
export function initializeSortable(SortableLib) {
  Sortable = SortableLib;
  if (Sortable) {
    const featuresContainer = document.getElementById('featuresContainer');
    if (featuresContainer) {
      makeContainerSortable(featuresContainer);
    }
  } else {
    console.error("SortableJS library not provided or loaded correctly.");
  }
}

export function makeContainerSortable(container) {
  if (!Sortable) {
    console.warn("SortableJS not initialized yet.");
    return;
  }
  new Sortable(container, {
    animation: 150,
    handle: '.drag-handle',
    onEnd: function (evt) {
       updateMarkdown();
       window.triggerAutosave(); // Trigger autosave on sort
    }
  });
}

export function makeCardSortable(card) {
  if (!Sortable) {
    console.warn("SortableJS not initialized yet.");
    return;
  }
  const stepsContainer = card.querySelector('[data-container="steps"]');
  if (stepsContainer) {
    new Sortable(stepsContainer, {
      animation: 150,
      handle: '.drag-handle-step',
      onEnd: function (evt) {
         updateMarkdown();
         window.triggerAutosave(); // Trigger autosave on sort
      }
    });
  }

  const elementsContainer = card.querySelector('[data-container="elements"]');
  if (elementsContainer) {
    new Sortable(elementsContainer, {
      animation: 150,
      handle: '.drag-handle-element',
      onEnd: function (evt) {
         updateMarkdown();
         window.triggerAutosave(); // Trigger autosave on sort
      }
    });
  }
}

// Re-initialize Sortable instances after loading/restoring
export function reinitializeSortableInstances() {
  if (!Sortable) return;
  // Destroy existing instances to prevent conflicts?
  // Or assume they are gone after innerHTML replacement?

  const featuresContainer = document.getElementById('featuresContainer');
  if (featuresContainer) {
    makeContainerSortable(featuresContainer);
  }

  document.querySelectorAll('.feature-card').forEach(card => {
    makeCardSortable(card);
  });
}