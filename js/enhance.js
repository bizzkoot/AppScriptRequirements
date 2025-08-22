// js/enhance.js
import { updateMarkdown } from './markdown.js';
import { showToast } from './ui.js';

// --- Enhanced AI - Intelligent Text Enhancement ---
// (Keeping the original logic for now, but structured better)

export async function enhanceText(button) {
    const textarea = button.previousElementSibling;
    // If previous sibling is not textarea, try to find it within a common parent
    // This handles cases where the button might be wrapped or there's whitespace
    const potentialTextarea = button.closest('div, .mb-3')?.querySelector('textarea');
    const targetTextarea = textarea?.tagName === 'TEXTAREA' ? textarea : potentialTextarea;

    if (!targetTextarea) {
        console.error("Enhance button could not find associated textarea.");
        showToast('❌ Could not find text to enhance.');
        return;
    }

    const originalText = targetTextarea.value.trim();
    if (!originalText) {
        showToast('Please enter some text first');
        return;
    }

    // Show loading state
    const originalButtonText = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Enhancing...';
    button.classList.add('loading');

    try {
        // Enhanced version that PRESERVES and IMPROVES the original text
        const enhanced = await intelligentEnhanceText(originalText);
        targetTextarea.value = enhanced;
        updateMarkdown();
        showToast('✨ Text enhanced successfully!');
    } catch (error) {
        showToast('❌ Enhancement failed. Please try again.');
        console.error('Enhancement error:', error);
    } finally {
        // Reset button state
        button.innerHTML = originalButtonText;
        button.classList.remove('loading');
    }
}

async function intelligentEnhanceText(originalText) {
     // Simulate async operation
    // In a real scenario, this would call an AI API
    return await smartLocalEnhancement(originalText);
}

async function smartLocalEnhancement(originalText) {
     // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const analysis = performDeepAnalysis(originalText);
    return generateProfessionalSpecification(analysis, originalText);
}

// --- Placeholder AI Logic (from original, simplified for example) ---
function performDeepAnalysis(text) {
    // --- 1. Extract Core Entities ---
    const entities = {
        sheets: extractSheetEntities(text),
        columns: extractColumnReferences(text),
        operations: identifyPrimaryOperation(text)
    };

    // --- 2. Determine Project Scope ---
    const scope = {
        title: generateProjectTitle(entities.sheets, entities.operations),
        description: generateProjectDescription(text, entities.sheets, entities.operations),
        complexity: assessComplexity(text)
    };

    // --- 3. Model Data Flow ---
    const dataModel = {
        source: analyzeSourceData(text),
        transformations: analyzeDataTransformations(text),
        output: analyzeOutputData(text)
    };

    // --- 4. Identify Technical Needs ---
    const techSpecs = analyzeTechnicalRequirements(text);

    // --- 5. Plan Implementation ---
    const implementation = deriveImplementationPlan(text);

    return {
        entities,
        scope,
        dataModel,
        techSpecs,
        implementation
    };
}

function generateProfessionalSpecification(analysis, originalText) {
    let spec = `**Enhanced Specification:**\n\n`;
    spec += `**Goal:** ${analysis.scope.title}\n`;
    spec += `**Description:** ${analysis.scope.description}\n\n`;
    if (analysis.dataModel.transformations && analysis.dataModel.transformations.length > 0) {
        spec += `**Key Transformations:**\n`;
        analysis.dataModel.transformations.forEach(t => {
            spec += `- ${t.type}: ${t.description || t.method}\n`;
        });
        spec += `\n`;
    }
    if (analysis.techSpecs.performance) {
        spec += `**Performance Considerations:** ${analysis.techSpecs.performance.optimization}\n`;
    }
    return `${originalText}\n\n${spec}`;
}

