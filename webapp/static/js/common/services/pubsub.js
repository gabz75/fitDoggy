define([
	'angular',
	'lodash',
	'rx'
], function (angular, _, rx) {
	'use strict';

	angular.module('common.pubsub', [])
		.service('pubsub', pubsub);

	pubsub.$inject = [];
	function pubsub() {
		var subjects = {},
			dog = {};
		this.subscribe = subscribe;
		this.dispose = dispose;
		this.notify = notify;
		this.initSubscriptions = initSubscriptions;

		function initSubscriptions() {
			subscribe('editDog', setDog);
		}

		function subscribe(topic, handler) {
			var subject = new rx.Subject();
			subjects[topic] = subject;
			return subject.subscribe(handler);
		}

		function getDog() {
			return dog;
		}

		function setDog(data) {
			dog = data;
		}

		function notify(topic, data) {
			subjects[topic].onNext(data);
		}

		function dispose(topic) {
			return function () {
				if (subjects[topic]) {
					subjects[topic].dispose();
				}
			}
		}
	}
});
