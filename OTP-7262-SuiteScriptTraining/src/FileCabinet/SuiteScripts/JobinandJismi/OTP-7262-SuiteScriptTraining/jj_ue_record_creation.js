/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/email', 'N/runtime', 'N/search'], function(record, email, runtime, search) {
    
    function afterSubmit(context) {
        var newRecord = context.newRecord;
        var oldRecord = context.oldRecord;

        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            var status = newRecord.getValue('status'); // Adjust this to your actual field ID for status
            log.debug("Status",status);
            var oldStatus = oldRecord ? oldRecord.getValue('status') : null;

            if (status === 'Shipped') {
                createInvoice(newRecord);
            } else if (oldStatus === 'Shipped' && status !== 'Shipped') {
                deleteInvoice(newRecord);
            }
        }
    }

    function createInvoice(newRecord) {
        try {
            var customerId = newRecord.getValue('entity'); // Adjust this to your actual field ID for customer
            var invoiceRec = record.create({ type: record.Type.INVOICE, isDynamic: true });

            invoiceRec.setValue('entity', customerId);
            // Set other necessary fields and item lines on the invoice as needed
            // ...

            var invoiceId = invoiceRec.save();
            newRecord.setValue({ fieldId: 'custbody_related_invoice', value: invoiceId }); // Adjust this to your custom field ID
            newRecord.save();

            sendInvoiceEmail(invoiceId, customerId);
        } catch (e) {
            log.error('Error creating invoice', e);
        }
    }

    function deleteInvoice(newRecord) {
        try {
            var invoiceId = newRecord.getValue('custbody_related_invoice'); // Adjust this to your custom field ID
            if (invoiceId) {
                record.delete({ type: record.Type.INVOICE, id: invoiceId });
                newRecord.setValue({ fieldId: 'custbody_related_invoice', value: '' }); // Clear the custom field
                newRecord.save();
            }
        } catch (e) {
            log.error('Error deleting invoice', e);
        }
    }

    function sendInvoiceEmail(invoiceId, customerId) {
        try {
            var invoice = record.load({ type: record.Type.INVOICE, id: invoiceId });
            var customer = record.load({ type: record.Type.CUSTOMER, id: customerId });

            var emailAddress = customer.getValue('email');
            var invoiceTotal = invoice.getValue('total');
            var dueDate = invoice.getValue('duedate');

            var emailSubject = 'Your Invoice from Our Company';
            var emailBody = 'Dear Customer,<br><br>' +
                'Thank you for your purchase. Please find the details of your invoice below:<br><br>' +
                'Invoice Total: ' + invoiceTotal + '<br>' +
                'Due Date: ' + dueDate + '<br><br>' +
                'Best regards,<br>Your Company';

            email.send({
                author: runtime.getCurrentUser().id,
                recipients: emailAddress,
                subject: emailSubject,
                body: emailBody
            });
        } catch (e) {
            log.error('Error sending invoice email', e);
        }
    }

    return {
        afterSubmit: afterSubmit
    };

});