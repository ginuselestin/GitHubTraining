/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/currentRecord', 'N/email', 'N/file', 'N/record', 'N/search'],
    /**
 * @param{currentRecord} currentRecord
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{search} search
 */
    (currentRecord, email, file, record, search) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */


        const getInputData = (inputContext) => {

            return search.create({
                type: record.Type.SALES_ORDER,
                filters:[['trandate','within','thismonth'],'and',['mainline','is','true']],
                columns: [
                    'salesrep',
                    'tranid',
                ],
                title: 'Sales Order Search'
            });


        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {

            var searchResult = JSON.parse(mapContext.value);

           // var details1 = [];


            var salesRep = searchResult.values['salesrep'];


           var salesrepId = salesRep.value;


           if(salesrepId){


                log.debug("sales reps are",salesRep.value);
               var soOrId = searchResult.id;

            //log.debug("search",searchResult);

           // log.debug("sales order id", soOrId);


                var details = [];

                 var repDetails = search.lookupFields({
                    type: search.Type.SALES_ORDER,
                    id:soOrId,
                    columns: ['salesrep','tranid', 'entity', 'email', 'amount'],
                 });
                var cust = repDetails['entity'];
                var custId = cust[0].text;
                var soId = repDetails['tranid'];
                var amt = repDetails['amount'];
                var cusEmail = repDetails['email'];
                var rep = repDetails['salesrep'];
                var repId = rep[0].value;
            //log.debug("sales rep id is",repId);
              //  log.debug("rep details",rep);






           // details += soId + ',' + cust.value + ',' + amt + ',' + cusEmail+ '\n';

                details.push(custId);
               details.push(cusEmail);
               details.push(soId);
                details.push(amt);



            //log.debug("details", details);

                 log.debug("not null sales rep");

                mapContext.write({
                    key: repId,
                    value: details
                });


           }

            else {

                log.debug("null sales rep");

               var salesId1 = searchResult.id;
               log.debug("sales order id",salesId1);


               var details1 = [];

               var repDetails1 = search.lookupFields({
                   type: search.Type.SALES_ORDER,
                   id:salesId1,
                   columns: ['salesrep','tranid', 'entity', 'email', 'amount'],
               });
               var cust1 = repDetails1['entity'];
               var custId1 = cust1[0].text;
               var soId1 = repDetails1['tranid'];
               var amt1 = repDetails1['amount'];
               var cusEmail1 = repDetails1['email'];
               //log.debug("sales rep id is",repId1);
               //  log.debug("rep details",rep1);






               // details1 += soId1 + ',' + cust1.value + ',' + amt1 + ',' + cusEmail1+ '\n';
               details1.push(custId1);
               details1.push(cusEmail1);
               details1.push(soId1);
               details1.push(amt1);



               log.debug("details 1",details1);

               //log.debug("details", details1);
               var adKey = -5;

               mapContext.write({
                   key: adKey,
                   value: details1
               });


            }




        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

            var salesRep = reduceContext.key;
            var values1 = reduceContext.values;
            var len = values1.length;
           log.debug("sales rep", salesRep);
           // log.debug("values", values1);
           // log.debug("length",len);
           // log.debug("sales order id",salesId);

            var content ='Customer Name, Customer Email, Sales Order document Number, Sales Amount\n';

          /*  for (var i = 0;i <len; i++) {
                //content += values1[i].toString() + '\n';
                content += [values1[i]].join(',')+ '\n';

            }*/


            for(var i=0; i<len;i++) {

                var c1 = JSON.parse(reduceContext.values[i]);
                // var len1 = c1.length;
                //log.debug("each row length",len1);
                for (var j = 0; j < c1.length; j++) {

                    content += c1[j];
                    content += ',';

                }
                content += '\n';
            }



            reduceContext.write({
                key: salesRep,
                value: content
            });
        }





        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
            log.debug("Hi");


             summaryContext.output.iterator().each(function (key, values) {
                 //log.debug("key",key);
                 //log.debug("values are", values);
                 var csvFile = file.create({
                     name: 'search_csv_file.csv',
                     fileType: file.Type.CSV,
                     contents: values,
                     folder: '6'
                 })
                 var adminKey = -5;


                 if(key == adminKey) {

                     email.send({
                         author: -5,
                         recipients: key,
                         subject: 'Previous month sales reports',
                         body: "Hi Previous month sales reports is attached. Please find attachment. Also Please add sales reps for the corresponding customers.",
                         attachments: [csvFile]
                     });

                 }
                 else
                 {


                     email.send({
                         author: -5,
                         recipients: key,
                         subject: 'Previous month sales reports',
                         body: "Hi Previous month sales reports is attached. Please find attachment.",
                         attachments: [csvFile]
                     });
                 }
                 csvFile.save();

                 return true;

             });


        }

        return {getInputData, map, reduce, summarize}

    });
