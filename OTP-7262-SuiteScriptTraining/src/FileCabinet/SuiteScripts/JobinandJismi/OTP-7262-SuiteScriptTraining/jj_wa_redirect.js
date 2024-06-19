/**
 *
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 * @NModuleScope public
 *
 *
 */
define(['N/record', 'N/runtime'],
    function(record, runtime) {
        function wfCreateRfQ(scriptContext) {
			
			var currentRecord = scriptContext.newRecord; 
			
			var title = currentRecord.getValue("title");
			
			var recordType = "customrecord_jj_customer_rating"; 
            var objRecord = record.create({
                type: recordType,
                isDynamic: true
            });
			
			objRecord.setValue({
                    fieldId: "custrecord_jj_name",
                    value: title
                }); 
				
			objRecord.setValue({
                    fieldId: "custrecord_jj_test_field",
                    value: "Test from Workflow"
                }); 
				
            var recordId = objRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
			
			return recordId; 
        }
		
        return {
            onAction : wfCreateRfQ
        }
})