'use strict';

angular.module('ngEmailv2.filters', []).
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
				// return 1, -1, or 0 explicitly as Chrome does not like partial returns, ie: return (a[field] > b[field]);
				// also this makes testing easier by returning exact values 
				return (a[field] > b[field]) ? 1 : (a[field] < b[field]) ? -1 : 0;
			});
			// if true passed, flip the sort order
			if(reverse) filtered.reverse();

			return filtered;
		};
	});