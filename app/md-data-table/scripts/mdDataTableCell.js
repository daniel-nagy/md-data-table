angular.module('md.data.table').directive('mdTableCell', mdTableCell);

function mdTableCell() {
	'use strict';
	
	function postLink(scope, element) {
		var select = element.find('md-select');
		
		if(select.length) {
			
			select.on('click', function (event) {
				event.stopPropagation();
			});
			
			element.addClass('clickable').on('click', function (event) {
				event.stopPropagation();
				select[0].click();
			});
		}
	}
	
	return {
		link: postLink
	};
}