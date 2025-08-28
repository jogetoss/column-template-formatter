package org.joget.marketplace.dao;

import java.util.List;

import org.joget.marketplace.model.ColumnTemplateFormatterModel;

public interface ColumnTemplateFormatterDao {
    Boolean saveTemplate(ColumnTemplateFormatterModel formatter);
    List<ColumnTemplateFormatterModel> getAllTemplates();
}
