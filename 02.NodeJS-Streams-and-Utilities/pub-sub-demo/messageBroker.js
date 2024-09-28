const events = {
    'user-created': []
};

function publish(eventType, ...params){
    if (!events[eventType]){
        return;
    }

    events[eventType].forEach(listener => listener.apply(null, params));
}

function subscribe(eventType, eventListener){
    if (!events[eventType]){
        events[eventType] = [];
    }

    events[eventType].push(eventListener);
}

function unsubscribe(eventType, eventListener){
    if (!events[eventType]){
        return;
    }

    events[eventType] = events[eventType].filter(listener => listener !== eventListener);
}

module.exports = {
    publish,
    subscribe,
    unsubscribe
}