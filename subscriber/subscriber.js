const PubSub = require('@google-cloud/pubsub');

//add debug output in case of warning
process.on('warning', e => console.warn(e.stack));

//listen to sigint
process.on('SIGINT', () => {
  console.log("registered SIGINT, shutting down");
  process.exit(1);
});

var project_id        = process.env.PROJECT_ID;
var keyfile           = process.env.KEYFILE || "/etc/keyfile.json";
var subscriptionname  = process.env.SUBSCRIPTION;
var maxBacklog        = process.env.MAXBACKLOG || 2;

/*
 *  check variables
 */
if ( typeof project_id === 'undefined' ) {
  throw ( new Error("no project_id defined") );
}

if ( typeof subscriptionname === 'undefined' ) {
  throw ( new Error("no subscription name defined") );
}

const pubsub = new PubSub({
  projectId: project_id,
  keyFilename: keyfile
});

/*
 *  get the subscription and read from it 
 *  periodically, which simulates some load
 */

var subscription    = pubsub.subscription( subscriptionname );

//stores messages we are currently working on
var messageBacklog  = [];

var messageWorker = function ( message ) {
  //just an example
  console.log( "worked on message " + message.id );
  console.log( message.data );

  //remove message from backglog
  let i = messageBacklog.indexOf( message );
  messageBacklog.splice( i, 1 );

  //msg removed from backlog, its safe to resubscribe to the event
  if ( !subscription.listeners("message").includes( onMessage ) ) {
    subscription.on( "message", onMessage );
  }
}

var onMessage = function ( message ) {
  //first ack message to avoid multiple instances working on it
  message.ack();
  messageBacklog.push( message );

  //the delay is just for simulating the worker to actually take some time
  setTimeout( messageWorker, 5000, message );

  //if backlog is full, stop listening to event
  if ( messageBacklog.length >= maxBacklog ) {
    console.log( "message backlog full, will stop working on message queue, until there is space in the message backlog");
    subscription.removeListener( "message", onMessage );
  }
}

subscription.on( "message", onMessage );
