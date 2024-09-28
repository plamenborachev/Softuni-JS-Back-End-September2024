const events = require('events');
let messageBroker = new events.EventEmitter();

const messageReceivedHandler = (message) => {
    console.log(`Message received: ${message}`);
};

//Subscribe
messageBroker.on('message_received', messageReceivedHandler);

//Publish
messageBroker.emit('message_received', 'Hello Pesho!');

//Unsubscribe
messageBroker.off('message_received', messageReceivedHandler);

messageBroker.emit('message_received', 'Hello Pesho!');

//to run:
//node .\events.js