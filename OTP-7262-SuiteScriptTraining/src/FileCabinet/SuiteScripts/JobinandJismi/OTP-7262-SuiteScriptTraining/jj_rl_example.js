/**
* @NApiVersion 2.0
* @NScriptType ClientScript
* @NModuleScope Public
*/
define(['N/currentRecord'],
    function(currentrecord) {


        function pageInit(scriptContext) {

            var currentRecord = scriptContext.currentRecord;
           //var actValue = document.getElementById({elementId: "custbody_jj_cs_checkbox_otp687"});
           // alert(actValue);
            var actValue = currentRecord.getValue({
              fieldId: 'custbody_jj_cs_checkbox_otp687_fs_inp'

            });

           // alert(actValue);
            console.log("checkbox",actValue);
           // var actValue = 'T';
            if (actValue == 'T'){
                currentRecord.setValue({
                    fieldId: 'memo',
                    value: 'Testing Completed'
                });
            }
            else{
                currentRecord.setValue({
                    fieldId: 'memo',
                    value: 'Testing Not Completed'
                });
            }

        }


        function fieldChanged(scriptContext) {

            var currentRecord = scriptContext.currentRecord;

            var textValue = currentRecord.getValue({
                fieldId: 'custbody_jj_cs_checkbox_otp687_fs_inp'

            });

            console.log("checkbox",textValue);
            if (textValue == 'T'){
                currentRecord.setValue({
                    fieldId: 'custbody_jj_cs_test_otp687',
                    value: 'Passed',
                    ignoreFieldChange: true
                });
                //console.log("Hi");
            }
        }


        return {
            pageInit: pageInit,
           fieldChanged: fieldChanged

        }

    });
 

 