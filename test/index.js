var assert = require("chai").assert;
var EventEmitter = require("events").EventEmitter;
var noop = require("no-op");
var SubEmitter = require("../");

describe("SubEmitter", function () {
	var emitter, parent;
	var prefix = "prefix:";

	beforeEach(function () {
		parent = new EventEmitter();
		emitter = new SubEmitter(parent, prefix);
	});

	describe("#addListener()", function () {
		it("Should register listeners on the parent under the correct prefix", function () {
			emitter.on("event", noop);
			var listeners = parent.listeners(prefix + "event");
			assert.lengthOf(listeners, 1, "one listener got registered");
		});
	});

	describe("#removeListener()", function () {
		it("Should properly remove the listener from the correct prefix", function () {
			emitter.on("event", noop);
			emitter.removeListener("event", noop);
			var listeners = parent.listeners(prefix + "event");
			assert.lengthOf(listeners, 0, "no listeners are left");
		});

		it("Should only remove one listener at a time", function () {
			emitter.on("event", noop);
			emitter.on("event", noop);
			emitter.removeListener("event", noop);
			var listeners = parent.listeners(prefix + "event");
			assert.lengthOf(listeners, 1, "one listener is left");
		});
	});

	describe("#removeAllListeners()", function () {
		it("Should remove all listeners from the parent", function () {
			emitter.on("event", noop);
			emitter.on("event", noop);
			emitter.on("event", noop);
			emitter.removeAllListeners();
			var listeners = parent.listeners(prefix + "event");
			assert.lengthOf(listeners, 0, "no listeners are left");
		});

		it("Should remove listeners by event if one is specified", function () {
			emitter.on("event", noop);
			emitter.on("event", noop);
			emitter.on("event2", noop);
			emitter.removeAllListeners("event");
			var listeners = parent.listeners(prefix + "event2");
			assert.lengthOf(listeners, 1, "one listener is left");
		});
	});

	describe("#emit()", function () {
		it("Should add prefix to event when emitting", function (done) {
			parent.on(prefix + "event", function () {
				done();
			});
			emitter.emit("event", "test");
		});

		it("Should emit to listeners on the SubEmitter", function (done) {
			emitter.on("event", function () {
				done();
			});
			emitter.emit("event", "test");
		});

		it("Should send the event payload as the first argument", function (done) {
			emitter.on("event", function (payload) {
				assert.equal(payload, "test", "is payload that got emitted");
				done();
			});
			emitter.emit("event", "test");
		});
	});

	describe("#listeners()", function () {
		it("Should return a list of listeners for a given event", function () {
			emitter.on("event", noop);
			emitter.on("event2", noop);
			var listeners = emitter.listeners("event");
			assert.lengthOf(listeners, 1, "contains one handler");
		});

		it("Should only return listeners registered on the SubEmitter", function () {
			parent.on(prefix + "event", noop);
			var listeners = emitter.listeners("event");
			assert.lengthOf(listeners, 0, "doesn't see any listeners");
		});
	});
});
