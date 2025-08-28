{
    renderField: function() {
        var css = `
        .cf-wrapper {
            background: #f8fafc;
            border-radius: 10px;
            border: 1.5px solid #d6e0ea;
            padding: 20px 18px 18px 18px;
            margin-bottom: 10px;
            font-family: inherit;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            min-width: 260px;
            position: relative;
        }
        .cf-header-bar {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 10px;
        }
        .cf-add-btn {
            background: #f4f5f7;
            color: #6c6f7a;
            border: 1.5px solid #bfc5ce;
            border-radius: 6px;
            padding: 0.32em 1.1em 0.32em 0.9em;
            font-size: 1em;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 7px;
            box-shadow: none;
            transition: background 0.2s, border 0.2s;
        }
        .cf-add-btn:hover {
            background: #e9ecef;
            border-color: #a0a4ad;
        }
        .cf-add-btn .icon {
            color: #8d8fa3;
            font-size: 1.1em;
        }
        .cf-conditions {
            min-height: 32px;
            padding: 10px 0 0 0;
        }
        .cf-row {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e7ee;
            margin-bottom: 8px;
            padding: 8px 10px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            width: 100%;
            position: relative;
            flex-wrap: wrap;
        }
        .cf-row .cf-value-group {
            display: flex;
            align-items: center;
            position: relative;
            flex: 1 1 120px;
            min-width: 120px;
        }
        .cf-row input[type="text"] {
            border: 1px solid #cfd8dc;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 1em;
            width: 100%;
            min-width: 80px;
            max-width: none;
        }
        .cf-row .cf-value {
            margin-left: 8px;
            margin-right: 8px;
            flex: 1;
        }
        .cf-row .cf-mandatory {
            color: #e05a47;
            font-size: 1.2em;
            margin-right: 4px;
            line-height: 1;
            font-weight: bold;
            user-select: none;
            flex-shrink: 0;
        }
        .cf-row .cf-sample-box {
            flex: 1 1 120px;
            min-width: 80px;
            max-width: 180px;
            margin-left: 8px;
            background: #f4f5f7;
            color: #bfc5ce;
            min-height: 32px;
            border-radius: 4px;
            border: 1px solid #e3e7ee;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            font-size: 1em;
            cursor: not-allowed;
            overflow-x: auto;
            text-align: center;
        }
        .cf-row .cf-template-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 0 8px 0 0;
            padding: 0.5em 1.2em;
            border-radius: 8px;
            font-size: 1em;
            font-weight: 400;
            cursor: pointer;
            border: none;
            background: #e9ecef;
            color: #6c757d;
            opacity: 1;
            transition: background 0.2s, color 0.2s;
            flex: 0 0 auto;
            white-space: nowrap;
            min-width: 120px;
        }
        .cf-row .cf-template-btn:disabled {
            background: #f4f5f7;
            color: #bfc5ce;
            cursor: not-allowed;
            opacity: 0.7;
        }
        .cf-row .cf-template-btn:hover:enabled {
            background: #dee2e6;
            color: #495057;
        }
        .cf-row .cf-icon-btn {
            background: #e9ecef;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            margin-left: 15px;
            transition: background 0.2s;
        }
        .cf-row .cf-icon-btn:hover {
            background: #d6d8db;
        }
        .cf-row .cf-action-buttons {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }
        .cf-row .cf-icon-btn {
            background: #e9ecef;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            margin-left: 0;
            width: 36px;
            height: 36px;
        }
        .cf-row .cf-icon-btn:hover {
            background: #d6d8db;
        }
        .cf-row .cf-icon-btn i {
            font-size: 14px;
            color: #8d929a;
        }
        .cf-row-editor {
            width: 100%;
            background: #f7f7fa;
            border: 1px solid #e3e7ee;
            border-radius: 6px;
            margin: 0 0 8px 0;
            padding: 10px 12px;
            display: none;
        }
        .cf-row-editor.active {
            display: block;
        }
        .cf-ace-editor {
            width: 100%;
            min-height: 120px;
            height: 160px;
            border-radius: 4px;
            border: 1px solid #cfd8dc;
            font-size: 1em;
        }
        .cf-disabled {
            opacity: 0.5;
            pointer-events: none;
        }
        .cf-hidden {
            display: none !important;
        }
        
        /* Responsive breakpoints for better mobile and tablet support */
        @media (max-width: 768px) {
            .cf-row {
                flex-direction: column;
                align-items: stretch;
                gap: 12px;
                padding: 12px;
            }
            .cf-row .cf-value-group {
                flex: 1 1 auto;
                min-width: auto;
            }
            .cf-row .cf-sample-box {
                flex: 1 1 auto;
                min-width: auto;
                margin-left: 0;
                margin-top: 8px;
            }
            .cf-row .cf-template-btn {
                margin: 0;
                margin-top: 8px;
                width: 100%;
                justify-content: center;
            }
            .cf-row .cf-action-buttons {
                align-self: flex-end;
                margin-top: 8px;
            }
        }
        
        @media (max-width: 480px) {
            .cf-wrapper {
                padding: 15px 12px 12px 12px;
                min-width: auto;
            }
            .cf-row {
                padding: 10px;
            }
            .cf-row .cf-template-btn {
                font-size: 0.9em;
                padding: 0.4em 1em;
            }
            .cf-row input[type="text"] {
                font-size: 0.9em;
            }
        }
        
        @media (min-width: 1200px) {
            .cf-row {
                gap: 12px;
                padding: 12px 15px;
            }
            .cf-row .cf-value-group {
                flex: 1 1 150px;
                min-width: 150px;
            }
            .cf-row .cf-sample-box {
                flex: 1 1 150px;
                min-width: 150px;
                max-width: 200px;
            }
            .cf-row .cf-template-btn {
                min-width: 140px;
                font-size: 1.05em;
            }
        }
        `;
        var html = `
        <div class="cf-wrapper" id="cfWrapper">
            <div class="cf-header-bar">
                <button type="button" class="cf-add-btn" id="cfAddConditionBtn"><span class="icon">&#43;</span> Add Condition</button>
            </div>
            <div class="cf-conditions" id="cfConditionsContainer"></div>
        </div>
        `;
        return '<style>' + css + '</style>' + html;
    },
    createRow: function(container) {
        var row = document.createElement('div');
        row.className = 'cf-row';
        row.innerHTML = `
            <div class="cf-value-group">
                <span class="cf-mandatory" aria-label="Required field">*</span>
                <input type="text" class="cf-value" placeholder="Enter value" required aria-label="Condition value" />
            </div>
            <button type="button" class="cf-template-btn" disabled aria-label="Choose template for this condition">
                <span>Choose Template</span>
                <i class="fas fa-hand-pointer"></i>
            </button>
            <div class="cf-sample-box" tabindex="-1" aria-disabled="true" aria-label="Template preview" style="display:flex;align-items:center;justify-content:center;text-align:center;"></div>
            <div class="cf-action-buttons">
                <button type="button" class="cf-icon-btn edit" title="Edit template" aria-label="Edit template">
                    <i class="fas fa-pen"></i>
                </button>
                <button type="button" class="cf-icon-btn delete" title="Delete condition" aria-label="Delete condition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        var editorRow = this.createEditorRow();
        this.bindRowEvents(row, editorRow, container);
        container.appendChild(row);
        container.appendChild(editorRow);
    },
    createEditorRow: function() {
        var editorRow = document.createElement('div');
        editorRow.className = 'cf-row-editor';
        editorRow.innerHTML = '<div class="cf-ace-editor"></div>';
        return editorRow;
    },
    bindRowEvents: function(row, editorRow, container) {
        var self = this;
        var valueInput = row.querySelector('.cf-value');
        var templateBtn = row.querySelector('.cf-template-btn');
        var sampleBox = row.querySelector('.cf-sample-box');
        var editBtn = row.querySelector('.cf-icon-btn.edit');
        var aceDiv = editorRow.querySelector('.cf-ace-editor');
        var aceEditor = null;
        valueInput.addEventListener('input', function() {
            templateBtn.disabled = !valueInput.value.trim();
        });
        templateBtn.addEventListener('click', function() {
            window._cfConditionalSampleBoxToUpdate = sampleBox;
            window._cfConditionalEditorTextareaToUpdate = aceEditor || aceDiv; // fallback to div if not initialized
            
            // Ensure templates are loaded before opening modal
            var templateModal = document.getElementById('templateModal');
            var modalPillTemplates = document.getElementById('modalPillTemplates');
            
            if (templateModal && modalPillTemplates) {
                // Show loading state
                modalPillTemplates.innerHTML = '<div style="text-align:center; padding:20px; color:#6c757d;"><svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style="animation: spin 1s linear infinite; margin-bottom:10px;"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="32" stroke-dashoffset="32"/></svg><br>Loading templates...</div>';
                
                // Add CSS for spinner animation if not already added
                if (!document.getElementById('spinnerStyle')) {
                    var style = document.createElement('style');
                    style.id = 'spinnerStyle';
                    style.textContent = '@keyframes spin { 0%% { transform: rotate(0deg); } 100%% { transform: rotate(360deg); } }';
                    document.head.appendChild(style);
                }
                
                // Show the modal
                templateModal.style.display = 'flex';
                templateModal.style.alignItems = 'center';
                templateModal.style.justifyContent = 'center';
                
                // Load templates from database directly
                var currentUrl = window.location.href;
                var baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/web/console/'));
                var serviceUrl = baseUrl + '/web/json/plugin/org.joget.marketplace.ColumnTemplateFormatter/service?action=getAllTemplates';
                
                fetch(serviceUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('HTTP error! status: ' + response.status);
                    }
                    return response.text().then(function(text) {
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            throw new Error('Invalid JSON response: ' + text);
                        }
                    });
                })
                .then(function(data) {
                    if (data.success && data.templates && data.templates.length > 0) {
                        // Add section header for AI Generated Custom Templates
                        var templatesHtml = '<div style="font-size: 1.1em; font-weight: 700; margin: 16px 0 8px 0; clear: both">AI Generated Custom Templates</div>';
                        
                        // Create HTML for saved templates
                        data.templates.forEach(function(template, index) {
                            templatesHtml += '<div class="pill-option" data-template="saved-' + template.id + '" style="display:inline-block;margin:4px;cursor:pointer;border:2px solid transparent;transition:all 0.2s ease;">';
                            templatesHtml += template.templateHtml;
                            templatesHtml += '</div>';
                        });
                        
                        // Add original templates
                        if (window.allPillTemplates && window.allPillTemplates.length > 0) {
                            templatesHtml += window.allPillTemplates.join('');
                        } else if (window.ColumnTemplateFormatter && window.ColumnTemplateFormatter.templates) {
                            templatesHtml += window.ColumnTemplateFormatter.templates.join('');
                        }
                        
                        modalPillTemplates.innerHTML = templatesHtml;
                        
                        // Store templates for reference
                        window.savedTemplates = data.templates;
                    } else {
                        // No saved templates, show original templates
                        if (window.allPillTemplates && window.allPillTemplates.length > 0) {
                            modalPillTemplates.innerHTML = window.allPillTemplates.join('');
                        } else if (window.ColumnTemplateFormatter && window.ColumnTemplateFormatter.templates) {
                            modalPillTemplates.innerHTML = window.ColumnTemplateFormatter.templates.join('');
                        }
                    }
                })
                .catch(function(error) {
                    console.error('Error loading templates:', error);
                    // Fallback to original templates
                    if (window.allPillTemplates && window.allPillTemplates.length > 0) {
                        modalPillTemplates.innerHTML = window.allPillTemplates.join('');
                    } else if (window.ColumnTemplateFormatter && window.ColumnTemplateFormatter.templates) {
                        modalPillTemplates.innerHTML = window.ColumnTemplateFormatter.templates.join('');
                    }
                });
                
                // Attach conditional formatting specific pill listeners (not the shared ones)
                self.attachConditionalPillListeners();
            } else if (window.ColumnTemplateFormatter && typeof window.ColumnTemplateFormatter.chooseTemplate === 'function') {
                // Fallback to the original method
                window.ColumnTemplateFormatter.chooseTemplate();
            }
        });
        editBtn.addEventListener('click', function() {
            editorRow.classList.toggle('active');
            if (editorRow.classList.contains('active') && window.ace && !aceEditor) {
                aceEditor = window.ace.edit(aceDiv);
                aceEditor.setTheme('ace/theme/chrome');
                aceEditor.session.setMode('ace/mode/html');
                aceEditor.setValue(aceDiv._aceValue || '', -1);
                aceEditor.on('change', function() {
                    aceDiv._aceValue = aceEditor.getValue();
                    // Update the sample box to reflect changes in real-time
                    if (sampleBox) {
                        sampleBox.innerHTML = aceEditor.getValue();
                    }
                    // Update the map when editor content changes
                    self.updateAndSaveMap();
                });
            }
        });
        row.querySelector('.cf-icon-btn.delete').addEventListener('click', function() {
            row.remove();
            editorRow.remove();
            self.updateAndSaveMap();
        });
    },
    updateAndSaveMap: function() {
        window.cfValueTemplateMap = {};
        document.querySelectorAll('.cf-row').forEach(function(row) {
            var input = row.querySelector('.cf-value');
            var sampleBox = row.querySelector('.cf-sample-box');
            var value = input ? input.value.trim() : '';
            var template = sampleBox ? sampleBox.innerHTML : '';
            if (value && template) {
                window.cfValueTemplateMap[value] = template;
            }
        });
        var mapInput = document.querySelector('input[name*="valueTemplateMap"]');
        if (mapInput) {
            mapInput.value = JSON.stringify(window.cfValueTemplateMap);
        } else {
            console.log('Map input not found');
        }
    },
    populateRowsFromMap: function() {
    var mapInput = document.querySelector('input[name*="valueTemplateMap"]');
    var container = document.getElementById('cfConditionsContainer');
    if (!mapInput || !container) return; // Gracefully exit if required elements are missing

    if (mapInput.value && mapInput.value !== 'undefined') {
        try {
            var map = JSON.parse(mapInput.value);
            for (var value in map) {
                if (map.hasOwnProperty(value)) {
                    var row = document.createElement('div');
                    row.className = 'cf-row';
                    row.innerHTML = `
                        <div class="cf-value-group">
                            <span class="cf-mandatory" aria-label="Required field">*</span>
                            <input type="text" class="cf-value" placeholder="Enter value" required value="${value}" aria-label="Condition value" />
                        </div>
                        <button type="button" class="cf-template-btn" aria-label="Choose template for this condition">
                            <span>Choose Template</span>
                            <i class="fas fa-hand-pointer"></i>
                        </button>
                        <div class="cf-sample-box" tabindex="-1" aria-disabled="true" aria-label="Template preview" style="display:flex;align-items:center;justify-content:center;text-align:center;">${map[value]}</div>
                        <div class="cf-action-buttons">
                            <button type="button" class="cf-icon-btn edit" title="Edit template" aria-label="Edit template">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button type="button" class="cf-icon-btn delete" title="Delete condition" aria-label="Delete condition">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    var editorRow = this.createEditorRow();
                    
                    // Store the template content in the ACE editor div for later use
                    var aceDiv = editorRow.querySelector('.cf-ace-editor');
                    if (aceDiv) {
                        aceDiv._aceValue = map[value];
                    }
                    
                    this.bindRowEvents(row, editorRow, container);
                    container.appendChild(row);
                    container.appendChild(editorRow);
                }
            }
        } catch (e) {
            console.error('Failed to parse valueTemplateMap:', e);
        }
    }
},
    attachConditionalPillListeners: function() {
        var self = this;
        if (!window._cfConditionalPillListenersAttached) {
            window._cfConditionalPillListenersAttached = true;
            document.addEventListener('click', function(e) {
                if (e.target && e.target.classList && e.target.classList.contains('pill-option') && e.target.closest('#modalPillTemplates')) {
                    // Only update conditional formatting elements if they are set
                    if (window._cfConditionalSampleBoxToUpdate && window._cfConditionalSampleBoxToUpdate.classList && window._cfConditionalSampleBoxToUpdate.classList.contains('cf-sample-box')) {
                        // Set the template content and ensure it's centered
                        var templateContent = e.target.outerHTML || e.target.textContent || '';
                        window._cfConditionalSampleBoxToUpdate.innerHTML = templateContent;
                        
                        // Ensure centering styles are applied
                        window._cfConditionalSampleBoxToUpdate.style.display = 'flex';
                        window._cfConditionalSampleBoxToUpdate.style.alignItems = 'center';
                        window._cfConditionalSampleBoxToUpdate.style.justifyContent = 'center';
                        window._cfConditionalSampleBoxToUpdate.style.textAlign = 'center';
                        
                        window._cfConditionalSampleBoxToUpdate = null;
                        self.updateAndSaveMap();
                    }
                    if (window._cfConditionalEditorTextareaToUpdate && window._cfConditionalEditorTextareaToUpdate.classList && window._cfConditionalEditorTextareaToUpdate.classList.contains('cf-ace-editor')) {
                        if (window._cfConditionalEditorTextareaToUpdate.env && window._cfConditionalEditorTextareaToUpdate.setValue) {
                            window._cfConditionalEditorTextareaToUpdate.setValue(e.target.outerHTML || e.target.textContent || '', -1);
                        } else if (window._cfConditionalEditorTextareaToUpdate.tagName === 'DIV') {
                            window._cfConditionalEditorTextareaToUpdate._aceValue = e.target.outerHTML || e.target.textContent || '';
                        } else {
                            window._cfConditionalEditorTextareaToUpdate.value = e.target.outerHTML || e.target.textContent || '';
                        }
                        window._cfConditionalEditorTextareaToUpdate = null;
                    }
                    
                    // Close the modal after template selection
                    var templateModal = document.getElementById('templateModal');
                    if (templateModal) {
                        templateModal.style.display = 'none';
                    }
                }
            }, true);
        }
    },
    initScripting: function() {
        var addBtn = document.getElementById('cfAddConditionBtn');
        var container = document.getElementById('cfConditionsContainer');
        if (addBtn && container) {
            addBtn.addEventListener('click', this.createRow.bind(this, container));
        }
        this.populateRowsFromMap();
        this.attachConditionalPillListeners();
        this.setupConditionalFormattingToggle();
    },
    
    setupConditionalFormattingToggle: function() {
        var self = this;
        // Find the conditional formatting checkbox - try multiple selectors
        var checkbox = document.querySelector('input[name="useConditionalFormatting"]') || 
                      document.querySelector('input[type="checkbox"][name*="useConditionalFormatting"]') ||
                      document.querySelector('input[type="checkbox"]');
        var cfWrapper = document.getElementById('cfWrapper');
        
        if (checkbox && cfWrapper) {
            // Set initial state - hide by default if checkbox is not checked
            var isChecked = checkbox.checked;
            this.toggleConditionalFormatting(isChecked, cfWrapper);
            
            // Add change listener
            checkbox.addEventListener('change', function() {
                self.toggleConditionalFormatting(this.checked, cfWrapper);
            });
        } else if (cfWrapper) {
            // If no checkbox found, hide the section by default
            this.toggleConditionalFormatting(false, cfWrapper);
        }
    },
    
    toggleConditionalFormatting: function(enabled, cfWrapper) {
        // Find all conditional formatting headers (both the JSON header and any other headers)
        var cfHeaders = document.querySelectorAll('h3, .form-row, [class*="header"]');
        var conditionalFormattingHeaders = [];
        
        cfHeaders.forEach(function(header) {
            if (header.textContent && header.textContent.includes('Conditional Formatting')) {
                conditionalFormattingHeaders.push(header);
            }
        });
        
        // Hide/show all conditional formatting headers
        conditionalFormattingHeaders.forEach(function(header) {
            if (enabled) {
                header.style.display = '';
                cfWrapper.classList.remove('cf-hidden');
            } else {
                header.style.display = 'none';
                cfWrapper.classList.add('cf-hidden');
            }
        });
        
        // If no headers found, just toggle the wrapper
        if (conditionalFormattingHeaders.length === 0) {
            if (enabled) {
                cfWrapper.classList.remove('cf-hidden');
            } else {
                cfWrapper.classList.add('cf-hidden');
            }
        }
    }
}

