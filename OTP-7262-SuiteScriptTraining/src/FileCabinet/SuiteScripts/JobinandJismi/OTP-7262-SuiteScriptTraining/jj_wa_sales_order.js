/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record'], function (record) {
    function setSalesOrderResult(context) {
        if (context.newRecord) {
            // Get the 'Number' field value
            var numberValue = context.newRecord.getValue({
                fieldId: 'custbody_jj_number', // Replace with your 'Number' field internal ID
            });
            
            // Set the 'Result' field based on the 'Number' value
            var resultValue = numberValue >= 100 ? 'Result: Passed' : 'Result: Failed';
            
            // Set the 'Result' field value
            // context.newRecord.setValue({
            //     fieldId: 'custbody_jj_result', // Replace with your 'Result' field internal ID
            //     value: resultValue,
            // });
        }
        return resultValue;
    }
    return {
        onAction: setSalesOrderResult,
    };
});
