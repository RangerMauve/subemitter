module.exports = SubEmitter;

function SubEmitter(parent, prefix) {
	if (!(this instanceof SubEmitter))
		return new SubEmitter(parent, prefix);

	this._prefix = prefix || "";
	this._parent = parent;
	this._handlers = [];
}

SubEmitter.prototype = {
	_prefix: "",
	_parent: null,
	_handlers: null,
	addListener: addListener,
	on: addListener,
	once: once,
	removeListener: removeListener,
	removeAllListeners: removeAllListeners,
	listeners: listeners,
	emit: emit
}

function addListener(event, handler) {
	this._handlers.push({
		event: event,
		handler: handler
	});

	this._parent.addListener(this._prefix + event, handler);

	return this;
}

function once(event, handler) {
	this._handlers.push({
		event: event,
		handler: handler
	});

	this._parent.once(this._prefix + event, handler);

	return this;
}

function removeListener(event, handler) {
	var has_removed = false;
	this._handlers = this._handlers.filter(function (item) {
		if (has_removed) return true;
		if (item.handler !== handler) return true;
		has_removed = true;
		return false;
	});

	if (has_removed)
		this._parent.removeListener(this._prefix + event, handler);

	return this;
}

function removeAllListeners(event) {
	var prefix = this._prefix;
	var parent = this._parent;

	this._handlers.forEach(function (handler) {
		if (event && handler.event !== event) return;
		parent.removeListener(prefix + handler.event, handler.handler);
	});

	return this;
}

function listeners(event) {
	return this._handlers.reduce(function (result, handler) {
		if (handler.event === event)
			result.push(handler.handler);
		return result;
	}, []);
}

function emit(event, payload) {
	return this._parent.emit(this._prefix + event, payload);
}
