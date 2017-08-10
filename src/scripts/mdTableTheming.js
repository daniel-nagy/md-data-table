"use strict";

angular.module('md.data.table').config(mdTableTheming);

function mdTableTheming($mdThemingProvider) {
    $mdThemingProvider.registerStyles(mdDataTableThemeOverrides[".temp/md-theme.min.css"]);
}

mdTableTheming.$inject = ['$mdThemingProvider'];