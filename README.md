# subemitter
Link to a parent emitter and prefix all events. Easily remove all registered listeners.

```
npm install --save subemitter
```

## Example

```javascript
var SubEmitter = require("subemitter");
var EventEmitter = require("events").EventEmitter;

var log = console.log.bind(console);

var emitter = new EventEmitter();

var people = new SubEmitter(emitter, "people:");
var robots = new SubEmitter(emitter,  "robots:");

emitter.on("hello", log);

// Nothing happens
people.emit("hello", "world");

people.on("hello", "world");
people.emit("hello", "world"); // Logs "world"

emitter.on("robots:hello", log);
robots.emit("hello", "world"); // Logs "world"

people.removeAllListeners(); // Only removes listeners added by people
```

## API
The API is the same as [a regular EventEmtiter](https://nodejs.org/api/events.html) except that it uses a parent emitter for dispatching the events, prefixes all events (useful for namespacing), and keeps track of its own listeners so that it's easy to remove all of them while not affecting listeners added to the parent from elsewhere.

### `SubEmitter(parent, [prefix])`
Creates a new SubEmitter that uses the parent for relaying events. The prefix can be omitted to disable the prefixing feature.

### `SubEmitter#addListener(event, listener)` `SubEmitter#on(event, listener)`
Adds an event listener to the parent, automatically prefixing the event name.

Returns self for chaining

### `SubEmitter#removeListener(event, listener)`
Removes the event listener, prefixing the event. Only removes the listener if it was originally registered with the SubEmitter.

### `SubEmitter#removeAllListeners([event])`
Removes all listeners that were added through the SubEmitter. Leaves listeners registered via other SubEmitters or on the parent emitter directly. If an event is specified, only events registered under that name will be removed.

### `SubEmitter#emit(event, payload)`
Emits the event on the parent, prefixing the title. **Note:** only one argument is used for the event payload unlike the variable number of arguments in a regular event emitter. If you really need the original functionally, please submit an issue.

### `SubEmitter#listeners(event)`
Returns all listeners registered under the given event name.
