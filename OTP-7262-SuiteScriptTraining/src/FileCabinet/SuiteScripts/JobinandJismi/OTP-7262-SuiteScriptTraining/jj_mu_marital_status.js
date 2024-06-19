/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
 define(['N/record', 'N/search'],
 /**
* @param{record} record
* @param{search} search
*/
 (record, search) => {
     /**
      * Defines the Mass Update trigger point.
      * @param {Object} params
      * @param {string} params.type - Record type of the record being processed
      * @param {number} params.id - ID of the record being processed
      * @since 2016.1
      */
     const each = (params) => {

         let monthVisInfo = record.load({
             type: params.type,
             id: params.id,
         });
         monthVisInfo.setValue('custrecord_jj_matital_status', 2);
         monthVisInfo.save();
 }

     return {each}
 
});
