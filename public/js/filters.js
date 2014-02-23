'use strict';

angular.module('myApp.filters', []).
	// inspiration: http://justinklemm.com/angularjs-filter-ordering-objects-ngrepeat/
	filter('orderEmailBy', function () {
		// "true" is descending order, "false" is ascending order
		return function(items, field, reverse) {
			// convert the object into an indexed array
			var filtered = [];
			angular.forEach(items, function(item) {
				filtered.push(item);
			});
			// sort the array in ascending order by default
			filtered.sort(function (a, b) {
				return (a[field] > b[field]);
			});
			// if true passed, flip the sort order
			if(reverse) filtered.reverse();

			return filtered;
		};
	});