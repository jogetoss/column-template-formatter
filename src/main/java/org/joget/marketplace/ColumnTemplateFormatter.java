package org.joget.marketplace;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.ServletException;

import org.joget.apps.app.model.AppDefinition;
import org.joget.apps.app.service.AppPluginUtil;
import org.joget.apps.app.service.AppUtil;
import org.joget.apps.datalist.model.DataList;
import org.joget.apps.datalist.model.DataListColumn;
import org.joget.apps.datalist.model.DataListColumnFormatDefault;
import org.joget.apps.datalist.model.DataListRow;
import org.joget.apps.datalist.service.DataListService;
import org.joget.commons.util.LogUtil;
import org.joget.marketplace.context.AppContext;
import org.joget.marketplace.dao.ColumnTemplateFormatterDao;
import org.joget.plugin.base.PluginWebSupport;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;

public class ColumnTemplateFormatter extends DataListColumnFormatDefault implements PluginWebSupport {

    private final static String MESSAGE_PATH = "messages/ColumnTemplateFormatter";

    @Override
    public String getName() {
        return AppPluginUtil.getMessage("org.joget.marketplace.ColumnTemplateFormatter.pluginLabel", getClassName(), MESSAGE_PATH);
    }

    @Override
    public String getVersion() {
        return "8.0.1";
    }

    @Override
    public String getDescription() {
        return AppPluginUtil.getMessage("org.joget.marketplace.ColumnTemplateFormatter.pluginLabel.desc", getClassName(), MESSAGE_PATH);
    }

    @Override
    public String getLabel() {
        return AppPluginUtil.getMessage("org.joget.marketplace.ColumnTemplateFormatter.pluginLabel", getClassName(), MESSAGE_PATH);
    }

    @Override
    public String getClassName() {
        return getClass().getName();
    }

    @Override
    public String getPropertyOptions() {
        return AppUtil.readPluginResource(getClassName(), "/properties/ColumnTemplateFormatter.json", null, true, MESSAGE_PATH);
    }

    @Override
    public String format(DataList dataList, DataListColumn dataListColumn, Object row, Object value) {
        String columnValue = extractColumnValue(dataListColumn, row, value);

        // Check if conditional formatting is enabled
        boolean useConditionalFormatting = "true".equals(getPropertyString("useConditionalFormatting"));

        if (useConditionalFormatting) {
            // Try to get a conditional template
            String conditionalTemplate = getConditionalTemplate(columnValue);

            if (conditionalTemplate != null) {
                // Apply conditional template
                return replaceLastTextContent(conditionalTemplate, columnValue);
            }
            // Fallback to default template if no conditional template matched
        }

        // Default template formatting (either fallback or if conditional formatting is disabled)
        String defaultTemplate = getTemplateHtmlFromEditor();
        return replaceLastTextContent(defaultTemplate, columnValue);
    }


    private String extractColumnValue(DataListColumn dataListColumn, Object row, Object value) {
        if (value != null) {
            return value.toString();
        }

        String columnName = dataListColumn.getName();
        if (columnName == null || columnName.isEmpty()) {
            return "";
        }

        if (row instanceof DataListRow) {
            Object rowValue = ((DataListRow) row).get(columnName);
            if (rowValue != null) {
                return rowValue.toString();
            }
        }

        Object evaluated = DataListService.evaluateColumnValueFromRow(row, columnName);
        if (evaluated != null) {
            return evaluated.toString();
        }

        if (row instanceof java.util.Map) {
            java.util.Map rowData = (java.util.Map) row;
            Object mapValue = rowData.get(columnName);
            if (mapValue == null) {
                mapValue = rowData.get(columnName.toLowerCase());
            }
            if (mapValue != null) {
                return mapValue.toString();
            }
        }

        return "";
    }