// --- Helper functions for analysis (simplified stubs) ---
function extractSheetEntities(text) {
    const sheetPattern = /([A-Za-z0-9_\s-]+?)!/g;
    const matches = [...text.matchAll(sheetPattern)];
    const sheets = [...new Set(matches.map(match => match[1].trim()))]; // Unique sheet names
    return sheets;
}
function extractColumnReferences(text) {
    // This is a very basic example. Real implementation would be more robust.
    const columnPattern = /[A-Z]\d+/g;
    const matches = text.match(columnPattern);
    return matches ? [...new Set(matches)] : [];
}
function identifyPrimaryOperation(text) {
    const ops = [
        { name: "Data Splitting", keywords: ['split', 'separate'] },
        { name: "Data Aggregation", keywords: ['sum', 'count', 'average', 'group by'] },
        { name: "Data Validation", keywords: ['validate', 'check', 'ensure'] },
        { name: "Report Generation", keywords: ['report', 'summary'] },
        { name: "Data Copying/Moving", keywords: ['copy', 'move', 'backup'] },
        { name: "Email Notification", keywords: ['email', 'notify'] },
        { name: "Data Lookup", keywords: ['lookup', 'match', 'vlookup'] }
    ];
    let bestMatch = { name: "Data Processing", score: 0 };
    ops.forEach(op => {
        let score = 0;
        op.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            score += (text.match(regex) || []).length;
        });
        if (score > bestMatch.score) {
            bestMatch = { name: op.name, score: score };
        }
    });
    return bestMatch;
}
function generateProjectTitle(sheets, operation) {
    const opName = operation.name;
    if (sheets.length > 0) {
        return `${opName} for ${sheets.slice(0, 2).join(' & ')} Sheet${sheets.length > 1 ? 's' : ''}`;
    }
    return `Automated ${opName}`;
}
function generateProjectDescription(text, sheets, operation) {
     // Simple description based on sheets and primary op
    const sheetPart = sheets.length > 0 ? `on the ${sheets.join(' and ')} sheet${sheets.length > 1 ? 's' : ''}` : '';
    return `This script will perform ${operation.name.toLowerCase()} ${sheetPart}.`;
}
function assessComplexity(text) {
    let score = 0;
    if (/PHASE\s*\d+/gi.test(text)) score += 2;
    if (text.toLowerCase().includes('lookup') || text.toLowerCase().includes('match')) score += 2;
    if (text.toLowerCase().includes('formula')) score += 1;
    if (text.toLowerCase().includes('split')) score += 1;
    const exampleCount = (text.match(/["'][^"']*["']\s*==?>/g) || []).length;
    if (exampleCount >= 3) score += 1;
    const sheets = extractSheetEntities(text);
    if (sheets.length > 1) score += 1;

    if (score >= 5) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
}
function analyzeSourceData(text) { /* ... */ return "Source data analysis placeholder"; }
function analyzeDataTransformations(text) {
    const transformations = [];
    if (text.toLowerCase().includes('split')) {
        const splitDetails = extractSplitTransformation(text);
        if (splitDetails) transformations.push(splitDetails);
    }
    if (text.toLowerCase().includes('formula') || text.toLowerCase().includes('concatenate')) {
        const formulaDetails = extractFormulaTransformation(text);
        if (formulaDetails) transformations.push(formulaDetails);
    }
    return transformations;
}
function analyzeOutputData(text) { /* ... */ return "Output data analysis placeholder"; }
function analyzeTechnicalRequirements(text) {
     const hasLookup = text.toLowerCase().includes('match') || text.toLowerCase().includes('lookup');
     return {
         performance: {
             optimization: hasLookup ? 'Batch operations recommended for lookup efficiency' : 'Standard processing'
         }
     };
}
function deriveImplementationPlan(text) { /* ... */ return { approach: "Implementation plan placeholder" }; }
function extractSplitTransformation(text) {
    const columnPattern = /["']([^"']*(?:Code|Name)[^"']*)["']/gi;
    const outputs = [];
    let match;
    while ((match = columnPattern.exec(text)) !== null) {
        outputs.push(match[1]);
    }
    if (outputs.length >= 2) {
        return {
            type: 'Data Split',
            method: 'Split at delimiter (e.g., space, comma)',
            input: 'Source data string',
            outputs: outputs.slice(0, 2)
        };
    }
    return null;
}
function extractFormulaTransformation(text) {
    const concatPattern = /concatenate[^)]*["']([^"']+)["'][^)]*["']([^"']+)["']/gi;
    const match = concatPattern.exec(text);
    if (match) {
        return {
            type: 'Formula Concatenation',
            inputs: [match[1], match[2]],
            output: 'Combined string result'
        };
    }
    // Add logic for SUM, etc.
    return null;
}
// --- End Helper functions ---