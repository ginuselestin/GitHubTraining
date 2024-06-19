/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/http', 'N/ui/serverWidget'],
    /**
 * @param{http} http
 * @param{serverWidget} serverWidget
 */
    (http, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (context.request.method === 'GET') {
                var response = http.get({
                    url: 'https://api.coindesk.com/v1/bpi/currentprice.json'
                });
    
                var responseBody = JSON.parse(response.body);
                var disclaimer = responseBody.disclaimer;
                var updatedTime = responseBody.time.updated;
                var bitcoinPrices = responseBody.bpi;
    
                var form = serverWidget.createForm({
                    title: 'Bitcoin Price List'
                });
                form.addField({
                    id: 'custpage_disclaimer',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Disclaimer',
                    defaultValue: disclaimer
                });
                form.addField({
                    id: 'custpage_updated_time',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Updated Time',
                    defaultValue: 'Last Updated: ' + updatedTime
                });
    
                // Add sublist to display Bitcoin prices
                var sublist = form.addSublist({
                    id: 'custpage_bitcoin_prices',
                    type: serverWidget.SublistType.LIST,
                    label: 'Bitcoin Prices',
                });
                sublist.addField({
                    id: 'currency',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Currency'
                });
                sublist.addField({
                    id: 'rate',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Rate'
                });
                sublist.addField({
                    id: 'description',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Description'
                });
                sublist.addField({
                    id: 'rate_float',
                    type: serverWidget.FieldType.FLOAT,
                    label: 'Rate in Float'
                });
                for (var currency in bitcoinPrices) {
                    sublist.setSublistValue({
                        id: 'currency',
                        line: sublist.getLineCount(),
                        value: currency
                    });
                    sublist.setSublistValue({
                        id: 'rate',
                        line: sublist.getLineCount(),
                        value: bitcoinPrices[currency].rate
                    });
                    sublist.setSublistValue({
                        id: 'description',
                        line: sublist.getLineCount(),
                        value: bitcoinPrices[currency].description
                    });
                    sublist.setSublistValue({
                        id: 'rate_float',
                        line: sublist.getLineCount(),
                        value: parseFloat(bitcoinPrices[currency].rate_float)
                    });
                }
                form.addButton({
                    id: 'custpage_refresh_button',
                    label: 'Refresh',
                    functionName: 'refreshPage'
                });
    
                // Output the form
                context.response.writePage(form);
            }
    

        }

        return {onRequest}

    });
