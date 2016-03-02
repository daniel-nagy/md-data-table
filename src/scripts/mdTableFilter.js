'use strict';

angular.module('md.data.table')
    .filter('mdTableColumnarFilter', columnarFilter);

function columnarFilter(){
    //utility for nested strings in column orderBy / column searchBy
    //this handles cases where the value is nested within the data object
    //example is when the location of the column is orderBy/searchBy value "myData.obj.name"
    var resolveValue = function(obj, prop) {
        var _index = prop.indexOf('.');
        if(_index > -1) {
            return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
        }

        return obj[prop];
    };


    return function (values, columns) {
        var result = values;
        columns.forEach(function(col){
            // if a column has an orderBy already use that. otherwise a searchBy can be specified.
            var colId = col.orderBy ? col.orderBy : col.searchBy;
            //if an orderBy or searchBy value is set and the column filter has a value, it will filter on that column
            if(colId && col.filter){
                //filter the current set of values
                result = result.filter(function(row){
                    var val = (resolveValue(row, colId));
                    return val && val.toString().toLowerCase().indexOf(col.filter.toLowerCase()) !== -1;
                });
            }
        });
        return result;
    };
}