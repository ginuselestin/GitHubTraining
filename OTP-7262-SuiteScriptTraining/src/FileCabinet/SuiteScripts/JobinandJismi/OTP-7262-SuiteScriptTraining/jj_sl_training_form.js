/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/currentRecord', 'N/record', 'N/ui/serverWidget',
    'N/search'],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (currentRecord, record, serverWidget, search) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            if (scriptContext.request.method === 'GET') {
                var form = serverWidget.createForm({
                    title: 'CUSTOMER INFORMATION FORM'
                });
               // form.clientScriptFileId = 8966;


                var customerinfo = form.addFieldGroup({
                    id: 'customerinfo',
                    label: 'Primary Information '
                });
                var name = form.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name',
                    container: 'customerinfo'
                });
                var cusemail = form.addField({
                    id: 'cusemail',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Email',
                    container: 'customerinfo'
                });
                var phone = form.addField({
                    id: 'phone',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Phone Number',
                    container: 'customerinfo'
                });
               var salesrep = form.addField({
                    id: 'salesrep',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Sales Rep',
                    container: 'customerinfo'
                });
                salesrep.addSelectOption({
                    value: ' ',
                    text: ' '
                });
                salesrep.addSelectOption({
                    value: 'Will O Clark',
                    text: 'Will O Clark'
                });
                salesrep.addSelectOption({
                    value: 'Joel S Metzger',
                    text: 'Joel S Metzger'
                });

                var subsidiary = form.addField({
                    id: 'subsidiary',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Subsidiary',
                    container: 'customerinfo'
                });
                subsidiary.addSelectOption({
                    value: ' ',
                    text: ' '
                });



                var mySubsidiary = search.create({
                    type: search.Type.SUBSIDIARY,
                    title: 'My Subsidiary Search',
                    id: 'customsearch_my_sub_search',
                    columns: [
                        {
                            name: 'name'
                        }
                    ],
                });

                var result1 = mySubsidiary.run().getRange({

                    start: 0,

                    end: 30

                });

                    for (var j = 0; j < result1.length; j++) {


                        var subsidiary1 = result1[j].getValue({

                            name: 'name'

                        });
                        subsidiary.addSelectOption({
                            value: subsidiary1,
                            text: subsidiary1

                        });

                    }

                    var but = form.addSubmitButton({
                        label: 'Submit'
                    });


                scriptContext.response.writePage(form);
            }

            else {
                var cusNameField = scriptContext.request.parameters.name;
                var cusEmailField = scriptContext.request.parameters.cusemail;
                var cusPhoneField = scriptContext.request.parameters.phone;
                var cusSubsidiaryField = scriptContext.request.parameters.subsidiary;
                var cusSalesrepField = scriptContext.request.parameters.salesrep;
                scriptContext.response.write('<b><h2>The customer details are:</b></h2>'
                    + '<br/><br><h4> Name: ' + cusNameField
                    + '<br/><br> Email: ' + cusEmailField
                    + '<br/><br> Phone: ' + cusPhoneField
                    + '<br/><br> Subsidiary: ' + cusSubsidiaryField
                    + '<br/><br> Salesrep: ' + cusSalesrepField + '</h4><br><br>');


                var cusRecord = record.create({


                    type: record.Type.CUSTOMER,


                    isDynamic: true,

                });

                cusRecord.setValue('companyname', cusNameField);
                cusRecord.setValue('email', cusEmailField);
                cusRecord.setValue('phone', cusPhoneField);
                cusRecord.setText('subsidiary', cusSubsidiaryField);
                cusRecord.setText('salesrep', cusSalesrepField);

                var cusRecordId = cusRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                scriptContext.response.write('<h4>Record created with id' + ' ' + cusRecordId+'</h4>');

            }
        }

        return {onRequest}
    });