<div align="center">

# ⚙️ Apps Script Requirements Generator

**A web-based tool to help you build detailed, well-structured requirements for your Google Apps Script projects.**

</div>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge"/>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License Badge"/>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-how-to-use">How to Use</a> •
  <a href="#-technologies-used">Tech Stack</a> •
  <a href="#-key-functionality-explained">Code Deep-Dive</a>
</p>

<div align="center">
  <img src="Screenshot.JPG" alt="A screenshot of the Apps Script Requirements Generator interface" width="40%">
  <br>
  <em>The application interface in action.</em>
</div>

---

## 📖 Overview

The **Apps Script Requirements Generator** is designed to streamline the initial phase of project development. It provides an intuitive interface for defining project goals, adding various script components, specifying non-functional requirements, and generating a clean Markdown summary.

This tool ensures all key aspects of your script are considered and documented in a consistent, professional format, saving you time and preventing scope creep.

---

## ✨ Features

* 🎯 **Project Goal Definition:** Clearly state the primary objective of your Apps Script project to keep your development focused.

* 🏗️ **Component-Based Building:** Use dedicated buttons to quickly add pre-defined components to your specification:
    * **Workflows:** Define the core sequences of actions, containing steps like Data Processors or Report Generators.
    * **Data Processing:** Specify logic for transforming, cleaning, validating, or aggregating data.
    * **Triggers & UI:** Configure time-based triggers, custom menus, and sheet-based operations with ease.
    * **Communication:** Outline email notifications and reporting tasks.
    * **Formulas:** Define complex, context-aware formula calculations.

* ⚡ **Dynamic & Interactive UI:**
    * **Templates:** Jumpstart your specification with pre-built templates for common scenarios.
    * **Drag & Drop:** Easily reorder components and steps to match your desired logic flow.
    * **Collapsible Sections:** Keep your workspace tidy by collapsing component cards.
    * **Dynamic Linking:** Link workflows to triggers or menu items using convenient dropdowns.

* 🤖 **AI-Powered Enhancement (Simulated):** Use the `✨ Enhance` button to turn your simple notes into more structured, professional specifications.

* 📝 **Real-time Markdown Generation:**
    * Watch your `requirements.md` file build itself in real-time as you add and edit components.
    * Toggle between a raw **Markdown** view and a rendered **Preview** that looks just like a GitHub README.

* 💾 **Save & Manage Your Work:**
    * **Auto-save:** Your work is automatically saved to your browser's local storage, so you'll never lose progress.
    * **Copy & Download:** Instantly copy the Markdown to your clipboard or download it as a `.md` file.
    * **Save/Load:** Manage multiple project specifications by saving and loading them from your browser.

---

## 🚀 How to Use

1.  **Launch the App:** Open `index.html` in your browser. For the best experience, use a local server (like the VS Code Live Server extension).
2.  **Define the Project Goal:** Write a concise sentence describing what you want your script to achieve.
3.  **Add Components:** Use the component buttons (`+ Workflow`, `+ Custom Menu`, etc.) or a **Template** to start building your spec.
4.  **Fill in the Details:** Populate the cards with your project's details. Name your workflows, describe data logic, and define UI elements.
5.  **Build Complex Structures:** Nest steps inside a **Workflow** or link **Menu Items** to actions you've defined. Don't forget to drag and drop to reorder!
6.  **Specify Other Requirements:** Check the boxes for non-functional needs like "Performance Optimization" or add custom notes.
7.  **Review & Export:** Toggle between the **Raw** and **Preview** tabs to review the output. When you're happy, click **Copy** or **Download** to get your specification file.

---

## 🛠️ Technologies Used

* **Structure:** `HTML5`
* **Styling:** `Tailwind CSS`
* **Logic:** `JavaScript (ES6 Modules)`
* **Interactivity:** `SortableJS` (for drag-and-drop)
* **Markdown Rendering:** `Marked.js`
* **Fonts:** `Google Fonts (Inter)`
* **Storage:** `Browser LocalStorage API`

---

## 🔬 Key Functionality Explained

The application logic is organized into several JavaScript modules (`js/*.js`) for maintainability.

* `addFeature(type)`: Creates and appends a new top-level feature card (e.g., Workflow, Custom Menu) to the UI.
* `addStep(selector)` / `addUIElement(selector, type)`: Adds specific steps or UI elements within their parent cards.
* `updateMarkdown()`: The core function that reads all data from the UI and compiles it into the final Markdown output. It's triggered by nearly every user action.
* `triggerAutosave()` & `checkForAutosave()`: Manages the automatic saving and restoration of the project state to `localStorage`.
* `saveProject()` & `loadProject()`: Handles user-initiated saving and loading of named projects.
* **Dynamic Template Objects:** `featureTemplates` and `stepTemplates` are JS objects that store HTML string templates for each UI component, making the UI easy to manage and extend.
* **Modular Structure:** The code is split into modules like `js/main.js`, `js/templates.js`, and `js/markdown.js` to separate concerns and improve code clarity.