    private String getConditionalTemplate(String columnValue) {
        try {
            String valueTemplateMapJson = getPropertyString("valueTemplateMap");
            if (valueTemplateMapJson != null && !valueTemplateMapJson.trim().isEmpty() && !"undefined".equals(valueTemplateMapJson)) {
                JSONObject valueTemplateMap = new JSONObject(valueTemplateMapJson);
                if (valueTemplateMap.has(columnValue)) {
                    return valueTemplateMap.getString(columnValue);
                }
            }
        } catch (JSONException e) {
            // Log error but continue with default template
            System.err.println("Error parsing valueTemplateMap: " + e.getMessage());
        }
        return null;
    }

    private String getTemplateHtmlFromEditor() {
        return getPropertyString("templateEditor");
    }

    public static String replaceLastTextContent(String html, String replacement) {
        if (html == null || replacement == null) {
            return html;
        }

        Document doc = Jsoup.parseBodyFragment(html);
        Element body = doc.body();

        TextNode lastTextNode = findLastTextNode(body);
        if (lastTextNode != null) {
            lastTextNode.text(replacement);
        } else {
            Element target = body.select("span, div").last();
            if (target != null) {
                target.appendText(replacement);
            } else {
                body.appendText(replacement);
            }
        }

        return body.html();
    }

    private static TextNode findLastTextNode(Node node) {
        for (int i = node.childNodeSize() - 1; i >= 0; i--) {
            Node child = node.childNode(i);
            TextNode result = findLastTextNode(child);
            if (result != null) return result;
        }

        if (node instanceof TextNode) {
            TextNode textNode = (TextNode) node;
            if (!textNode.isBlank()) {
                return textNode;
            }
        }

        return null;
    }

    @Override
    public void webService(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("templates".equals(action)) {
            handleTemplatesAction(response);
        }
        if ("sampleBox".equals(action)) {
            handleSampleBoxAction(response);
        }
        if ("conditionalFormatting".equals(action)) {
            handleConditionalFormattingAction(response);
        }
        if ("generateAiTemplate".equals(action)) {
            handleGenerateAiTemplateAction(request, response);
        }
        if ("saveTemplate".equals(action)) {
            handleSaveTemplateAction(request, response);
        }
        if ("getAllTemplates".equals(action)) {
            handleGetAllTemplatesAction(response);
        }
    }

    private void handleTemplatesAction(javax.servlet.http.HttpServletResponse response) throws IOException {
        response.setContentType("application/javascript");
        String temp = AppUtil.readPluginResource(getClassName(), "/resources/lib/templates.html", null, false, null);
        String[] templates = temp.split("\r?\n\r?\n"); // Split by blank lines
        for (int i = 0; i < templates.length; i++) {
            templates[i] = "\"" + org.joget.commons.util.StringUtil.escapeString(templates[i], org.joget.commons.util.StringUtil.TYPE_JSON, null) + "\"";
        }
        String js = AppUtil.readPluginResource(getClassName(), "/resources/lib/ColumnTemplateFormatter.js", new Object[]{org.apache.commons.lang.StringUtils.join(templates, ", ")}, false, null);
        response.getWriter().write(js);
    }

    private void handleSampleBoxAction(javax.servlet.http.HttpServletResponse response) throws IOException {
        AppDefinition appDef = AppUtil.getCurrentAppDefinition();
        String[] arguments = new String[]{appDef.getId(), String.valueOf(appDef.getVersion()), appDef.getId(), String.valueOf(appDef.getVersion())};
        String layout = AppUtil.readPluginResource(this.getClass().getName(), "/resources/lib/SampleBox.js", arguments, false, MESSAGE_PATH);
        response.getWriter().write(layout);
    }

    private void handleConditionalFormattingAction(javax.servlet.http.HttpServletResponse response) throws IOException {
        response.setContentType("application/javascript");
        String js = AppUtil.readPluginResource(getClassName(), "/resources/lib/ConditionalFormatting.js", null, false, null);
        response.getWriter().write(js);
    }

