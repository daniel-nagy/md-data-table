"use strict";

angular.module('md.data.table').config(mdTableTheming);

function mdTableTheming($mdThemingProvider) {
    $mdThemingProvider.registerStyles("table.md-table td.md-cell { border-top-color: '{{foreground-4}}';} .md-table-pagination { border-top-color: '{{foreground-4}}'; }");
}

mdTableTheming.$inject = ['$mdThemingProvider'];