{
    templates: [%s],

    renderField: function() {
       var html = "";
       html += "<button id='chooseTemplateBtn' type='button' class='ctp-btn' style=\"display:inline-flex;margin:0 8px 0 0;padding:0.5em 1.5em;border-radius:8px;font-size:1.1em;font-weight:400;cursor:pointer;border:none;background:#e9ecef;color:#6c757d;opacity:1;align-items:center;gap:8px;min-width:140px;justify-content:center;\">Choose Template <i class='fas fa-hand-pointer'></i></button>";
       html += "<button id='editTemplateBtn' type='button' class='ctp-btn ctp-btn-outline' style=\"display:inline-flex;margin:0 8px 0 0;padding:0.5em 1.5em;border-radius:8px;font-size:1.1em;font-weight:400;cursor:pointer;border:none;background:#e9ecef;color:#6c757d;opacity:1;align-items:center;gap:8px;min-width:140px;justify-content:center;\">Edit Template <i class='fas fa-pen'></i> </button>";
       html += "<div id='pillTemplates'></div>";
       html += "<div id='templateModal' style='display:none; position:fixed; z-index:9999; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); align-items:center; justify-content:center;'>";
       html += "<div id='templateModalContent' style='background:#fff; border-radius:12px; width:50vw; max-width:50vw; padding:32px 24px 24px 24px; position:relative; box-shadow:0 8px 32px rgba(0,0,0,0.18); max-height:80vh; overflow-y:auto; display:block;'>";
       html += "<button id='closeTemplateModal' style='position:sticky; top:8px; right:8px; float:right; font-size:24px; background:none; border:none; color:#888; z-index:10001; padding:4px; cursor:pointer;'>&times;</button>";
       html += "<div style='margin-bottom:18px; margin-top:8px; display:flex; justify-content:space-between; align-items:center;'>";
       html += "<div style='font-size:1.3em; font-weight:600;'>Choose a Template</div>";
       html += "<button id='addTemplateUsingAiBtn' type='button' style='display:inline-flex; margin-top:8px; padding:0.5em 1.5em; border-radius:8px; font-size:1.1em; font-weight:400; cursor:pointer; border:none; background:#e9ecef; color:#6c757d; opacity:1; align-items:center; gap:8px; min-width:180px; justify-content:center; margin-right:30px;'>";
       html += "Add Template Using AI</button>";
       html += "</div>";
       html += "<div id='aiTemplateSection' style='display:none; margin-top:40px; margin-bottom:24px; padding:16px; border:1px solid #e9ecef; border-radius:8px;'>";
       html += "<div style='margin-bottom:16px; font-size:1.1em; font-weight:600; color:#333;'>Generate Template</div>";
       html += "<textarea id='aiTemplateInput' placeholder='Enter your prompt here...' style='width:100%%; min-height:100px; margin-top:12px; padding:10px; border-radius:6px; border:1px solid #ccc; font-size:1em;'></textarea>";
       html += "<div style='text-align:center; margin-top:16px;'>";
       html += "<button id='submitAiTemplateBtn' type='button' style='display:inline-flex; padding:0.5em 1.5em; border-radius:8px; font-size:1.1em; font-weight:400; cursor:pointer; border:none; background:#e9ecef; color:#6c757d; opacity:1; align-items:center; gap:8px; min-width:160px; justify-content:center;'>";
       html += "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M15.854.146a.5.5 0 0 0-.525-.116l-15 6a.5.5 0 0 0 .042.934l6.352 1.95 1.95 6.352a.5.5 0 0 0 .934.042l6-15a.5.5 0 0 0-.116-.525zM6.832 8.268l6.401-4.267-5.117 5.117a.5.5 0 0 0-.115.196l-1.17 3.513-.988-3.217a.5.5 0 0 0-.33-.33L2.296 8.15l3.513-1.17a.5.5 0 0 0 .196-.115z'/></svg>";
       html += "Submit";
       html += "</button></div>";
       html += "</div>";
       html += "<div id='modalPillTemplates'></div>";
       html += "</div></div>";
       html += "</div></div>";
       return html;
   },

    chooseTemplate: function() {
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
            
            templateModal.style.display = 'flex';
            templateModal.style.alignItems = 'center';
            templateModal.style.justifyContent = 'center';
            
            // Call the getAllTemplates endpoint
            this.loadTemplatesFromDatabase();
        }
    },

    // Minimal cross-editor helpers (ACE / Monaco / CodeMirror / textarea)
    _getEditorEl: function() {
        return document.querySelector('.ace_editor') || document.querySelector('.monaco-editor') || document.querySelector('.CodeMirror') || document.querySelector('textarea[name*="templateEditor"], textarea[name*="_templateEditor"]');
    },
    getEditorContainer: function() {
        var el = this._getEditorEl();
        if (!el) return null;
        return el.closest('.form-row') || el.closest('.form-group') || el;
    },
    setEditorValue: function(html) {
        var el = document.querySelector('.ace_editor');
        if (el && window.ace) { try { window.ace.edit(el).setValue(html, -1); return; } catch(e){} }
        var cm = document.querySelector('.CodeMirror');
        if (cm && cm.CodeMirror) { try { cm.CodeMirror.setValue(html); return; } catch(e){} }
        if (window.monaco && window.monaco.editor && typeof window.monaco.editor.getModels === 'function') {
            var models = window.monaco.editor.getModels();
            if (models && models[0]) { try { models[0].setValue(html); return; } catch(e){} }
        }
        var ta = document.querySelector('textarea[name*="templateEditor"], textarea[name*="_templateEditor"]');
        if (ta) { ta.value = html; try { ta.dispatchEvent(new Event('change', {bubbles:true})); } catch(e){} }
    },
    getEditorValue: function() {
        var el = document.querySelector('.ace_editor');
        if (el && window.ace) { try { return window.ace.edit(el).getValue(); } catch(e){} }
        var cm = document.querySelector('.CodeMirror');
        if (cm && cm.CodeMirror) { try { return cm.CodeMirror.getValue(); } catch(e){} }
        if (window.monaco && window.monaco.editor && typeof window.monaco.editor.getModels === 'function') {
            var models = window.monaco.editor.getModels();
            if (models && models[0]) { try { return models[0].getValue(); } catch(e){} }
        }
        var ta = document.querySelector('textarea[name*="templateEditor"], textarea[name*="_templateEditor"]');
        return ta ? ta.value : null;
    },
    onEditorChange: function(cb) {
        // ACE
        var el = document.querySelector('.ace_editor');
        if (el && window.ace) { try { window.ace.edit(el).on('change', function(){ cb(ColumnTemplateFormatter.getEditorValue()); }); return; } catch(e){} }
        // CodeMirror
        var cm = document.querySelector('.CodeMirror');
        if (cm && cm.CodeMirror) { try { cm.CodeMirror.on('change', function(i){ cb(i.getValue()); }); return; } catch(e){} }
        // Monaco
        if (window.monaco && window.monaco.editor && typeof window.monaco.editor.getModels === 'function') {
            var models = window.monaco.editor.getModels();
            if (models && models[0] && models[0].onDidChangeContent) { try { models[0].onDidChangeContent(function(){ cb(models[0].getValue()); }); return; } catch(e){} }
        }
        // Textarea
        var ta = document.querySelector('textarea[name*="templateEditor"], textarea[name*="_templateEditor"]');
        if (ta) {
            var h = function(){ cb(ta.value); };
            ta.addEventListener('input', h); ta.addEventListener('change', h);
        }
    },
    
    toggleAiSection: function() {
        var aiSection = document.getElementById('aiTemplateSection');
        var aiButton = document.getElementById('addTemplateUsingAiBtn');
        if (aiSection) {
            var isVisible = aiSection.style.display !== 'none';
            if (isVisible) {
                aiSection.style.display = 'none';
                if (aiButton) {
                    aiButton.textContent = 'Add Template Using AI';
                }
            } else {
                aiSection.style.display = 'block';
                if (aiButton) {
                    aiButton.textContent = 'Hide AI Section';
                }
            }
        }
    },
    
    hideAiSection: function() {
        var aiSection = document.getElementById('aiTemplateSection');
        if (aiSection) {
            aiSection.style.display = 'none';
        }
        
        // Update button label back to "Add Template Using AI"
        var aiButton = document.getElementById('addTemplateUsingAiBtn');
        if (aiButton) {
            aiButton.textContent = 'Add Template Using AI';
        }
        
        // Also clear the AI template input
        var aiInput = document.getElementById('aiTemplateInput');
        if (aiInput) {
            aiInput.value = '';
        }
        
        // Remove any generated content
        var aiSampleBox = document.getElementById('aiSampleBoxContent');
        if (aiSampleBox) {
            aiSampleBox.remove();
        }
        
        var aceEditorContainer = document.getElementById('aiAceEditorContainer');
        if (aceEditorContainer) {
            aceEditorContainer.remove();
        }
        
        var saveBtn = document.getElementById('saveAiTemplateBtn');
        if (saveBtn) {
            saveBtn.remove();
        }
        
        // Clear stored template
        window.aiGeneratedTemplate = null;
        
        // Reset saving flag
        window.isSavingTemplate = false;
    },
    
    loadTemplatesFromDatabase: function() {
        var self = this;
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
            var modalPillTemplates = document.getElementById('modalPillTemplates');
            
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
                templatesHtml += (self.templates || []).join('');
                
                modalPillTemplates.innerHTML = templatesHtml;
                
                // Attach listeners
                if (window.SampleBoxAttachPillListeners) {
                    window.SampleBoxAttachPillListeners();
                } else {
                    self.attachFallbackPillListeners();
                }
                
                // Store templates for reference
                window.savedTemplates = data.templates;
                
            } else {
                // No saved templates, show original templates
                modalPillTemplates.innerHTML = (self.templates || []).join('');
                
                if (window.SampleBoxAttachPillListeners) {
                    window.SampleBoxAttachPillListeners();
                } else {
                    self.attachFallbackPillListeners();
                }
            }
        })
        .catch(function(error) {
            var modalPillTemplates = document.getElementById('modalPillTemplates');
            modalPillTemplates.innerHTML = '<div style="text-align:center; padding:20px; color:#dc3545;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style="margin-bottom:10px;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg><br>Error loading templates<br><small>' + error.message + '</small></div>';
        });
    },
    
    refreshTemplatesSection: function() {
        // Check if the modal is currently open
        var templateModal = document.getElementById('templateModal');
        if (templateModal && templateModal.style.display !== 'none') {
            // Modal is open, refresh the templates
            this.loadTemplatesFromDatabase();
        }
    },
    
    showAiSampleBox: function() {
        var userPrompt = document.getElementById('aiTemplateInput').value.trim();
        
        if (!userPrompt) {
            alert('Please enter a prompt first');
            return;
        }
        
        // Get AI configuration values from the form fields using wildcard patterns
        var modelField = document.querySelector('input[name*="_model"]');
        var apiKeyField = document.querySelector('input[name*="_apiKey"]');
        var proxyDomainField = document.querySelector('input[name*="_proxyDomain"]');
        
        var model = modelField ? modelField.value.trim() : '';
        var apiKey = apiKeyField ? apiKeyField.value.trim() : '';
        var proxyDomain = proxyDomainField ? proxyDomainField.value.trim() : '';
        
        // Validate API key
        if (!apiKey) {
            alert('API Key is required. Please configure it in the AI settings.');
            return;
        }
        
        // Show loading state with spinner
        var submitBtn = document.getElementById('submitAiTemplateBtn');
        var originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="animation: spin 1s linear infinite;"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="32" stroke-dashoffset="32"/></svg> Generating...';
        submitBtn.disabled = true;
        
        // Add CSS for spinner animation
        if (!document.getElementById('spinnerStyle')) {
            var style = document.createElement('style');
            style.id = 'spinnerStyle';
            style.textContent = '@keyframes spin { 0%% { transform: rotate(0deg); } 100%% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
        
        // Call the web service with configuration parameters
        var self = this;
        var currentUrl = window.location.href;
        var baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/web/console/'));
        var serviceUrl = baseUrl + '/web/json/plugin/org.joget.marketplace.ColumnTemplateFormatter/service?action=generateAiTemplate&prompt=' + encodeURIComponent(userPrompt) + '&model=' + encodeURIComponent(model) + '&apiKey=' + encodeURIComponent(apiKey) + '&proxyDomain=' + encodeURIComponent(proxyDomain);
        
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
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (data.error) {
                alert('Error: ' + data.error);
                return;
            }
            
            self.displayAiGeneratedTemplate(data.template);
        })
        .catch(function(error) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('Error generating template: ' + error.message);
        });
    },
    
    displayAiGeneratedTemplate: function(templateHtml) {
        var aiSection = document.getElementById('aiTemplateSection');
        var existingSampleBox = document.getElementById('aiSampleBoxContent');
        
        // Remove existing sample box if it exists
        if (existingSampleBox) {
            existingSampleBox.remove();
        }
        
        // Remove existing ACE editor if it exists
        var existingAceEditor = document.getElementById('aiAceEditorContainer');
        if (existingAceEditor) {
            existingAceEditor.remove();
        }
        
        // Remove existing Save Template button if it exists
        var existingSaveBtn = document.getElementById('saveAiTemplateBtn');
        if (existingSaveBtn) {
            existingSaveBtn.remove();
        }
        
        // Create new sample box with edit button
        var sampleBoxHtml = "<div id='aiSampleBoxContent' style='border:1.5px solid #d6e0ea; border-radius:12px; background:#f7fbff; padding:24px 16px; min-height:60px; font-size:1.08em; display:flex; align-items:center; justify-content:center; margin-top:16px; position:relative;'>";
        sampleBoxHtml += "<span id='aiSampleBoxPill' style='display:inline-block;border-radius:999px;padding:1.0em 2.5em;font-size:1em;font-weight:600;font-style:italic;min-width:80px;min-height:1.6em;text-align:center;margin-top:10px;margin-bottom:10px;box-sizing:border-box;background:#d4edda;color:#155724;'>AI Generated Template</span>";
        sampleBoxHtml += "<button id='aiEditBtn' type='button' style='position:absolute; top:8px; right:8px; background:none; border:none; color:#6c757d; cursor:pointer; padding:4px; border-radius:4px;' title='Edit Template'>";
        sampleBoxHtml += "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>";
        sampleBoxHtml += "<path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-3 1a.5.5 0 0 1-.55-.55l1-3a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/>";
        sampleBoxHtml += "</svg>";
        sampleBoxHtml += "</button>";
        sampleBoxHtml += "</div>";
        
        // Add Save Template button that's always visible
        sampleBoxHtml += '<div style="text-align:center; margin-top:16px;">';
        sampleBoxHtml += '<button id="saveAiTemplateBtn" type="button" style="display:inline-flex; padding:0.5em 1.5em; border-radius:8px; font-size:1.1em; font-weight:400; cursor:pointer; border:none; background:#e9ecef; color:#6c757d; opacity:1; align-items:center; gap:8px; min-width:160px; justify-content:center;">';
        sampleBoxHtml += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 1-1-1H2zm6.5 11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h3.5zM9.5 2H2v12h12V2H9.5z"/><path d="M6.646 7.646a.5.5 0 1 1 .708.708L5.707 10l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2z"/></svg>';
        sampleBoxHtml += 'Save Template';
        sampleBoxHtml += '</button></div>';
        
        // Insert the sample box after the submit button
        var submitButton = document.getElementById('submitAiTemplateBtn');
        if (submitButton && aiSection) {
            var submitButtonContainer = submitButton.closest('div');
            if (submitButtonContainer) {
                submitButtonContainer.insertAdjacentHTML('afterend', sampleBoxHtml);
                
                // Update the sample box with AI generated template
                var sampleBoxPill = document.getElementById('aiSampleBoxPill');
                if (sampleBoxPill) {
                    // Create a temporary div to parse the HTML
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = templateHtml;
                    var spanElement = tempDiv.querySelector('span') || tempDiv.querySelector('div');
                    if (spanElement) {
                        sampleBoxPill.innerHTML = spanElement.innerHTML;
                        sampleBoxPill.setAttribute('style', spanElement.getAttribute('style'));
                    }
                }
                
                // Add event listener to the edit button
                var editBtn = document.getElementById('aiEditBtn');
                if (editBtn) {
                    editBtn.addEventListener('click', this.toggleAiAceEditor.bind(this));
                }
                
                // Store the template for ACE editor
                window.aiGeneratedTemplate = templateHtml;
            }
        }
    },
    
    toggleAiAceEditor: function() {
        var aceEditorContainer = document.getElementById('aiAceEditorContainer');
        var editBtn = document.getElementById('aiEditBtn');
        
        if (aceEditorContainer) {
            // ACE editor exists, hide it
            aceEditorContainer.remove();
            if (editBtn) {
                editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-3 1a.5.5 0 0 1-.55-.55l1-3a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>';
                editBtn.title = 'Edit Template';
            }
        } else {
            // Create ACE editor
            var aceEditorHtml = '<div id="aiAceEditorContainer" style="margin-top:16px; border:1px solid #ddd; border-radius:6px; height:200px; background:#f8f9fa;">';
            aceEditorHtml += '<div id="aiAceEditor" style="width:100%%; height:100%%;"></div>';
            aceEditorHtml += '</div>';
            
            var sampleBox = document.getElementById('aiSampleBoxContent');
            if (sampleBox) {
                sampleBox.insertAdjacentHTML('afterend', aceEditorHtml);
                
                // Initialize ACE editor
                setTimeout(function() {
                    if (window.ace && document.getElementById('aiAceEditor')) {
                        var editor = window.ace.edit('aiAceEditor');
                        editor.setTheme('ace/theme/chrome');
                        editor.session.setMode('ace/mode/html');
                        var templateToShow = window.aiGeneratedTemplate || '<span style="display:inline-block;border-radius:999px;padding:1.0em 2.5em;font-size:1em;font-weight:600;font-style:italic;min-width:80px;min-height:1.6em;text-align:center;margin-top:10px;margin-bottom:10px;box-sizing:border-box;background:#d4edda;color:#155724;">AI Generated Template</span>';
                        editor.setValue(templateToShow, -1);
                        editor.resize();
                        
                        // Add change listener to sync with AI sample box
                        editor.on('change', function() {
                            var templateCode = editor.getValue();
                            var aiSampleBoxPill = document.getElementById('aiSampleBoxPill');
                            if (aiSampleBoxPill) {
                                var tempDiv = document.createElement('div');
                                tempDiv.innerHTML = templateCode;
                                var spanElement = tempDiv.querySelector('span') || tempDiv.querySelector('div');
                                if (spanElement) {
                                    aiSampleBoxPill.innerHTML = spanElement.innerHTML;
                                    aiSampleBoxPill.setAttribute('style', spanElement.getAttribute('style'));
                                }
                            }
                        });
                    }
                }, 100);
            }
            
            // Change button to show "Hide"
            if (editBtn) {
                editBtn.innerHTML = 'Hide';
                editBtn.title = 'Hide Editor';
            }
        }
    },
    
    saveAiTemplate: function() {
        // Prevent multiple simultaneous saves
        if (window.isSavingTemplate) {
            return;
        }
        window.isSavingTemplate = true;
        
        var templateCode = '';

        // Try to get template from ACE editor first
        var aceEditor = document.getElementById('aiAceEditor');
        if (aceEditor && window.ace) {
            var editor = window.ace.edit(aceEditor);
            templateCode = editor.getValue().trim();
        } else {
            // If no ACE editor, get template from the sample box or stored template
            if (window.aiGeneratedTemplate) {
                templateCode = window.aiGeneratedTemplate;
            } else {
                this.showNotification('No template to save! Please generate a template first.', 'error');
                return;
            }
        }

        // Validate HTML template
        if (!this.isValidHtmlTemplate(templateCode)) {
            this.showNotification('Invalid HTML template! Please ensure you have a valid HTML element (span or div) with proper styling.', 'error');
            return;
        }

        // Update the sample box with the new template
        var sampleBoxPill = document.getElementById('aiSampleBoxPill');
        if (sampleBoxPill) {
            // Create a temporary div to parse the HTML
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = templateCode;
            var spanElement = tempDiv.querySelector('span');
            if (spanElement) {
                sampleBoxPill.innerHTML = spanElement.innerHTML;
                sampleBoxPill.setAttribute('style', spanElement.getAttribute('style'));
            }
        }

        // Show loading state with spinner
        var saveBtn = document.getElementById('saveAiTemplateBtn');
        var originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="animation: spin 1s linear infinite;"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="32" stroke-dashoffset="32"/></svg> Saving...';
        saveBtn.disabled = true;

        // Add CSS for spinner animation if not already added
        if (!document.getElementById('spinnerStyle')) {
            var style = document.createElement('style');
            style.id = 'spinnerStyle';
            style.textContent = '@keyframes spin { 0%% { transform: rotate(0deg); } 100%% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }

        // Call the Java saveTemplate method
        var currentUrl = window.location.href;
        var baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/web/console/'));
        var serviceUrl = baseUrl + '/web/json/plugin/org.joget.marketplace.ColumnTemplateFormatter/service?action=saveTemplate&template=' + encodeURIComponent(templateCode);

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
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
            window.isSavingTemplate = false;
            
            if (data.error) {
                this.showNotification('Error saving template: ' + data.error, 'error');
            } else if (data.success === false) {
                this.showNotification(data.message || 'Failed to save template to database', 'error');
            } else {
                this.showNotification('Template saved successfully to database!', 'success');
                // Hide AI section after successful save
                this.hideAiSection();
                // Refresh the templates section to show the newly saved template
                this.refreshTemplatesSection();
            }
        }.bind(this))
        .catch(function(error) {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
            window.isSavingTemplate = false;
            this.showNotification('Error saving template: ' + error.message, 'error');
        }.bind(this));
    },
    
    showNotification: function(message, type) {
        // Remove existing notification if any
        var existingNotification = document.getElementById('customNotification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        var notification = document.createElement('div');
        notification.id = 'customNotification';
        
        // Set styles based on type
        var backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        var color = type === 'success' ? '#155724' : '#721c24';
        var borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
        
        notification.style.cssText = 
            'position: fixed;' +
            'top: 20px;' +
            'right: 20px;' +
            'padding: 16px 20px;' +
            'border-radius: 8px;' +
            'background-color: ' + backgroundColor + ';' +
            'color: ' + color + ';' +
            'border: 1px solid ' + borderColor + ';' +
            'box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
            'z-index: 10000;' +
            'font-size: 14px;' +
            'font-weight: 500;' +
            'max-width: 400px;' +
            'word-wrap: break-word;' +
            'animation: slideIn 0.3s ease-out;';
        
        // Add icon based on type
        var icon = type === 'success' ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 8px; vertical-align: middle;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 8px; vertical-align: middle;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>';
        
        notification.innerHTML = icon + message;
        
        // Add CSS animation if not already added
        if (!document.getElementById('notificationStyle')) {
            var style = document.createElement('style');
            style.id = 'notificationStyle';
            style.textContent = 
                '@keyframes slideIn {' +
                '    from {' +
                '        transform: translateX(100%%);' +
                '        opacity: 0;' +
                '    }' +
                '    to {' +
                '        transform: translateX(0);' +
                '        opacity: 1;' +
                '    }' +
                '}' +
                '@keyframes slideOut {' +
                '    from {' +
                '        transform: translateX(0);' +
                '        opacity: 1;' +
                '    }' +
                '    to {' +
                '        transform: translateX(100%%);' +
                '        opacity: 0;' +
                '    }' +
                '}';
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(function() {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    },

    isValidHtmlTemplate: function(htmlCode) {
        // Check if code is empty
        if (!htmlCode || htmlCode.trim() === '') {
            return false;
        }
        
        // Check if it contains basic HTML structure
        if (!htmlCode.includes('<') || !htmlCode.includes('>')) {
            return false;
        }
        
        // Check if it contains a span or div element
        if (!htmlCode.includes('<span') && !htmlCode.includes('<div')) {
            return false;
        }
        
        // Check if it has proper closing tags
        if ((htmlCode.includes('<span') && !htmlCode.includes('</span>')) ||
            (htmlCode.includes('<div') && !htmlCode.includes('</div>'))) {
            return false;
        }
        
        // Check if it has style attribute (for proper formatting)
        if (!htmlCode.includes('style=')) {
            return false;
        }
        
        // Try to parse as HTML to check for syntax errors
        try {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlCode;
            
            // Check if we can find a span or div element
            var spanElement = tempDiv.querySelector('span');
            var divElement = tempDiv.querySelector('div');
            
            if (!spanElement && !divElement) {
                return false;
            }
            
            // Check if the element has some content
            var element = spanElement || divElement;
            if (!element.textContent || element.textContent.trim() === '') {
                return false;
            }
            
            return true;
        } catch (e) {
            return false;
        }
    },
    
    attachFallbackPillListeners: function () {
        const pillOptions = document.querySelectorAll('#modalPillTemplates .pill-option');
        const self = this;

        pillOptions.forEach(function (option) {
            option.onclick = function () {
                const selected = this.getAttribute('data-template');

                if (selected && selected.startsWith('saved-')) {
                    // Handle saved templates
                    const templateId = selected.replace('saved-', '');
                    const savedTemplate = window.savedTemplates?.find(t => t.id === templateId);

                    if (savedTemplate) {
                        const pill = document.getElementById('sampleBoxPill');
                        if (pill) {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = savedTemplate.templateHtml;
                            const contentElement = tempDiv.querySelector('span') || tempDiv.querySelector('div');

                            if (contentElement) {
                                pill.innerHTML = contentElement.innerHTML;
                                pill.setAttribute(
                                    'style',
                                    (contentElement.getAttribute('style') || '') +
                                        ';display:flex;align-items:center;justify-content:center;'
                                );
                            }
                        }

                        // Populate whichever editor is present (ACE/Monaco/CodeMirror/textarea)
                        self.setEditorValue(savedTemplate.templateHtml);
                    }
                } else {
                    // Handle original (DOM-based) templates
                    const pill = document.getElementById('sampleBoxPill');
                    if (pill) {
                        pill.innerHTML = this.innerHTML;
                        pill.setAttribute(
                            'style',
                            this.getAttribute('style') +
                                ';display:flex;align-items:center;justify-content:center;'
                        );
                    }

                    const templateCode = `<span style="${this.getAttribute('style')}">${this.innerHTML}</span>`;
                    self.setEditorValue(templateCode);
                }

                // Close the modal
                const templateModal = document.getElementById('templateModal');
                if (templateModal) templateModal.style.display = 'none';
            };
        });
    },

    editTemplate: function() {
        var editBtn = document.getElementById('editTemplateBtn');
        var container = this.getEditorContainer();
        if (!container) return;
        var isHidden = container.style.display === 'none' || window.getComputedStyle(container).display === 'none';
        container.style.display = isHidden ? 'block' : 'none';
        if (editBtn) editBtn.innerHTML = isHidden ? 'Hide Template <i class="fas fa-ban"></i>' : 'Edit Template <i class="fas fa-pen"></i>';
    },

    closeTemplateModal: function() {
        var templateModal = document.getElementById('templateModal');
        if (templateModal) {
            templateModal.style.display = 'none';
            templateModal.style.alignItems = '';
            templateModal.style.justifyContent = '';
        }
        // Hide AI section when modal is closed
        this.hideAiSection();
    },

    initScripting: function() {
        var chooseBtn = document.getElementById('chooseTemplateBtn');
        var editBtn = document.getElementById('editTemplateBtn');
        var closeTemplateModalBtn = document.getElementById('closeTemplateModal');
        var templateModal = document.getElementById('templateModal');
        var modalPillTemplates = document.getElementById('modalPillTemplates');

        // Make the ColumnTemplateFormatter object globally available for other components
        window.ColumnTemplateFormatter = this;


        
        // Hide editor on load, then wire preview sync (works for ACE/DX8 and Monaco/CodeMirror/DX9)
        setTimeout(function() {
            var container = this.getEditorContainer();
            if (container) container.style.display = 'none';
            this.initializeSampleBoxWithExistingTemplate();
            this.onEditorChange(function(templateCode){
                var sampleBoxPill = document.getElementById('sampleBoxPill');
                if (sampleBoxPill) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = templateCode || '';
                    var spanElement = tempDiv.querySelector('span') || tempDiv.querySelector('div');
                    if (spanElement) {
                        sampleBoxPill.innerHTML = spanElement.innerHTML;
                        sampleBoxPill.setAttribute('style', spanElement.getAttribute('style'));
                    }
                }
            }.bind(this));
        }.bind(this), 100);

        if (chooseBtn) {
            chooseBtn.addEventListener('click', this.chooseTemplate.bind(this));
        }
        if (editBtn) {
            editBtn.addEventListener('click', this.editTemplate.bind(this));
        }
        if (closeTemplateModalBtn) {
            closeTemplateModalBtn.addEventListener('click', this.closeTemplateModal.bind(this));
        }
        var addTemplateUsingAiBtn = document.getElementById('addTemplateUsingAiBtn');
        if (addTemplateUsingAiBtn) {
            addTemplateUsingAiBtn.addEventListener('click', this.toggleAiSection.bind(this));
        }
        
        var submitAiTemplateBtn = document.getElementById('submitAiTemplateBtn');
        if (submitAiTemplateBtn) {
            submitAiTemplateBtn.addEventListener('click', this.showAiSampleBox.bind(this));
        }
        
        // Add event listener for save button using event delegation
        // This will work for dynamically created buttons
        // Use a flag to prevent multiple event listeners
        if (!window.saveAiTemplateListenerAdded) {
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'saveAiTemplateBtn') {
                    // Prevent multiple rapid clicks
                    if (e.target.disabled) {
                        return;
                    }
                this.saveAiTemplate();
            }
        }.bind(this));
            window.saveAiTemplateListenerAdded = true;
        }
        
        // Expose helpers for other components
        window.CTF_setEditorValue = this.setEditorValue.bind(this);
        window.CTF_getEditorValue = this.getEditorValue.bind(this);
        window.CTF_onEditorChange = this.onEditorChange.bind(this);

        // Initialize AI button visibility based on checkbox state
        this.updateAiButtonVisibility();
        
        // Add event listener for checkbox changes
        document.addEventListener('change', function(e) {
            if (e.target && e.target.type === 'checkbox' && e.target.id && e.target.id.includes('useAiTemplateGeneration')) {
                this.updateAiButtonVisibility();
            }
        }.bind(this));
    },

    updateAiButtonVisibility: function() {
        var checkbox = document.querySelector('input[type="checkbox"][id*="useAiTemplateGeneration"]');
        var addTemplateUsingAiBtn = document.getElementById('addTemplateUsingAiBtn');
        
        if (addTemplateUsingAiBtn) {
            if (checkbox && checkbox.checked) {
            // Show the button when checkbox is unchecked or not found
             addTemplateUsingAiBtn.style.display = 'inline-flex';
            } else {
                // Hide the button when checkbox is checked
             addTemplateUsingAiBtn.style.display = 'none';
            }
        }
    },

    initializeSampleBoxWithExistingTemplate: function() {
        var code = this.getEditorValue() || '';
        var pill = document.getElementById('sampleBoxPill');
        if (!pill) return;

        // Try to extract selected key first
        var match = code.match(/data-template=["']([^"']+)["']/);
        var initialSelected = match ? match[1] : null;

        // If actual HTML exists, prefer rendering it directly
        var hasHtml = code && (code.includes('<span') || code.includes('<div'));
        if (hasHtml) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = code;
            var spanElement = tempDiv.querySelector('span') || tempDiv.querySelector('div');
            if (spanElement) {
                pill.innerHTML = spanElement.innerHTML;
                pill.setAttribute('style', (spanElement.getAttribute('style') || '') + ';display:flex;align-items:center;justify-content:center;');
                return;
            }
        }

        // Otherwise, fall back to matching by data-template if available
        if (initialSelected) {
            if (initialSelected.startsWith('saved-')) {
                var templateId = initialSelected.replace('saved-', '');
                var savedTemplate = window.savedTemplates ? window.savedTemplates.find(function(t){ return t.id === templateId; }) : null;
                if (savedTemplate) {
                    var t = document.createElement('div');
                    t.innerHTML = savedTemplate.templateHtml;
                    var el = t.querySelector('span') || t.querySelector('div');
                    if (el) {
                        pill.innerHTML = el.innerHTML;
                        pill.setAttribute('style', (el.getAttribute('style') || '') + ';display:flex;align-items:center;justify-content:center;');
                    }
                    return;
                }
            }
            var pillOption = document.querySelector('.pill-option[data-template="' + initialSelected + '"]');
            if (pillOption) {
                pill.innerHTML = pillOption.innerHTML;
                pill.setAttribute('style', (pillOption.getAttribute('style') || '') + ';display:flex;align-items:center;justify-content:center;');
            }
        }

        // If nothing rendered yet (editor may not be ready), retry a few times
        if (!pill.innerHTML || pill.innerHTML.trim() === '') {
            window.__ctfInitTries = (window.__ctfInitTries || 0) + 1;
            if (window.__ctfInitTries <= 10) {
                setTimeout(this.initializeSampleBoxWithExistingTemplate.bind(this), 150);
            } else {
                window.__ctfInitTries = 0;
            }
        } else {
            window.__ctfInitTries = 0;
        }
    }
} 