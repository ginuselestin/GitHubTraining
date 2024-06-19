/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {

        const afterSubmit = (scriptContext) => {
            //log.debug("worked");
            if (scriptContext.type == scriptContext.UserEventType.CREATE) {
               // log.debug("worked");
                const newRec = scriptContext.newRecord;
              //  log.debug("new record",newRec);
                if(newRec.type == record.Type.SALES_ORDER) {
                    var cusFields = newRec.getValue({ fieldId: 'entity'});
                   // log.debug("customer Fields",cusFields);
                    var cusRecord = record.load({
                        type: record.Type.CUSTOMER,
                        id: cusFields,
                        isDynamic: true
                    });
                    cusRecord.setValue({
                        fieldId: 'custentity_jj_test',
                        value: true
                    });

                    var recordId = cusRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                }

                if(newRec.type == record.Type.PURCHASE_ORDER){
                    var venFields = newRec.getValue({ fieldId: 'entity'});
                    log.debug("vendorr Fields",venFields);
                    var venRecord = record.load({
                        type: record.Type.VENDOR,
                        id: venFields,
                        isDynamic: true
                    });
                    venRecord.setValue({
                        fieldId: 'custentity_jj_test',
                        value: true
                    });

                    var recordId = venRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                }
            }

        }



        return {afterSubmit}

    });