        private void handleGenerateAiTemplateAction(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        
        try {
            String userPrompt = request.getParameter("prompt");
            if (userPrompt == null || userPrompt.trim().isEmpty()) {
                response.getWriter().write("{\"error\": \"No prompt provided\"}");
                return;
            }

            // Get configuration parameters from request
            String model = request.getParameter("model");
            String apiKey = request.getParameter("apiKey");
            String proxyDomain = request.getParameter("proxyDomain");
            
            // Validate API key
            if (apiKey == null || apiKey.trim().isEmpty()) {
                response.getWriter().write("{\"error\": \"API Key is required\"}");
                return;
            }
            
            // Call ChatGPT API with configuration
            String aiResponse = callChatGptApi(userPrompt, model, apiKey, proxyDomain);
            
            // Create proper JSON response
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("template", aiResponse);
            
            response.getWriter().write(jsonResponse.toString());
            
        } catch (Exception e) {
            response.getWriter().write("{\"error\": \"Failed to generate template: " + e.getMessage() + "\"}");
        }
    }

    private String callChatGptApi(String userPrompt, String model, String apiKey, String proxyDomain) throws IOException {
        // Use provided parameters or fallback to defaults
        if (model == null || model.trim().isEmpty()) {
            model = AppPluginUtil.getMessage("org.joget.marketplace.ColumnTemplateFormatter.model.default", getClassName(), MESSAGE_PATH);
        }
        
        if (proxyDomain == null || proxyDomain.trim().isEmpty()) {
            proxyDomain = AppPluginUtil.getMessage("org.joget.marketplace.ColumnTemplateFormatter.proxyDomain.default", getClassName(), MESSAGE_PATH);
        }

        String systemPrompt = AppPluginUtil.getMessage("org.joget.marketplace.ColumnTemplateFormatter.systemPrompt", getClassName(), MESSAGE_PATH);

        final String endPoint = proxyDomain + "/v1/chat/completions";
        
        // Create HTTP client
        org.apache.http.impl.client.CloseableHttpClient httpClient = org.apache.http.impl.client.HttpClients.createDefault();
        org.apache.http.client.methods.HttpPost postRequest = new org.apache.http.client.methods.HttpPost(endPoint);
        postRequest.addHeader("Content-Type", "application/json");
        postRequest.addHeader("Authorization", "Bearer " + apiKey);
        
        // Create request body
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", model);
        
        JSONArray messages = new JSONArray();
        
        JSONObject systemMessage = new JSONObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        messages.put(systemMessage);
        
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", userPrompt);
        messages.put(userMessage);
        
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 500);
        requestBody.put("temperature", 0.7);
        
