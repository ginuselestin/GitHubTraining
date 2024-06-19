/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
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
                    title: 'SALES ORDER'
                });


                var training = form.addFieldGroup({
                    id: 'training',
                    label: ' '
                });
                var name = form.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name',
                    container: 'training'
                });
                var select = form.addField({
                    id: 'department',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Department',
                    container: 'training'
                });
                select.addSelectOption({
                    value: ' ',
                    text: ' '
                });
                select.addSelectOption({
                    value: 'Sales',
                    text: 'Sales'
                });
                select.addSelectOption({
                    value: 'Marketing',
                    text: 'Marketing'
                });
                select.addSelectOption({
                    value: 'Production',
                    text: 'Production'
                });
                select.addSelectOption({
                    value: 'Development',
                    text: 'Development'
                });
                select.addSelectOption({
                    value: 'Functional',
                    text: 'Functional'
                });

                var personal = form.addFieldGroup({
                    id: 'personal',
                    label: 'Personal Information'
                });
                //personal.isSingleColumn = true;


                var email = form.addField({
                    id: 'email',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Email',
                    container: 'personal'
                });
                var phone = form.addField({
                    id: 'phone',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Phone Number',
                    container: 'personal'
                });
                var subtab = form.addSubtab({
                    id: 'subtab1id',
                    label: 'Training Information'
                });

                var sublist = form.addSublist({
                    id: 'sublistid',
                    type: serverWidget.SublistType.LIST,
                    label: 'Training Information',
                    subtab: 'subtab1id'
                });
                var select1 = sublist.addField({
                    id: 'salesorder',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sales Order'
                });
                var select2 = sublist.addField({
                    id: 'entity',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Entity'
                });
                var select3 = sublist.addField({
                    id: 'subsidiary',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subsidiary'
                });

                var select4 = sublist.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name'
                })
                var select5 = sublist.addField({
                    id: 'trandate',
                    type: serverWidget.FieldType.TEXT,
                    label: ' Order Date'
                });


                var mySalesOrder = search.create({
                    type: search.Type.SALES_ORDER,
                    title: 'My SalesOrder Search',
                    id: 'customsearch_my_so_search',
                    columns: [
                        {
                            name: 'tranid'
                        },
                        {
                            name: 'entity'
                        }, {
                            name: 'subsidiary'
                        }, {
                            name: 'name'
                        }, {
                            name: 'trandate'
                        }
                    ],
                    filters: [{
                        name: 'mainline',
                        operator: 'is',
                        values: ['T']
                    }],
                });

                var result = mySalesOrder.run().getRange({

                    start: 0,

                    end: 10

                });
                for (var i = 0; i < result.length; i++) {

                    var salesOrder = result[i].getValue({

                        name: 'tranid'

                    });

                    var customer = result[i].getValue({

                        name: 'entity'

                    });
                    var subsidiary = result[i].getValue({

                        name: 'subsidiary'

                    });
                    var name = result[i].getText({

                        name: 'name'

                    });
                    var trandate = result[i].getValue({

                        name: 'trandate'

                    });




                    sublist.setSublistValue({
                        id: 'salesorder',
                        value: salesOrder,
                        line: i

                    });
                    sublist.setSublistValue({
                        id: 'trandate',
                        value: trandate,
                        line: i

                    });

                    sublist.setSublistValue({
                        id: 'entity',
                        value: customer,
                        line: i

                    });

                    sublist.setSublistValue({
                        id: 'subsidiary',
                        value: subsidiary,
                        line: i

                    });
                    sublist.setSublistValue({
                        id: 'name',
                        value: name,
                        line: i

                    });


                }

            }


            scriptContext.response.writePage(form);

        }

        return {onRequest}

    });
