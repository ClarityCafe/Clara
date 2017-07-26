/**
 * @file Database.js
 * @description Databse handler class
 * @author Capuccino
 */

 const redis = require('redis');

 /**
  * Handles all of the Databse-related queries.
  * @example const DB = new(require('./Database'))();
  */
 class Database extends redis {
     constructor({options}) {
         //idk if there's a cleaner way to do this
         super(redis.RedisClient({}));
         redis.createClient(options);
     }
     makeTable() {
         /** @todo we'll need this later */
     }
 }

 exports.module = Database;