{
    renderField: function() {
        var html = "<div id='sampleBoxContent' style='border:1.5px solid #d6e0ea; border-radius:12px; background:#f7fbff; padding:24px 16px; min-height:60px; font-size:1.08em; display:flex; align-items:center; justify-content:center;'>";
        html += "<span id='sampleBoxPill'></span>";
        html += "<div id='allPillTemplates' style='display:none;'></div>";
        html += "</div>";
        return html;
    },
    attachPillListeners: function(updateSampleBox) {
        var pillOptions = document.querySelectorAll('#pillTemplates .pill-option, #modalPillTemplates .pill-option');
        pillOptions.forEach(function(option) {
            option.onclick = function() {
                var selected = this.getAttribute('data-template');
                updateSampleBox(selected);
                var aceEditorDiv = document.querySelector('.ace_editor');
                if (aceEditorDiv && window.ace) {
                    var editor = window.ace.edit(aceEditorDiv);
                    var pillOption = document.querySelector('.pill-option[data-template="' + selected + '"]');
                    if (pillOption) {
                        var templateCode = pillOption.outerHTML;
                        editor.setValue(templateCode, -1); // -1 moves cursor to start
                    }
                }
                var templateModal = document.getElementById('templateModal');
                if (templateModal) templateModal.style.display = 'none';
            };
        });
    },
    updateSampleBox: function(selected) {
        var pill = document.getElementById('sampleBoxPill');
        var allPillTemplatesDiv = document.getElementById('allPillTemplates');
        var val = 'Sample Value';
        var pillOption = null;
        if (selected) {
            pillOption = document.querySelector('.pill-option[data-template="' + selected + '"]')
                || (allPillTemplatesDiv && allPillTemplatesDiv.querySelector('.pill-option[data-template="' + selected + '"]'));
        }
        if (pillOption && pill) {
            var style = pillOption.getAttribute('style') || '';
            style += 'display:flex;align-items:center;justify-content:center;';
            pill.setAttribute('style', style);
            pill.textContent = val;
        } else if (pill) {
            var style = "display:inline-block;border-radius:999px;padding:1.0em 2.5em;font-size:1em;font-weight:600;font-style:italic;min-width:80px;min-height:1.6em;text-align:center;margin-top:10px;margin-bottom:10px;box-sizing:border-box;";
            if (selected === 'warning') {
                style += "background:#fff3cd;color:#856404;";
            } else if (selected === 'failed') {
                style += "background:#f8d7da;color:#721c24;";
            } else {
                style += "background:#d4edda;color:#155724;";
            }
            pill.setAttribute('style', style);
            pill.textContent = val;
        }
    },
    setSampleBoxFromEditor: function() {
        var aceEditorDiv = document.querySelector('.ace_editor');
        if (aceEditorDiv && window.ace) {
            var editor = window.ace.edit(aceEditorDiv);
            var code = editor.getValue();
            var sampleBoxContent = document.getElementById('sampleBoxContent');
            if (sampleBoxContent) {
                sampleBoxContent.innerHTML = code;
            }
        }
    },
    attachEditorChangeListener: function() {
        var aceEditorDiv = document.querySelector('.ace_editor');
        if (aceEditorDiv && window.ace) {
            var editor = window.ace.edit(aceEditorDiv);
            editor.on('change', function() {
                var code = editor.getValue();
                var sampleBoxContent = document.getElementById('sampleBoxContent');
                if (sampleBoxContent) {
                    sampleBoxContent.innerHTML = code;
                }
            });
        }
    },
    initScripting: function() {
        var thisObj = this;
        var pill = document.getElementById('sampleBoxPill');
        var allPillTemplatesDiv = document.getElementById('allPillTemplates');
        if (window.allPillTemplates && allPillTemplatesDiv) {
            allPillTemplatesDiv.innerHTML = window.allPillTemplates.join('');
        }
        window.selectedTemplate = null;
        window.SampleBoxAttachPillListeners = function() {
            thisObj.attachPillListeners(thisObj.updateSampleBox);
        };
        var aceEditorDiv = document.querySelector('.ace_editor');
        var initialSelected = null;
        if (aceEditorDiv && window.ace) {
            var editor = window.ace.edit(aceEditorDiv);
            var code = editor.getValue();
            var match = code.match(/data-template=["']([^"']+)["']/);
            if (match) {
                initialSelected = match[1];
            }
        }
        function waitForAllPillTemplatesAndUpdate() {
            if (window.allPillTemplates && allPillTemplatesDiv) {
                allPillTemplatesDiv.innerHTML = window.allPillTemplates.join('');
                thisObj.updateSampleBox(initialSelected);
                setTimeout(function() { thisObj.updateSampleBox(initialSelected); }, 200);
            } else {
                setTimeout(waitForAllPillTemplatesAndUpdate, 50);
            }
        }
        window.SampleBoxAttachPillListeners();
        waitForAllPillTemplatesAndUpdate();
        thisObj.attachEditorChangeListener();
        thisObj.setSampleBoxFromEditor();
    }
} 