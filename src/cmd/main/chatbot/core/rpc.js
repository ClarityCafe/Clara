/**
 * Node.js RPC Client for chatbot instance.
 * @author Capuccno
 * @todo :kotoNyan:
 */ 
/**
 * @see {Link} https://stackoverflow.com/questions/10775351/combining-node-js-and-python 
 */
const zerorpc = require('zerorpc');
const rpc = new zerorpc.Client();
const res = new zerorpc.Server({
    // TODO: make it return JSON from the Pythonk server 
});

 
// make sure we bind this to localhost, probably use a config file for chatbot RPC
rpc.connect('http://localhost:3000');
// binding for server return
res.bind('http://localhost:4000');
 
/**
  * @todo add function for reply and send (event based)
  */
rpc.invoke('incoming', (error, reply) => {
    if (!error) {
          
    } else {
        return error;
    }
});

 