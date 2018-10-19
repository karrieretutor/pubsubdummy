const PubSub = require('@google-cloud/pubsub');

var project_id  = process.env.PROJECT_ID;
var keyfile     = process.env.KEYFILE;

//check if variables are defined/assign default values
if ( typeof project_id === 'undefined' ) {
  console.log("ERR: no project_id");
  process.exit(1);
}

if ( typeof keyfile === 'undefined' ) {
  keyfile = "/etc/keyfile.json"
}

const pubsub = new PubSub({
  projectId: project_id,
  keyFilename: keyfile
});

console.log(pubsub);

pubsub.getSubscriptions( (err, subscriptions) => {
  if (!err)  {
    console.log(subscriptions);
  }
  else {
    console.log(err);
  }
});