        try {
            org.apache.http.entity.StringEntity params = new org.apache.http.entity.StringEntity(requestBody.toString());
            postRequest.setEntity(params);
            
            org.apache.http.HttpResponse response = httpClient.execute(postRequest);
            String responseBody = org.apache.http.util.EntityUtils.toString(response.getEntity());
            
            if (response.getStatusLine().getStatusCode() == 200) {
                JSONObject jsonResponse = new JSONObject(responseBody);
                JSONObject choice = jsonResponse.getJSONArray("choices").getJSONObject(0);
                JSONObject message = choice.getJSONObject("message");
                String content = message.getString("content");
                
                // Clean up the response - remove any markdown formatting if present
                content = content.trim();
                if (content.startsWith("```html")) {
                    content = content.substring(7);
                }
                if (content.endsWith("```")) {
                    content = content.substring(0, content.length() - 3);
                }
                content = content.trim();
                
                return content;
            } else {
                JSONObject errorResponse = new JSONObject(responseBody);
                String errorMessage = "API Error: " + errorResponse.getJSONObject("error").getString("message");
                throw new IOException(errorMessage);
            }
        } catch (Exception ex) {
            throw new IOException("Failed to call ChatGPT API: " + ex.getMessage(), ex);
        } finally {
            try {
                httpClient.close();
            } catch (IOException e) {
                // Ignore close errors
            }
        }
    }
    
    private void handleSaveTemplateAction(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        
        try {
            String templateHtml = request.getParameter("template");
            if (templateHtml == null || templateHtml.trim().isEmpty()) {
                response.getWriter().write("{\"error\": \"No template provided\"}");
                return;
            }

            // Create table if not exists and save template
            boolean isSaved = saveTemplateToDatabase(templateHtml);
            
            JSONObject jsonResponse = new JSONObject();
            if (isSaved) {
                jsonResponse.put("success", true);
                jsonResponse.put("message", "Template saved successfully to database");
            } else {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Failed to save template to database");
            }
            
            response.getWriter().write(jsonResponse.toString());
            
        } catch (Exception e) {
            response.getWriter().write("{\"error\": \"Failed to save template: " + e.getMessage() + "\"}");
        }
    }
    private boolean saveTemplateToDatabase(String templateHtml) {
        try {
            LogUtil.info(getClassName(), "Saving template to database...");
            
            ColumnTemplateFormatterDao dao = (ColumnTemplateFormatterDao) AppContext.getInstance().getAppContext().getBean("columnTemplateFormatterDao");
            
            // Generate template details
            String templateId = UUID.randomUUID().toString();
            String templateName = "Template_" + System.currentTimeMillis();

            // Create entity
            org.joget.marketplace.model.ColumnTemplateFormatterModel template = new org.joget.marketplace.model.ColumnTemplateFormatterModel();
            template.setId(templateId);
            template.setCreatedAt(new Date());
            template.setTemplateName(templateName);
            template.setTemplateHtml(templateHtml);
            template.setIsActive(true);

            // Save using DAO
            dao.saveTemplate(template);

            LogUtil.info(getClassName(), "Template saved successfully with ID: " + templateId);
            return true; // Indicate success
        } catch (Exception e) {
            LogUtil.error(getClassName(), e, "Error saving template to database: " + e.getMessage());
            e.printStackTrace();
            return false; // Indicate failure
        }
    }

    private void handleGetAllTemplatesAction(javax.servlet.http.HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        
        try {
            LogUtil.info(getClassName(), "Retrieving all templates from database...");
            
            ColumnTemplateFormatterDao dao = (ColumnTemplateFormatterDao) AppContext.getInstance().getAppContext().getBean("columnTemplateFormatterDao");
            
            // Get all templates from database
            java.util.List<org.joget.marketplace.model.ColumnTemplateFormatterModel> templates = dao.getAllTemplates();
            
            // Create JSON response
            JSONObject jsonResponse = new JSONObject();
            JSONArray templatesArray = new JSONArray();
            
            if (templates != null && !templates.isEmpty()) {
                for (org.joget.marketplace.model.ColumnTemplateFormatterModel template : templates) {
                    JSONObject templateJson = new JSONObject();
                    templateJson.put("id", template.getId());
                    templateJson.put("templateName", template.getTemplateName());
                    templateJson.put("templateHtml", template.getTemplateHtml());
                    templateJson.put("createdAt", template.getCreatedAt() != null ? template.getCreatedAt().getTime() : null);
                    templateJson.put("isActive", template.getIsActive());
                    templatesArray.put(templateJson);
                }
                
                jsonResponse.put("success", true);
                jsonResponse.put("templates", templatesArray);
                jsonResponse.put("count", templates.size());
                LogUtil.info(getClassName(), "Retrieved " + templates.size() + " templates from database");
            } else {
                jsonResponse.put("success", true);
                jsonResponse.put("templates", templatesArray);
                jsonResponse.put("count", 0);
                jsonResponse.put("message", "No templates found in database");
                LogUtil.info(getClassName(), "No templates found in database");
            }
            
            response.getWriter().write(jsonResponse.toString());
            
        } catch (Exception e) {
            LogUtil.error(getClassName(), e, "Error retrieving templates from database: " + e.getMessage());
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to retrieve templates: " + e.getMessage());
            response.getWriter().write(errorResponse.toString());
        }
    }
}
