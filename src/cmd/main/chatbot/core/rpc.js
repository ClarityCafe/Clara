/**
 * Node.js RPC Client for chatbot instance.
 * @author Capuccno
 * @todo :kotoNyan:
 */ 
/**
 * @see {Link} https://stackoverflow.com/questions/10775351/combining-node-js-and-python 
 */
 const zeropc = require('zeropc');
 const rpc = new zeropc.Client();
 
 // make sure we bind this to localhost, probably use a config file for chatbot RPC
 rpc.connect('http://localhost:3000');
 
 /**
  * @todo add function for reply and send (event based)
  */
 