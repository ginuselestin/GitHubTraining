/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record'],
    /**
     * @param {log} log
     * @param {record} record
     */
    (log, record) => {
 
        /**
         * Function executed before a record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            try {
                let newRecord = scriptContext.newRecord;
 
                // Log the entire newRecord object to inspect its contents
                log.debug('New Record Object', newRecord);
 
                // Check if the event type is CREATE or EDIT for a Customer record
                if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {
                    if (newRecord.type == record.Type.CUSTOMER) {
 
                        // Log the entityid and datecreated fields to debug
                        let custName = newRecord.getValue({ fieldId: 'entityid' });
                        let dateCreated = newRecord.getValue({ fieldId: 'datecreated' });
 
                        log.debug('Customer Name', custName);
                        log.debug('Date Created', dateCreated);
 
                        // if (custName && dateCreated) {
                        //     // Construct the short name based on the provided convention
                        //     let shortName = custName.slice(0,2);
 
                        //     // Set the short name on the record
                        //     newRecord.setValue({
                        //         fieldId: 'custentity_short_name',
                        //         value: shortName
                        //     });
                        // }
                    }
                }
            } catch (e) {
                log.error({
                    title: 'Error Updating Short Name',
                    details: e.toString()
                });
            }
        };
 
        return {
            afterSubmit: afterSubmit
        };
    });
 