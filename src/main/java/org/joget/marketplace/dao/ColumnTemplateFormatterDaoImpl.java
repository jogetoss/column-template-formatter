package org.joget.marketplace.dao;

import java.util.List;

import org.joget.apps.app.service.AppUtil;
import org.joget.commons.spring.model.AbstractSpringDao;
import org.joget.commons.util.LogUtil;
import org.joget.marketplace.model.ColumnTemplateFormatterModel;
import org.springframework.beans.BeansException;
import org.springframework.transaction.TransactionException;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

public class ColumnTemplateFormatterDaoImpl extends AbstractSpringDao implements ColumnTemplateFormatterDao {

    @Override
    public Boolean saveTemplate(org.joget.marketplace.model.ColumnTemplateFormatterModel formatter) {
        try {
            TransactionTemplate transactionTemplate = (TransactionTemplate) AppUtil.getApplicationContext().getBean("transactionTemplate");
            Boolean result = (Boolean) transactionTemplate.execute(new TransactionCallback() {
                @Override
                public Object doInTransaction(TransactionStatus ts) {
                    save("ColumnTemplateFormatter", formatter);
                    return true;
                }
            });
            return result;
        } catch (BeansException | TransactionException e) {
            LogUtil.error(ColumnTemplateFormatterDaoImpl.class.getName(), e, "Add addSlaEventEntry Error! : " + e.getMessage());
            return false;
        }
    }
    
    @Override
    public List<ColumnTemplateFormatterModel> getAllTemplates() {
        try {
            TransactionTemplate transactionTemplate = (TransactionTemplate) AppUtil.getApplicationContext().getBean("transactionTemplate");
            List<ColumnTemplateFormatterModel> result = (List<ColumnTemplateFormatterModel>) transactionTemplate.execute(new TransactionCallback() {
                @Override
                public Object doInTransaction(TransactionStatus ts) {
                    return find("ColumnTemplateFormatter", "", null, null, null, null, null);
                }
            });
            return result;
        } catch (BeansException | TransactionException e) {
            LogUtil.error(ColumnTemplateFormatterDaoImpl.class.getName(), e, "Error retrieving all templates: " + e.getMessage());
            return null;
        }
    }
}
