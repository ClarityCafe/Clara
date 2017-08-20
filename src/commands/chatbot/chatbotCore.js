/**
 * @file a Chatbot using tensorflow. idk what else to say
 * @todo meme satania
 * @author Capuccino
 */
 const tf = require('tensorflow2');

 /**
  * A class the handles text-based neural intelligence
  */
 class Chatbot {
     /**
      * 
      * @param {String} dataPath path of where the data is
      * @param {String} convoFile the corpus file for convos
      * @param {String} lineFile the corpus file for lines
      * @param {String} outputFile  the output corpus file 
      * @param {String} processedPath the path on where to dump processed files for caching
      * @param {String} checkpoints path of where to place the checkpoints
      */
     constructor(dataPath, convoFile, lineFile, outputFile, processedPath, checkpoints) {
         this.dataPath = dataPath,
         this.convoFile = convoFile,
         this.outputFile = outputFile,
         this.processedPath = processedPath,
         this.checkpoints =checkpoints;
     }
 }

 module.exports = Chatbot;