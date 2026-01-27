const events: { [key: string]: ((evt: unknown) => void)[] } = {};

export function subscribe(name: string, callback: (evt: unknown) => void) {
    if (!events[name]) {
        events[name] = [];
    }

    if (events[name].find(x => x === callback)) {
        return;
    }

    events[name].push(callback);
}

export function publish(name: string, data: unknown) {
    if (events[name]) {
        events[name].forEach(x => x(data));
    }
}

export function unsubscribe(name: string, callback: (evt: unknown) => void) {
    if (events[name]) {
        events[name] = events[name].filter(x => x !== callback);
    }
}

export function once(name: string, callback: (evt: unknown) => void) {
    const wrapper = (evt: unknown) => {
        callback(evt);
        unsubscribe(name, callback);
    };

    subscribe(name, wrapper);
}